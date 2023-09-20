"""
Download the data from https://www2.nict.go.jp/astrec-att/member/mutiyama/paranatcom/.
Extract the folder containing the abstracts folders to raw/natcom.
"""

import csv
import glob
import pathlib
from util import clean_spaces

def main():
    with open('output/natcom.csv', 'w', encoding='utf-8', newline='') as fout:
        n = 0
        w = csv.writer(fout, dialect='unix')
        for name in glob.glob('raw/natcom/abstracts/*.txt'):
            num = pathlib.Path(name).stem
            with open(name) as fen, \
                open(f'raw/natcom/abstracts-ja-1/{num}.txt') as fjp:
                title_en = fen.readline()
                title_jp = fjp.readline()
                fen.readline()
                fjp.readline()
                body_en = fen.readline()
                body_jp = fjp.readline()
                # no need for filtering here, these seem clean enough.
                w.writerow(['natcom', num + ' title', 0, clean_spaces(title_jp.strip()), clean_spaces(title_en.strip())])
                w.writerow(['natcom', num + ' body', 0, clean_spaces(body_jp.strip()), clean_spaces(body_en.strip())])
                n += 2
        print(f'Sentences: {n}')

if __name__ == '__main__':
    main()
