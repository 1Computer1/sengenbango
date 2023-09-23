FROM postgres:15

RUN apt-get update \
    && apt-get install -y git build-essential postgresql-server-dev-15 libmecab-dev libmecab2 mecab-ipadic-utf8 mecab-utils libmecab-perl libtext-mecab-perl mecab mecab-jumandic-utf8 systemtap-sdt-dev

# RUN git clone https://github.com/postgrespro/rum \
#     && cd rum \
#     && make USE_PGXS=1 PG_CONFIG=/usr/lib/postgresql/15/bin/pg_config \
#     && make USE_PGXS=1 PG_CONFIG=/usr/lib/postgresql/15/bin/pg_config install

RUN cd /

COPY textsearch_ja /textsearch_ja

RUN cd textsearch_ja \
    && make USE_PGXS=1 PG_CONFIG=/usr/lib/postgresql/15/bin/pg_config \
    && make USE_PGXS=1 PG_CONFIG=/usr/lib/postgresql/15/bin/pg_config install \
    && cp textsearch_ja.sql /docker-entrypoint-initdb.d/00-textsearch_ja.sql

COPY *.sql /docker-entrypoint-initdb.d/
