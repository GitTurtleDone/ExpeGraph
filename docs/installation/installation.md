# ExpeGraph — Development Environment Setup

## Architecture Overview

ExpeGraph runs across two environments due to GPIB hardware constraints:

```
Windows (instrument control)
├── NI-VISA + NI-488.2          ← GPIB hardware drivers
└── Python / FastAPI (:8000)    ← instrument control + graph generation
        ↕ HTTP
WSL2 (data + UI)
├── .NET Web API (:5174)        ← data management + PostgreSQL
├── React + Vite (:5173)        ← frontend UI
└── PostgreSQL (:5432)          ← database
```

> **Why split?** WSL2 does not support NI-VISA or GPIB kernel drivers.
> NI software requires a native Windows environment.
> All other services run faster and more comfortably in WSL2.
> When a Prologix GPIB-USB adapter is used instead of NI GPIB-USB-HS,
> everything can move to WSL2 — only the `INSTRUMENT_BASE` URL needs updating.

## Target Directory Structure

```
ExpeGraph/
  experiment/          ← Python · PyVISA acquisition + FastAPI (Module 1)
  data_management/     ← C# · .NET Web API (Module 2)
  graphing/            ← Python · Plotly / Matplotlib (Module 3)
  frontend/            ← TypeScript · React UI
  database/            ← SQL schema scripts
  docs/                ← Documentation
```

---

## Part A — Windows Setup (Instrument Control)

### A1 — Install NI-VISA and NI-488.2

1. Go to `ni.com → Support → Downloads`
2. Download and install:
   - **NI-VISA** (latest version)
   - **NI-488.2** (GPIB driver)
3. Restart Windows after installation

Verify via **NI MAX** (Measurement & Automation Explorer):

```
Start Menu → NI MAX → Devices and Interfaces
```

The equipment, for example, Keithley 2400 and 6487 should appear here. If not, replug the GPIB-USB adapter and click Refresh.

> **Updating existing NI software:**
> Open `Start Menu → NI Package Manager → Updates` and update NI-VISA and NI-488.2.

---

### A2 — Install uv on Windows

Open **Windows PowerShell**:

```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

Restart PowerShell, then verify:

```powershell
uv --version
```

---

### A3 — Set up experiment environment on Windows

```powershell
cd C:\path\to\ExpeGraph\experiment
uv sync
uv add ipykernel # to be able to run jupyter notebook in VS-Code
uv add numpy PyQt6

```

`uv sync` reads `pyproject.toml` and installs all dependencies into a Windows `.venv`.

Add FastAPI and uvicorn:

```powershell
uv add fastapi uvicorn psutil
```

Verify instruments are visible:

```powershell
uv run python -c "
import pyvisa
rm = pyvisa.ResourceManager()
print(rm.list_resources())
"
```

Expected output:

```
('GPIB0::24::INSTR', 'GPIB0::22::INSTR')
```

Test instrument identity:

```powershell
uv run python -c "
import pyvisa
rm = pyvisa.ResourceManager()
inst = rm.open_resource('GPIB0::24::INSTR')
print(inst.query('*IDN?'))
inst.close()
"
```

To run the window python backends

```powershell
uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

```powershell
ip route show default | awk '{print $3}'
```

---

### A4 — Run the FastAPI instrument server

```powershell
cd C:\path\to\ExpeGraph\experiment
uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

`--host 0.0.0.0` makes the server reachable from WSL2 (not just localhost).

Verify it's running:

```powershell
# In a browser or PowerShell
curl http://localhost:8000/docs
```

---

### A5 — Find the Windows host IP (needed by WSL2 frontend)

```bash
# In WSL2 terminal
cat /etc/resolv.conf | grep nameserver
# → nameserver 172.x.x.x   ← use this IP for INSTRUMENT_BASE in the frontend
```

---

## Part B — WSL2 Setup (Data + UI)

All commands below run inside **WSL2**.

### B1 — .NET SDK 8.0

```bash
wget https://dot.net/v1/dotnet-install.sh
chmod +x dotnet-install.sh
./dotnet-install.sh --channel 8.0

# Add to ~/.bashrc then restart terminal
export DOTNET_ROOT=$HOME/.dotnet
export PATH=$PATH:$HOME/.dotnet
```

Verify:

```bash
dotnet --version   # should print 8.x.x
```

---

### B2 — uv (Python package manager)

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.bashrc
uv python install 3.12
```

Verify:

```bash
uv --version
uv python list
```

> **Conda users:** Deactivate conda base before using uv:
>
> ```bash
> conda deactivate
> conda config --set auto_activate_base false
> ```

---

### B3 — Node.js 22 via nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
nvm alias default 22
```

Verify:

```bash
node --version   # v22.x.x
npm --version
```

---

### B4 — Module 2: data_management (.NET)

```bash
cd /path/to/ExpeGraph/data_management
dotnet restore
dotnet build
```

**Packages used:**

| Package                                 | Purpose                     |
| --------------------------------------- | --------------------------- |
| `Npgsql.EntityFrameworkCore.PostgreSQL` | PostgreSQL EF Core provider |
| `Microsoft.EntityFrameworkCore.Design`  | EF migrations tooling       |
| `BCrypt.Net-Next`                       | Password hashing            |

Install EF tools globally:

```bash
dotnet tool install --global dotnet-ef
dotnet ef --version
```

---

### B5 — Module 1: experiment (Python — WSL2 side)

The WSL2 experiment environment is used for non-GPIB work (data processing, mocks during development):

```bash
cd /path/to/ExpeGraph/experiment
uv sync
```

> Note: PyVISA instrument control runs on Windows (Part A).
> This WSL2 environment is for development and testing with mock responses.

---

### B6 — Module 3: graphing (Python)

```bash
cd /path/to/ExpeGraph/graphing
uv init --python 3.12
uv add pandas plotly matplotlib psycopg2-binary kaleido
```

Verify:

```bash
uv run python -c "import plotly, matplotlib, pandas; print('OK')"
```

---

### B7 — Frontend (React + Vite)

```bash
cd /path/to/ExpeGraph/frontend
npm install
npm run dev
```

**Key packages:**

| Package                                   | Purpose               |
| ----------------------------------------- | --------------------- |
| `react-router-dom`                        | Client-side routing   |
| `@tanstack/react-query`                   | Server state, caching |
| `plotly.js` + `react-plotly.js`           | Interactive graphs    |
| `@mui/material` + `@emotion/react/styled` | UI component library  |
| `@mui/x-data-grid`                        | Data tables           |

Install all at once:

```bash
npm install react-router-dom @tanstack/react-query plotly.js react-plotly.js
npm install @mui/material @emotion/react @emotion/styled @mui/x-data-grid
npm install -D @types/react-plotly.js
```

---

### B8 — Database (PostgreSQL)

#### Option A — Local PostgreSQL (recommended)

```bash
sudo apt install postgresql postgresql-client
sudo service postgresql start
sudo service postgresql status

sudo -u postgres psql -c "CREATE USER expegraph WITH PASSWORD 'ExpeGraph123';"
sudo -u postgres psql -c "CREATE DATABASE expegraph OWNER expegraph;"

psql -U expegraph -d expegraph -f database/ExpeGraphDB_PostgreSQL.sql
```

#### Option B — Docker

```bash
docker run --name expegraph-db \
  -e POSTGRES_USER=expegraph \
  -e POSTGRES_PASSWORD=<your-password> \
  -e POSTGRES_DB=expegraph \
  -p 5432:5432 \
  -d postgres:16
```

#### Configure .NET connection string

Edit `data_management/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=expegraph;Username=expegraph;Password=<your-password>"
  }
}
```

#### EF Core migrations

```bash
cd data_management

# Drop and recreate schema if starting fresh
psql -U expegraph -d expegraph -c "DROP SCHEMA expegraph CASCADE; CREATE SCHEMA expegraph;"

# Apply migrations
dotnet ef database update
```

---

## Part C — Connecting Windows FastAPI to WSL2 Frontend

### C1 — Configure frontend API base URLs

In `frontend/src/api/`:

```ts
// For .NET backend (WSL2)
const DATA_BASE = "http://localhost:5174";

// For FastAPI instrument server (Windows)
// Replace 172.x.x.x with your Windows host IP from A5
const INSTRUMENT_BASE = "http://172.x.x.x:8000";
```

### C2 — FastAPI CORS (allow WSL2 frontend)

In `experiment/main.py`:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### C3 — Embedding Plotly graphs from Python into React

Python generates a Plotly JSON spec and returns it from a FastAPI endpoint:

```python
import plotly.graph_objects as go
import json

@app.get("/graph/iv-curve/{measurement_id}")
async def get_iv_graph(measurement_id: int):
    # Load measurement data from file
    voltage = [...]
    current = [...]

    fig = go.Figure()
    fig.add_trace(go.Scatter(x=voltage, y=current, mode='lines+markers'))
    fig.update_layout(xaxis_title='Voltage (V)', yaxis_title='Current (A)')

    return json.loads(fig.to_json())
```

React fetches and renders it using `react-plotly.js`:

```tsx
import Plot from "react-plotly.js";
import { useQuery } from "@tanstack/react-query";

function IVCurveGraph({ measurementId }: { measurementId: number }) {
  const { data, isLoading } = useQuery({
    queryKey: ["graph", "iv", measurementId],
    queryFn: () =>
      fetch(`${INSTRUMENT_BASE}/graph/iv-curve/${measurementId}`).then((r) =>
        r.json(),
      ),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Plot
      data={data.data}
      layout={data.layout}
      style={{ width: "100%", height: "500px" }}
    />
  );
}
```

---

## Quick Reference: Starting Everything

### Windows (Anaconda Prompt or PowerShell with uv)

```powershell
cd C:\path\to\ExpeGraph\experiment
uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### WSL2

```bash
# Terminal 1 — PostgreSQL
sudo service postgresql start

# Terminal 2 — .NET API
cd data_management && dotnet run

# Terminal 3 — React frontend
cd frontend && npm run dev
```

| Service           | URL                             |
| ----------------- | ------------------------------- |
| React frontend    | http://localhost:5173           |
| .NET API          | http://localhost:5174           |
| Swagger UI        | http://localhost:5174/swagger   |
| FastAPI (Windows) | http://\<windows-ip\>:8000      |
| FastAPI docs      | http://\<windows-ip\>:8000/docs |
| PostgreSQL        | localhost:5432                  |

---

## Future: Moving Fully to WSL2

When replacing the NI GPIB-USB-HS adapter with a **Prologix GPIB-USB**:

1. Install `usbipd-win` on Windows and attach the Prologix to WSL2
2. Add `pyserial` to `experiment/pyproject.toml`
3. Run `uvicorn` inside WSL2 instead of Windows
4. Change `INSTRUMENT_BASE` from `http://172.x.x.x:8000` to `http://localhost:8000`

No other changes needed — the rest of the architecture is identical.
