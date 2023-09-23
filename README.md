# 千言万語

Parallel JP-EN corpora search combining multiple corpora. See [here](data/SOURCES.md) for credits for data sources.

## Instructions

1. Parse all the data into CSV files. See [here](data/README.md) for more instructions. If needed, you can parse only the sources you want and remove the others from [the database initialization](database/01-init.sql).

2. Configure [the compose file](./compose.yml) if needed.

3. Run `docker compose up db` so that it can process all the data. See [here](database/README.md) for information about the database.

4. Run `docker compose up` for everything else.
