"""
Download the full data from https://www2.nict.go.jp/astrec-att/member/mutiyama/align/download/index.html.
Extract and move the folder containing the alml files to raw/novels.
"""

import lxml.html
import csv
import glob
import re
import pathlib
from util import likely_good, clean_spaces

class StreamHandler:
    def __init__(self, writer, filename) -> None:
        self.writer = writer
        self.filename = filename
        self.count = 0
        self.count_real = 0
        self.curr_node = None
        self.in_text = False
        self.curr_jp = ''
        self.curr_en = ''

    def start(self, name, attrs):
        self.curr_node = name
        if name == 't':
            self.in_text = True

    def end(self, name):
        self.curr_node = None
        if name == 't':
            self.count += 1
            en = self.curr_en.strip()
            jp = self.curr_jp.strip()
            if likely_good(en, jp):
                self.count_real += 1
                self.writer.writerow(['novels', self.filename, 0, clean_spaces(jp), clean_spaces(en)])
            self.in_text = False
            self.curr_jp = ''
            self.curr_en = ''

    def close(self):
        pass

    def data(self, content):
        if self.in_text:
            if self.curr_node == 'j':
                self.curr_jp += content
            elif self.curr_node == 'e':
                self.curr_en += content

def main():
    with open('output/novels.csv', 'w', encoding='utf-8', newline='') as fout:
        filenames = glob.glob('raw/novels/*.alml')
        count = 0
        count_real = 0
        w = csv.writer(fout, dialect='unix')
        for name in filenames:
            with open(name, 'r', encoding='euc-jp', errors='ignore', newline='') as fin:
                handler = StreamHandler(w, pathlib.Path(name).stem)
                parser = lxml.html.HTMLParser(target=handler, encoding='euc-jp')
                lxml.html.parse(fin, parser)
                count += handler.count
                count_real += handler.count_real
        print(f'Sentences: {count_real}/{count}')

if __name__ == '__main__':
    main()
