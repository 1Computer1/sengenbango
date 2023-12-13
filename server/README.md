# Server

## Environment Variables

- `RUST_LOG` - Log level for tracing, see [here](https://docs.rs/tracing-core/latest/tracing_core/metadata/struct.Level.html#implementations).
- `SGBG_PORT` - Port to run the server on.
- `SGBG_DB` - Database URL.
- `SGBG_RATE_NUM` - Rate limit, number of requests per duration.
- `SGBG_RATE_PER` - Rate limit, duration in seconds.
- `SGBG_COMPLEX` - Max complexity of a query.
- `SGBG_QUERY_TIME` - Max number of seconds a query can take.

## API

All routes are prefixed by the API version. Right now, there is only `v1`, so e.g. `/api/v1/query`.

### POST `/query`

Body should be a JSON object with entries:

| Field      | Type       | Notes                                                         |
| ---------- | ---------- | ------------------------------------------------------------- |
| `t`        | `string`   | Either `single` or `multiple`.                                |
| `c`        | `object`   | See below.                                                    |
| `sources?` | `string[]` | Array of sources to use, or leave this unset for all sources. |

For single-language queries:
| Field      | Type     | Notes                                                                                 |
| ---------- | -------- | ------------------------------------------------------------------------------------- |
| `language` | `string` | Either `japanese` or `english`.                                                       |
| `query`    | `object` | A query object, which is an expression tree tagged by a tag `t` and with content `c`. |

For multiple-languages query:
| Field     | Type     | Notes                        |
| --------- | -------- | ---------------------------- |
| `queryjp` | `object` | A query object for Japanese. |
| `queryen` | `object` | A query object for English.  |

For query objects:

- The tag is one of `term`, `tag`, `not`, `and`, `or`, `seq`.
  - For `term`, `tag`, the content is a string.
  - For `not`, the content is a query object.
  - For `and`, `or`, `seq`, the content is a pair of query objects.
- If the query is too complex or does not contain lexemes, a `422` is returned. Complexity is measured as the number of terms, `not`s, `and`s, `or`s, and 4 times the number of part-of-speech tags.
