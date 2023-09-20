"""
Download the data from https://alaginrc.nict.go.jp/WikiCorpus/index_E.html.
Extract it and move the folder containing folders of xml files to raw/wiki.
"""

from alive_progress import alive_bar
import lxml.html
import csv
import glob
import pathlib
from util import likely_good, clean_spaces

class StreamHandler:
    def __init__(self, writer, name) -> None:
        self.writer = writer
        self.name = name
        self.count = 0
        self.count_real = 0
        self.curr_node = None
        self.curr_sen = None
        self.curr_type = None
        self.curr_jp = ''
        self.curr_en = ''

    def start(self, name, attrs):
        self.curr_node = name
        if name == 'sen':
            self.curr_sen = attrs['id']
        elif name == 'e':
            self.curr_type = attrs['type']

    def end(self, name):
        self.curr_node = None
        if name == 'sen':
            self.count += 1
            en = self.curr_en.strip()
            jp = self.curr_jp.strip()
            if likely_good(en, jp):
                self.count_real += 1
                self.writer.writerow(['kyoto', self.name + ' ' + self.curr_sen, 0, clean_spaces(jp), clean_spaces(en)])
            self.curr_jp = ''
            self.curr_en = ''
            self.curr_sen = None
        elif name == 'e':
            self.curr_type = None

    def close(self):
        pass

    def data(self, content):
        if self.curr_sen:
            if self.curr_node == 'j':
                self.curr_jp += content
            elif self.curr_node == 'e' and self.curr_type == 'check':
                self.curr_en += content

def main():
    filenames = glob.glob('raw/wiki/*/*.xml')
    with open('output/kyoto.csv', 'w', encoding='utf-8', newline='') as fout, \
        alive_bar(len(filenames)) as bar:
        count = 0
        count_real = 0
        w = csv.writer(fout, dialect='unix')
        for name in filenames:
            with open(name, 'r', encoding='utf-8', newline='') as fin:
                handler = StreamHandler(w, pathlib.Path(name).stem)
                parser = lxml.html.HTMLParser(target=handler, encoding='utf-8')
                lxml.html.parse(fin, parser)
                count += handler.count
                count_real += handler.count_real
                bar()
                bar.text(f'{count_real}/{count}')
        print(f'Sentences: {count_real}/{count}')

if __name__ == '__main__':
    main()
