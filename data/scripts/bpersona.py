"""
Download the entire repository from https://github.com/cl-tohoku/BPersona-chat/.
Extract it and move it to raw/bpersona.
"""

import warnings
warnings.simplefilter("ignore")

import csv
import glob
import pandas
import pathlib
from util import likely_good, clean_spaces

def pair(type, writer, swap):
    count = 0
    count_real = 0
    for name in glob.glob(f'raw/bpersona/{type}/human/*.xlsx'):
        data = pandas.read_excel(name)
        for _, x in data.iterrows():
            en = str(x.iat[2 if swap else 1]).strip()
            jp = str(x.iat[1 if swap else 2]).strip()
            score = x.iat[3]
            count += 1
            if score == 'y' and likely_good(en, jp, check_punctuation_en=False, check_punctuation_jp=False):
                count_real += 1
                writer.writerow([f'bpersona-{type}', type + ' ' + pathlib.Path(name).stem, 0, clean_spaces(jp), clean_spaces(en)])
    return count, count_real

def main():
    with open('output/bpersona_en_ja.csv', 'w', encoding='utf-8', newline='') as fout1, \
        open('output/bpersona_ja_en.csv', 'w', encoding='utf-8', newline='') as fout2:
        w1 = csv.writer(fout1, dialect='unix')
        count, count_real = pair('en-ja', w1, False)
        print(f'Sentences (en-ja): {count_real}/{count}')
        w2 = csv.writer(fout2, dialect='unix')
        count, count_real = pair('ja-en', w2, True)
        print(f'Sentences (ja-en): {count_real}/{count}')

if __name__ == '__main__':
    main()
