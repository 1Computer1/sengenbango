FROM postgres:15

RUN apt-get update \
    && apt-get install -y build-essential postgresql-server-dev-15 libmecab-dev libmecab2 mecab-ipadic-utf8 mecab-utils libmecab-perl libtext-mecab-perl mecab mecab-jumandic-utf8

# ADD https://ftp.postgresql.org/pub/projects/pgFoundry/textsearch-ja/textsearch_ja/9.0.0/textsearch_ja-9.0.0.tar.gz textsearch_ja-9.0.0.tar.gz
# RUN tar -xf textsearch_ja-9.0.0.tar.gz

COPY textsearch_ja /textsearch_ja

ARG A=26
RUN cd textsearch_ja \
    && make USE_PGXS=1 PG_CONFIG=/usr/lib/postgresql/15/bin/pg_config \
    && make USE_PGXS=1 PG_CONFIG=/usr/lib/postgresql/15/bin/pg_config install \
    && cp textsearch_ja.sql /docker-entrypoint-initdb.d/00-textsearch_ja.sql

COPY *.sql /docker-entrypoint-initdb.d/
