This software handles operations related to physical experiments, namely, take data and presents them in publicatin-ready graphs.
Requirements
This software should include 3 modules:

- the 1st module takes data from measurement equipments,
- the 2nd module stores the taken data in files then write them to a database, and
- the 3nd module retrieves the data from the database, compare data taken from different batches, plot appropriate graphs, and save them in publication-ready graphs.

Current specifications:

- The main equipment is Keithley/Keysight parameter analyzers/sourcemeters/LCR meters or others.
- PyVisa is used to control the equipment.
- The format of the data files are .csv and .txt.
- The database is PostgreSQL.
- Matplotlib is planed to be used as the graphical engine, it can be changed when other packages are found to be more appropricate. Graphs should be saved in either .tiff, .eps, or .ps formats.

There should be chatbots to assist experimentators to perform tasks in the 3 modules.
