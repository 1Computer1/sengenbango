"""
Download the one-to-one data from https://www2.nict.go.jp/astrec-att/member/mutiyama/jea/reuters/index.html.
Extract it and move it to raw/reuters.xml.
"""

import lxml.html
import csv
from util import likely_good, clean_spaces

SCORE_THRESHOLD = 0.05

class StreamHandler:
    def __init__(self, writer) -> None:
        self.writer = writer
        self.count = 0
        self.count_real = 0
        self.curr_node = None
        self.should_write = False
        self.curr_jp = ''
        self.curr_en = ''

    def start(self, name, attrs):
        self.curr_node = name
        if name == 't' and float(attrs['score']) >= SCORE_THRESHOLD:
            self.should_write = True

    def end(self, name):
        self.curr_node = None
        if name == 't':
            self.count += 1
            if self.should_write:
                jp = self.curr_jp.strip()
                en = self.curr_en.strip()
                if likely_good(en, jp):
                    self.count_real += 1
                    self.writer.writerow(['reuters', '', 0, clean_spaces(jp), clean_spaces(en)])
                self.should_write = False
            self.curr_jp = ''
            self.curr_en = ''

    def close(self):
        pass

    def data(self, content):
        if self.should_write:
            if self.curr_node == 'j':
                self.curr_jp += content
            elif self.curr_node == 'e':
                self.curr_en += content

def main():
    with open('raw/reuters.xml', 'rb') as fin, \
        open('output/reuters.csv', 'w', encoding='utf-8', newline='') as fout:
        w = csv.writer(fout, dialect='unix')
        handler = StreamHandler(w)
        parser = lxml.html.HTMLParser(target=handler, encoding='eucjp')
        lxml.html.parse(fin, parser)
        print(f'Sentences: {handler.count_real}/{handler.count}')

if __name__ == '__main__':
    main()
