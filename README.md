# 千言万語

Parallel JP-EN corpora search combining multiple corpora. See [here](data/README.md) for credits for data sources.

## Instructions

1. Parse all the data into CSV files. See [here](data/README.md) for more instructions. If needed, you can parse only the sources you want and remove the others from [the database initialization](database/01-init.sql).
2. Configure [the compose file](./compose.yml) if needed.
3. Run `docker compose up db` so that it can process all the data. See [here](database/README.md) for information about the database.
4. Run `docker compose up` for everything else.

## Todo

- Try out the [RUM index](https://github.com/postgrespro/rum) to see if it speeds up complex queries and sorting by score.
- Reimplement the `ts_headline` function for highlighting matches as the function is [broken](https://www.postgresql.org/message-id/flat/152461454026.19805.6310947081647212894%40wrigleys.postgresql.org).
- Allow searching by English.
- Allow selecting sources to search with.
- Explanation of sources and scoring in the frontend.
- Explanation of query syntax and parsing errors in the frontend.

---

> *Built with* [🦀](## "Rust + Axum") [🐍](## "Python") [🐘](## "PostgreSQL") [⌨️](## "TypeScript") [⚛️](## "React + Tailwind") [⚙️](## "C") [🐳](## "Docker") *and more!*
