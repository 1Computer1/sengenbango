"""
Download the corpus from http://www.kecl.ntt.co.jp/icl/lirg/jparacrawl/.
Move it to raw/jparacrawl.tsv.

Also outputs raw/jparacrawl_filtered.tsv so that you can redo it with the score threshold already in place,
see jparacrawl_filtered.py to use that one.
"""

import csv
from alive_progress import alive_bar # because it takes a bit
from util import likely_good, clean_spaces

NUM_SENTENCES = 25740835
SCORE_THRESHOLD = 0.78

def main():
    with (
        open('output/jparacrawl.csv', 'w', encoding='utf-8', newline='') as fout,
        open('raw/jparacrawl.tsv', 'r', encoding='utf-8', newline='') as fin,
        open('raw/jparacrawl_filtered.tsv', 'w', encoding='utf-8', newline='') as foutraw,
        alive_bar(NUM_SENTENCES) as bar
    ):
        count = 0
        count_real = 0
        r = csv.reader(fin, delimiter='\t', quotechar=None, lineterminator='\n')
        w = csv.writer(fout, dialect='unix')
        rraw = csv.writer(foutraw, delimiter='\t', quotechar=None, lineterminator='\n')
        for row in r:
            s1, s2, score, en, jp = row
            bar()
            count += 1
            en = en.strip()
            jp = jp.strip()
            if float(score) >= SCORE_THRESHOLD:
                rraw.writerow(row)
                if likely_good(en, jp):
                    count_real += 1
                    w.writerow(['jparacrawl', s1 + ' ' + s2, 0, clean_spaces(jp), clean_spaces(en)])
                    bar.text(f'{count_real}/{count}')
        print(f'Sentences: {count_real}/{count}')

if __name__ == '__main__':
    main()
