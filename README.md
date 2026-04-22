This software handles operations related to physical experiments, namely, take data and presents them in publication-ready graphs.
Requirements

## This software should include 3 modules:

### Experiment:

The 1st module takes data from measurement equipments.

### Data Management:

The 2nd module stores the taken data in files then write them to a database, and

### Graphing:

The 3rd module retrieves the data from the database, compare data taken from different batches, plot appropriate graphs, and save them in publication-ready graphs.

## Current specifications:

- The main equipment is **Keithley/Keysight** parameter analyzers/sourcemeters/LCR meters or others.
- **PyVisa** is used to control the equipment.
- The format of the data files are **.csv** and **.txt**.
- The database is **PostgreSQL**.
- **Plotly** is used for interactive graphs in the frontend (zoom, pan, annotations, drag-and-drop). **Matplotlib** is used exclusively for final publication export. Graphs are saved in .tiff, .eps, or .ps formats.
- There should be chatbots to assist experimentators to perform tasks in the 3 modules.

The architecture of the application can be seen [here](https://github.com/GitTurtleDone/ExpeGraph/blob/main/docs/design/ArchitectureAndTools.md).

The database schema can be seen [here](https://github.com/GitTurtleDone/ExpeGraph/blob/main/docs/design/DatabaseSchema.md).

## Implemented features:
- Implemented features can be seen [here](https://github.com/GitTurtleDone/ExpeGraph/blob/main/docs/implemented_features/ImplementedFeatures.pdf)

## Running the app:

To run the app, follow these steps: 
- Presumably, uv has been installed in both WSL2 and Windows. Steps that I have executed to install the packages can be seen [here](https://github.com/GitTurtleDone/ExpeGraph/blob/main/docs/installation/installation.md)
- Open an WSL2 terminal
```bash
cd /Path/to_the_folder/that_stores_the_project
git clone <repo>
sudo service postgresql run
cd /Path/to_the_folder/that_stores_the_project/ExpeGraph/data_management
dotnet restore
dotnet run
```
- Open another WSL2 terminal
```bash
cd /Path/to_the_folder/that_stores_the_project/ExpeGraph/frontend
npm install
npm run dev
```
- Open a Windows PowerShell terminal
```bash
cd \\wsl.localhost\Path\to_the_folder\that_stores_the_project\ExpeGraph\experiment
uv sync
uv run uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```





