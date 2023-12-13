"""
Quick score i.e. just the negative length and some randomness.
"""

import argparse
import csv
import pathlib

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('source')
    parser.add_argument('--folder', default='./')
    args = parser.parse_args()

    with open(pathlib.Path(args.folder, 'output/' + args.source + '.csv'), 'r', encoding='utf-8', newline='') as fin, \
        open(pathlib.Path(args.folder, 'scored/' + args.source + '.csv'), 'w', encoding='utf-8', newline='') as fout:
        reader = csv.reader(fin, dialect='unix')
        writer = csv.writer(fout, dialect='unix')
        for source, name, _, jp, en in reader:
            score = -101 - len(jp)
            writer.writerow([source, name, score, jp, en])

if __name__ == '__main__':
    main()
