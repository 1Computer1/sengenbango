"""
Download the XCES file and MOSES/GIZA++ plain text files from https://opus.nlpl.eu/OpenSubtitles-v2018.php.
Extract and move to raw/opensubtitles/en-ja.xml, raw/opensubtitles/OpenSubtitles.en-ja.en, etc.
"""

import lxml.html
import csv
import itertools
from util import likely_good, clean_spaces, is_long_enough, is_too_english

SCORE_THRESHOLD = 0.96

class StreamHandler:
    def __init__(self, writer, finen, finjp, rids) -> None:
        self.writer = writer
        self.count = 0
        self.count_real = 0
        self.curr_node = None
        self.curr_id = [None, None, None, None]
        self.should_write = False
        self.finen = finen
        self.finjp = finjp
        self.rids = rids

    def start(self, name, attrs):
        self.curr_node = name
        if name == 'link':
            a, b = attrs['xtargets'].split(';')
            self.curr_id[2] = a
            self.curr_id[3] = b
            if a and b and 'overlap' in attrs and float(attrs['overlap']) >= SCORE_THRESHOLD:
                self.should_write = True
        elif name == 'linkgrp':
            self.curr_id[0] = attrs['fromdoc']
            self.curr_id[1] = attrs['todoc']

    def end(self, name):
        self.curr_node = None
        if name == 'link' and self.curr_id[2] and self.curr_id[3]:
            self.count += 1
            en = next(self.finen)
            jp = next(self.finjp)
            ids = next(self.rids)
            if ids != self.curr_id:
                self.finen = itertools.chain([en], self.finen)
                self.finjp = itertools.chain([jp], self.finjp)
                self.rids = itertools.chain([ids], self.rids)
                return
            if self.should_write:
                en = en.strip()
                jp = jp.strip()
                if is_long_enough(en, jp) and not is_too_english(jp) and likely_good(en, jp, check_punctuation_jp=False, check_punctuation_en=True, allow_quotes=False):
                    self.count_real += 1
                    self.writer.writerow(['opensubtitles', ' '.join(ids), 0, clean_spaces(jp), clean_spaces(en)])
                self.should_write = False

    def close(self):
        pass

    def data(self, content):
        pass

def main():
    with (
        open('raw/opensubtitles/OpenSubtitles.en-ja.en', 'r', encoding='utf-8') as finen,
        open('raw/opensubtitles/OpenSubtitles.en-ja.ja', 'r', encoding='utf-8') as finjp,
        open('raw/opensubtitles/OpenSubtitles.en-ja.ids', 'r', encoding='utf-8', newline='') as finids,
        open('raw/opensubtitles/en-ja.xml', 'r', encoding='utf-8') as fin,
        open('output/opensubtitles.csv', 'w', encoding='utf-8', newline='') as fout
    ):
        count = 0
        count_real = 0
        w = csv.writer(fout, dialect='unix')
        rids = csv.reader(finids, delimiter='\t')
        handler = StreamHandler(w, finen, finjp, rids)
        parser = lxml.html.HTMLParser(target=handler, encoding='utf-8')
        lxml.html.parse(fin, parser)
        count += handler.count
        count_real += handler.count_real
        print(f'Sentences: {count_real}/{count}')

if __name__ == '__main__':
    main()
