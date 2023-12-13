"""
Download the TMX data from https://opus.nlpl.eu/TED2020-v1.php.
Extract it and move it to raw/ted.tmx.
"""

import lxml.html
import csv
from util import likely_good, clean_spaces

class StreamHandler:
    def __init__(self, writer) -> None:
        self.writer = writer
        self.count = 0
        self.count_real = 0
        self.curr_node = None
        self.curr_lang = None
        self.curr_jp = ''
        self.curr_en = ''

    def start(self, name, attrs):
        self.curr_node = name
        if name == 'tuv':
            self.curr_lang = attrs['xml:lang']

    def end(self, name):
        self.curr_node = None
        if name == 'tu':
            self.count += 1
            jp = self.curr_jp.strip()
            en = self.curr_en.strip()
            if likely_good(en, jp, check_punctuation_jp=False, allow_quotes=False):
                self.count_real += 1
                self.writer.writerow(['ted', '', 0, clean_spaces(jp), clean_spaces(en)])
            self.curr_jp = ''
            self.curr_en = ''
        elif name == 'tuv':
            self.curr_lang = None

    def close(self):
        pass

    def data(self, content):
        if self.curr_node == 'seg':
            if self.curr_lang == 'ja':
                self.curr_jp += content
            elif self.curr_lang == 'en':
                self.curr_en += content

def main():
    with open('raw/ted.tmx', 'r', encoding='utf-8') as fin, \
        open('output/ted.csv', 'w', encoding='utf-8', newline='') as fout:
        w = csv.writer(fout, dialect='unix')
        handler = StreamHandler(w)
        parser = lxml.html.HTMLParser(target=handler, encoding='utf-8')
        lxml.html.parse(fin, parser)
        print(f'Sentences: {handler.count_real}/{handler.count}')

if __name__ == '__main__':
    main()
