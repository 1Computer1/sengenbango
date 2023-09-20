# Credits

We use a modified version of [textsearch_ja](https://www.postgresql.org/ftp/projects/pgFoundry/textsearch-ja/textsearch_ja/9.0.0/) ([main repository](https://github.com/HiraokaHyperTools/textsearch_ja)). Modifications to the source code (in order to allow searching stop words or part of speech tags) are noted with `EDIT` comments.

Instructions for setting this up was adapted from https://stackoverflow.com/a/76150756/10499803.

## Searching

Every token in a Japanese sentence is converted into a basic lexeme and a part-of-speech lexeme in a `ts_vector` when using the `japanese_with_types` language configuration:
| Format           | Input | Output        |
| ------           | ----- | ------        |
| `basic`          | `話せ` | `話す`        |
| `＃type・s1・s2・s3` | `早い` | `＃形容詞・自立` |

Full list of part-of-speech tags [here](https://www.unixuser.org/~euske/doc/postag/) under the ChaSen section.

The function `query_from_json` can be used to create a query from a JSON-formatted expression tree. See [the initialization script](./01-init.sql) for expected format.

Sample query:
```sql
WITH
query AS (
  SELECT query_from_json(
    'japanese',
    '{"t":"And","c":[{"t":"Term","c":"その人"},{"t":"Tag","c":"動詞"}]}'::json
  ) q
),
matching AS (
  SELECT *
  FROM documents, query
  WHERE textsearch_index_jp_col @@ query.q
),
limited AS (
  SELECT source, jp, en, score
  FROM matching
  ORDER BY score DESC
  LIMIT 200
)
SELECT *
FROM (SELECT DISTINCT ON(jp) * FROM limited) deduped
ORDER BY score DESC
LIMIT 100;
```
