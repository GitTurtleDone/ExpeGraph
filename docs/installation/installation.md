# ExpeGraph — Development Environment Setup

## Target Directory Structure

```
ExpeGraph/
  experiment/          ← Python · PyVISA acquisition (Module 1)
  data_management/     ← C# · .NET Web API (Module 2)
  graphing/            ← Python · Plotly / Matplotlib (Module 3)
  frontend/            ← TypeScript · React UI
  database/            ← SQL schema scripts
  docs/                ← Documentation
```

---

## Phase 0 — Prerequisites (install once, global)

All commands run inside **WSL2**.

### Docker Desktop
Install on **Windows** (not inside WSL2). Then in Docker Desktop settings enable:
`Settings → Resources → WSL Integration → Enable for your distro`

Verify inside WSL2:
```bash
docker --version
docker compose version
```

### .NET SDK 8.0
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

### uv (Python package manager)
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.bashrc
```

Let uv manage Python 3.12 — no system-level install needed:
```bash
uv python install 3.12
```

Verify:
```bash
uv --version
uv python list   # should show 3.12.x
```

> **Conda users:** Keep conda for other work; use uv independently for ExpeGraph.
> Deactivate the conda base environment before running uv commands:
> ```bash
> conda deactivate
> # Optional — stop conda activating base on every terminal open:
> conda config --set auto_activate_base false
> ```

### Node.js 22 via nvm
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
nvm alias default 22
```
Verify:
```bash
node --version   # should print v22.x.x
npm --version
```

---

## Phase 1 — Module 2: data_management (.NET)

```bash
cd /path/to/ExpeGraph/data_management

# Restore NuGet packages
dotnet restore

# Verify it builds
dotnet build
```

> Uses `Npgsql.EntityFrameworkCore.PostgreSQL` for PostgreSQL.

---

## Phase 2 — Module 1: experiment (Python)

```bash
cd /path/to/ExpeGraph/experiment

# Initialise uv project
uv init --python 3.12

# Create the virtual environment
uv venv

# Add dependencies
uv add pyvisa pyvisa-py requests

# Activate (needed for interactive use)
source .venv/bin/activate
```

Verify:
```bash
python -c "import pyvisa; print(pyvisa.__version__)"
```

---

## Phase 3 — Module 3: graphing (Python)

```bash
cd /path/to/ExpeGraph/graphing

uv init --python 3.12
uv venv
uv add pandas plotly matplotlib psycopg2-binary kaleido

source .venv/bin/activate
```

Verify:
```bash
python -c "import plotly, matplotlib, pandas; print('OK')"
```

---

## Phase 4 — Frontend (React + Vite)

```bash
cd /path/to/ExpeGraph/frontend

# Scaffold Vite + React + TypeScript project
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install

# Add key packages
npm install react-router-dom @tanstack/react-query plotly.js react-plotly.js
npm install -D @types/react-plotly.js

# Start development server (http://localhost:5173)
npm run dev
```

---

## Phase 5 — Database (PostgreSQL)

### Option A — via Docker (recommended for development)
```bash
cd /path/to/ExpeGraph

# Start a PostgreSQL container
docker run --name expegraph-db \
  -e POSTGRES_USER=expegraph \
  -e POSTGRES_PASSWORD=changeme \
  -e POSTGRES_DB=expegraph \
  -p 5432:5432 \
  -d postgres:16

# Apply the schema
docker exec -i expegraph-db psql -U expegraph -d expegraph \
  < database/ExpeGraphDB_PostgreSQL.sql
```

### Option B — local PostgreSQL
```bash
sudo apt install postgresql postgresql-client

# Start PostgreSQL in WSL2:
sudo service postgresql start

# Verify it's running:
sudo service postgresql status
# -> returns 14/main (port 5432): online, for example

# Create user and database
sudo -u postgres psql -c "CREATE USER expegraph WITH PASSWORD 'changeme';"
sudo -u postgres psql -c "CREATE DATABASE expegraph OWNER expegraph;"

# Apply schema
psql -U expegraph -d expegraph -f database/ExpeGraphDB_PostgreSQL.sql
```

### Configure the .NET connection string
Edit `data_management/appsettings.Development.json` (not committed — in .gitignore):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=expegraph;Username=expegraph;Password=changeme"
  }
}
```

---

## Quick Reference: Starting Everything

```bash
# Terminal 1 — .NET API
cd data_management && dotnet run

# Terminal 2 — React frontend
cd frontend && npm run dev

# Terminal 3 — Database (if using Docker)
docker start expegraph-db
```

| Service | URL |
|---------|-----|
| .NET API | http://localhost:5174 |
| Swagger UI | http://localhost:5174/swagger |
| React frontend | http://localhost:5173 |
| PostgreSQL | localhost:5432 |

---

