-- create extension rum;

create table documents (
    source text not null,
    name text not null,
    score float not null,
    jp text not null,
    en text not null,
    textsearch_index_jp_col tsvector not null
        generated always as (to_tsvector('japanese_with_types', jp)) stored,
    textsearch_index_en_col tsvector not null
        generated always as (to_tsvector('english_nostop', en)) stored
);

create procedure copy_data(sources text[] default null) language plpgsql as
$$
declare
    known_sources text[] := array[
        'tatoeba',
        'kyoto',
        'jparacrawl',
        'legal',
        'coursera',
        'reuters',
        'novels',
        'basics',
        'wordnet_exe',
        'wordnet_def',
        'bpersona_ja_en',
        'bpersona_en_ja',
        'natcom'
    ];
    s text;
    copy_cmd text;
begin
    truncate documents;
    -- drop index if exists textsearch_index_jp, textsearch_index_en;
    drop index if exists textsearch_index_jp, textsearch_index_en, score_index;

    foreach s in array known_sources loop
        if sources is null or s = any(sources) then
            raise notice 'Copying %', s;
            copy_cmd := 'copy documents (source, name, score, jp, en) from ''/data/' || s || '.csv'' csv delimiter '',''';
            execute copy_cmd;
        end if;
    end loop;

    -- create index textsearch_index_jp on documents using rum (textsearch_index_jp_col rum_tsvector_addon_ops, score)
    --     with (attach = 'score', to = 'textsearch_index_jp_col');

    -- create index textsearch_index_en on documents using rum (textsearch_index_en_col rum_tsvector_addon_ops, score)
    --     with (attach = 'score', to = 'textsearch_index_en_col');

    create index textsearch_index_jp on documents using gin (textsearch_index_jp_col);
    create index textsearch_index_en on documents using gin (textsearch_index_en_col);
    create index score_index on documents using btree (score desc);
end;
$$;
