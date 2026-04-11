from contextlib import asynccontextmanager
from typing import Any, cast

import pyvisa
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

rm: pyvisa.ResourceManager | None = None
equipment: dict[str, pyvisa.resources.MessageBasedResource] = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    global rm
    rm = pyvisa.ResourceManager()
    yield
    for resource in equipment.values():
        try:
            resource.write("SYST:LOC")
        except Exception:
            pass
        try:
            resource.close()
        except Exception:
            pass
    equipment.clear()
    if rm:
        rm.close()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    # React dev server in WSL2 — add your actual origin if different
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ConnectRequest(BaseModel):
    resource_string: str

class DisconnectRequest(BaseModel):
    resource_string:str


class CommandRequest(BaseModel):
    resource_string: str
    command: str
    read_response: bool = False


class CommandResponse(BaseModel):
    response: str | None = None


@app.get("/equipment")
def list_equipment() -> list[str]:
    """List all available VISA resources."""
    if rm is None:
        raise HTTPException(status_code=500, detail="Resource manager not initialized")
    try:
        return list(rm.list_resources())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/equipment/connect")
def connect_equipment(req: ConnectRequest) -> dict[str, Any]:
    """Open a connection to a piece of equipment."""
    if rm is None:
        raise HTTPException(status_code=500, detail="Resource manager not initialized")
    if req.resource_string in equipment:
        return {"status": "already connected", "resource": req.resource_string}
    try:
        device = cast(
            pyvisa.resources.MessageBasedResource,
            rm.open_resource(
                req.resource_string,
                resource_pyclass=pyvisa.resources.MessageBasedResource,
            ),
        )
        equipment[req.resource_string] = device
        return {"status": "connected", "resource": req.resource_string}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/equipment/command")
def send_command(req: CommandRequest) -> CommandResponse:
    """Send a SCPI command; optionally read the response."""
    device = equipment.get(req.resource_string)
    if device is None:
        raise HTTPException(
            status_code=404,
            detail=f"Not connected to {req.resource_string}. Call /equipment/connect first.",
        )
    try:
        if req.read_response:
            response = device.query(req.command)
            return CommandResponse(response=response.strip())
        else:
            device.write(req.command)
            return CommandResponse()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/equipment/disconnect")
def disconnect_equipment(req: DisconnectRequest) -> dict[str, str]:
    """Close the connection to a piece of equipment."""
    device = equipment.pop(req.resource_string, None)
    if device is None:
        raise HTTPException(status_code=404, detail=f"Not connected to {req.resource_string}")
    try:
        device.write("SYST:LOC")
    except Exception:
        pass  # not all instruments support SYST:LOC, ignore if it fails
    try:
        device.close()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {"status": "disconnected", "resource": req.resource_string}