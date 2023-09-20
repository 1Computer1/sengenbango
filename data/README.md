# Data

## Parsing

Data from the parallel corpora are first parsed into CSV files.

To parse the data, install the dependencies, check the instructions of where the data should be placed in the script itself, then run the script from this folder. The output format is a unix-style CSV with the following columns:
```
source, name (may not be unique), score (always 0), jp, en
```

The `all.py` script can be used when all the raw data are set.

## Scoring

After that, we score the data using [gpt2-japanese](https://github.com/tanreinama/gpt2-japanese), which is already included as a submodule and dependencies added in the parent folder. Follow setup instructions in their repository for the model file. Then, run `score.py --model <model> --exclude-end <source>` to get a scored CSV.

Scored sentences from `data/scored` are then copied into the [database](../docker/postgres-mecab/README.md).
