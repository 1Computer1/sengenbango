"""
Download Japanese-English (in that order) sentence pairs from https://tatoeba.org/en/downloads.
Move it to raw/tatoeba.tsv.
"""

import csv
from util import clean_spaces

def main():
    with open('raw/tatoeba.tsv', 'r', encoding='utf-8', newline='') as fin, \
        open('output/tatoeba.csv', 'w', encoding='utf-8', newline='') as fout:
        n = 0
        r = csv.reader(fin, delimiter='\t')
        w = csv.writer(fout, dialect='unix')
        for jpid, jp, enid, en in r:
            n += 1
            # no need for filtering here, tatoeba sentences are generally clean already.
            w.writerow(['tatoeba', jpid + ' ' + enid, 0, clean_spaces(jp.strip()), clean_spaces(en.strip())])
        print(f'Sentences: {n}')

if __name__ == '__main__':
    main()
