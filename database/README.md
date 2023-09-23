# Database

## Text Search

We use a modified version of [textsearch_ja](https://www.postgresql.org/ftp/projects/pgFoundry/textsearch-ja/textsearch_ja/9.0.0/) ([main repository](https://github.com/HiraokaHyperTools/textsearch_ja)). Modifications to the source code (in order to allow searching stop words or part of speech tags) are noted with `EDIT` comments.

Instructions for setting this up was adapted from https://stackoverflow.com/a/76150756/10499803.

Also, we use the [RUM index](https://github.com/postgrespro/rum) for faster querying.

## Querying

Every token in a Japanese sentence is converted into a basic lexeme and a part-of-speech lexeme in a `ts_vector` when using the `japanese_with_types` language configuration:
| Format           | Input | Output        |
| ------           | ----- | ------        |
| `basic`          | `話せ` | `話す`        |
| `＃type・s1・s2・s3` | `早い` | `＃形容詞・自立` |

Full list of part-of-speech tags [here](https://www.unixuser.org/~euske/doc/postag/) under the ChaSen section.

Sample query:
```sql
with
matching AS (
  select *
  from documents
  where textsearch_index_jp_col @@ (phraseto_tsquery('japanese', 'その人') && '＃動詞:*')
  order by score <=> 0
  limit 200
)
select *
from (select distinct on(jp) * from matching) deduped
order by score desc
limit 100;
```

The `japanese` and `japanese_with_types` configurations always do not remove stop words.
For English, use the `english_nostop` configuration to also not remove stop words.
