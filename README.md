# 千言万語

Parallel JP-EN corpora search combining multiple corpora. See [here](data/SOURCES.md) for credits for data sources.

## Instructions

1. Parse the data into CSV files. See [here](data/README.md) for more instructions.

2. Configure [the compose file](./compose.yml) if needed.

3. Run `docker compose up db` to first set up the database if it hasn't already. See [here](database/README.md) for information about the database.
    1. Once the database is up, run `docker compose exec -it db psql -U postgres` to get to the postgres console.
    2. Run `call copy_data();` to copy the data. This can be done everytime there's an update to the data (N.B. this will clear all existing documents data first).
    3. If not all sources should be copied, supply an array of sources e.g. `call copy(array['basics']);`.

4. Run `docker compose up` for everything else.
