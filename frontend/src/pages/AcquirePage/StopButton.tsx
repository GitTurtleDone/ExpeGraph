import { Button, Stack } from "@mui/material";
import { runMeasurement, stopMeasurement } from "../../api/acquire";

type stopProps = {
    running: boolean,
    onStop: () => void
}
export default function StopButton({running, onStop}: stopProps) {
    const stop = async () => {
        await stopMeasurement()
        onStop()
    }
    return (
        <div>
            <Stack direction='row' sx={{gap: 2}}>

            </Stack>
            <Button
                variant="contained"
                color="error"
                disabled={!running}
                onClick={stop}
            >
                STOP
            </Button>

        </div>
    );
}