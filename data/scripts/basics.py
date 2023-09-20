"""
Download the data from https://nlp.ist.i.kyoto-u.ac.jp/index.php?日英中基本文データ.
Extract the xls file and move it to raw/basics.xls.
"""

import csv
import pandas
from util import likely_good, clean_spaces

def main():
    data = pandas.read_excel('raw/basics.xls')
    with open('output/basics.csv', 'w', encoding='utf-8', newline='') as fout:
        w = csv.writer(fout, dialect='unix')
        count = 0
        count_real = 0
        for _, x in data.iterrows():
            num = x.iat[0]
            jp = x.iat[1].strip()
            en = x.iat[2].strip()
            count += 1
            if likely_good(en, jp, check_punctuation_jp=False, check_punctuation_en=False):
                count_real += 1
                w.writerow(['basics', num, 0, clean_spaces(jp), clean_spaces(en)])
        print(f'Sentences: {count_real}/{count}')

if __name__ == '__main__':
    main()
