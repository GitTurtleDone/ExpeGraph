This software handles operations related to physical experiments, namely, take data and presents them in publication-ready graphs.
Requirements

## This software should include 3 modules:

### Module 1:

The 1st module takes data from measurement equipments.

### Module 2:

The 2nd module stores the taken data in files then write them to a database, and

### Module 3:

The 3rd module retrieves the data from the database, compare data taken from different batches, plot appropriate graphs, and save them in publication-ready graphs.

## Current specifications:

- The main equipment is Keithley/Keysight parameter analyzers/sourcemeters/LCR meters or others.
- PyVisa is used to control the equipment.
- The format of the data files are .csv and .txt.
- The database is PostgreSQL.
- **Plotly** is used for interactive graphs in the frontend (zoom, pan, annotations, drag-and-drop). **Matplotlib** is used exclusively for final publication export. Graphs are saved in .tiff, .eps, or .ps formats.
- There should be chatbots to assist experimentators to perform tasks in the 3 modules.
