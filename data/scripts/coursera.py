"""
Download the data from https://github.com/shyyhs/CourseraParallelCorpusMining/.
Extract it and move the folder containing the txt files to raw/coursera.
"""

import csv
from util import likely_good, clean_spaces, remove_jp_spaces

def pair(name, writer):
    count = 0
    count_real = 0
    with open(f'raw/coursera/{name}.en.txt', 'r', encoding='utf-8') as fin1, \
        open(f'raw/coursera/{name}.ja.txt', 'r', encoding='utf-8') as fin2:
        for (en, jp) in zip(fin1, fin2):
            count += 1
            jp = jp.strip()
            en = en.strip()
            if likely_good(en, jp):
                # subtitles have extra spaces
                writer.writerow(['coursera', '', 0, remove_jp_spaces(clean_spaces(jp)), clean_spaces(en)])
                count_real += 1
    return count, count_real

def main():
    with open('output/coursera.csv', 'w', encoding='utf-8', newline='') as fout:
        count = 0
        count_real = 0
        w = csv.writer(fout, dialect='unix')
        count_, count_real_ = pair('dev', w)
        count += count_
        count_real += count_real_
        count_, count_real_ = pair('train', w)
        count += count_
        count_real += count_real_
        count_, count_real_ = pair('test', w)
        count += count_
        count_real += count_real_
        print(f'Sentences: {count_real}/{count}')

if __name__ == '__main__':
    main()
