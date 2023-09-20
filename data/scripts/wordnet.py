"""
Download the WordNet definitions and the WordNet examples from https://bond-lab.github.io/wnja/index.en.html.
Extact and move to raw/wnjpn-def.tab/wnjpn-def.tab and raw/wnjpn-exe.tab/wnjpn-exe.tab.
"""

import csv
from util import likely_good, clean_spaces

def run(name):
    count = 0
    count_real = 0
    with open(f'raw/wnjpn-{name}.tab/wnjpn-{name}.tab', 'r', encoding='utf-8', newline='') as fin, \
        open(f'output/wordnet_{name}.csv', 'w', encoding='utf-8', newline='') as fout:
        r = csv.reader(fin, delimiter='\t')
        w = csv.writer(fout, dialect='unix')
        for id, offset, en, jp in r:
            count += 1
            if likely_good(en, jp, check_punctuation_en=False, check_punctuation_jp=False):
                count_real += 1
                w.writerow([f'wordnet-{name}', id + ' ' + offset, 0, clean_spaces(jp), clean_spaces(en)])
    return count, count_real

def main():
    count, count_real = run('exe')
    print(f'Sentences (exe): {count_real}/{count}')
    count, count_real = run('def')
    print(f'Sentences (def): {count_real}/{count}')

if __name__ == '__main__':
    main()
