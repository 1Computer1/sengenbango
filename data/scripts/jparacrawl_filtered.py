"""
See jparacrawl.py for more info.
"""

import csv
from alive_progress import alive_bar # because it takes a bit
from util import likely_good, clean_spaces

NUM_SENTENCES = 805434 # orginally from 0.78 threshold
SCORE_THRESHOLD = 0.783 # higher lower bound to slim it down a bit

def main():
    with (
        open('output/jparacrawl.csv', 'w', encoding='utf-8', newline='') as fout,
        open('raw/jparacrawl_filtered.tsv', 'r', encoding='utf-8', newline='') as fin,
        alive_bar(NUM_SENTENCES) as bar
    ):
        count = 0
        count_real = 0
        r = csv.reader(fin, delimiter='\t', quotechar=None, lineterminator='\n')
        w = csv.writer(fout, dialect='unix')
        for row in r:
            s1, s2, score, en, jp = row
            bar()
            count += 1
            en = en.strip()
            jp = jp.strip()
            if float(score) >= SCORE_THRESHOLD:
                if likely_good(en, jp):
                    count_real += 1
                    w.writerow(['jparacrawl', s1 + ' ' + s2, 0, clean_spaces(jp), clean_spaces(en)])
                    bar.text(f'{count_real}/{count}')
        print(f'Sentences: {count_real}/{count}')

if __name__ == '__main__':
    main()
