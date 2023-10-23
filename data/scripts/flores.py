"""
Data available via huggingface.
"""

import csv
from util import clean_spaces
from datasets import load_dataset, concatenate_datasets

def main():
    dataset = load_dataset("facebook/flores", "eng_Latn-jpn_Jpan")
    combined = concatenate_datasets([dataset['dev'], dataset['devtest']])

    with open('output/flores.csv', 'w', encoding='utf-8', newline='') as fout:
        count = 0
        w = csv.writer(fout, dialect='unix')
        for obj in combined:
            count += 1
            jp = obj['sentence_jpn_Jpan'].strip()
            en = obj['sentence_eng_Latn'].strip()
            w.writerow(['flores', obj['id'], 0, clean_spaces(jp), clean_spaces(en)])
        print(f'Sentences: {count}')

if __name__ == '__main__':
    main()
