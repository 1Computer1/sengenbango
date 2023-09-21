# Todo List

**Legend**: 🦀 Backend, 🎨 Frontend, 🐍 Data Processing, 🐘 Database, 🌐 Website.

- 🦀 🎨 Reimplement the `ts_headline` function for highlighting matches as the function is [broken](https://www.postgresql.org/message-id/flat/152461454026.19805.6310947081647212894%40wrigleys.postgresql.org). The backend will do the computation while the frontend will format it, rather than what `ts_headline` does in one.

- 🦀 🎨 Allow selecting data sources to search with. They should also be explained and credited in the frontend.

- 🎨 Allow searching by English.

- 🎨 Explain sentence scoring.

- 🎨 Explain query syntax, display query parsing errors, query processing errors.

- 🐍 Score the three remaining data sets (`kyoto`, `jparacrawl`, `legal`).

- 🌐 Set up website.
