"""
Download the data from http://www.phontron.com/jaen-law/.
Extract it and move the folder containing the .ja and .en files to raw/legal.
"""

import csv
from util import likely_good, clean_spaces

def main():
    with open('output/legal.csv', 'w', encoding='utf-8', newline='') as fout:
        count = 0
        count_real = 0
        w = csv.writer(fout, dialect='unix')
        with open(f'raw/legal/law-corpus.en', 'r', encoding='utf-8') as fin1, \
            open(f'raw/legal/law-corpus.ja', 'r', encoding='utf-8') as fin2:
            for (en, jp) in zip(fin1, fin2):
                count += 1
                jp = jp.strip()
                en = en.strip()
                if likely_good(en, jp, allow_quotes=False):
                    w.writerow(['legal', '', 0, clean_spaces(jp), clean_spaces(en)])
                    count_real += 1
        print(f'Sentences: {count_real}/{count}')

if __name__ == '__main__':
    main()
