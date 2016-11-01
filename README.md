# JSON De-Duper

A node based utility to remove duplicate data entries from a JSON file.

---

## Usage

```sh
node dedupe --file "./leads.json"

# or
node dedupe -f "./leads.json"

# or simply
node dedupe "./leads.json"
```

After you run the code above, an `.html` file will be generated. One section
will have the filtered data, and the other will display the duplicate data.

---

## Challenge

Take a variable number of identically structured json records and de-duplicate 
the set. An example file of records is given in `leads.json`. Output should be 
the same format, with dupes reconciled according to the following rules.

1. The data from the newest date should be preferred.
1. Duplicate IDs count as dupes. Duplicate emails count as dupes. Both must be 
   unique in our dataset. Duplicate values elsewhere do not count as dupes.
1. If the dates are identical the data from the record provided last in the list
   should be preferred

Simplifying assumption: the program can do everything in memory (don't worry 
about large files). The application should also provide a log of changes 
including some representation of the source record, the output record and the 
individual field changes (value from and value to) for each field. Please 
implement as a command-line java program, or a javascript program.