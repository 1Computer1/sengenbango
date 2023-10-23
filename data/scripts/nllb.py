"""
Data available via huggingface.
"""

import csv
from util import clean_spaces, likely_good, is_noise, is_too_english
from alive_progress import alive_bar
from datasets import load_dataset

SCORE_THRESHOLD = 1.1

def main():
    dataset = load_dataset("allenai/nllb", "eng_Latn-jpn_Jpan", verification_mode='no_checks')['train']

    with (
        open('output/nllb.csv', 'w', encoding='utf-8', newline='') as fout,
        alive_bar(len(dataset)) as bar
    ):
        count = 0
        count_real = 0
        w = csv.writer(fout, dialect='unix')
        for obj in dataset:
            count += 1
            bar()
            jp = obj['translation']['jpn_Jpan'].strip()
            en = obj['translation']['eng_Latn'].strip()
            if obj['laser_score'] >= SCORE_THRESHOLD:
                if likely_good(en, jp) and not is_noise(jp) and not is_too_english(jp):
                    count_real += 1
                    w.writerow(['nllb', '', 0, clean_spaces(jp), clean_spaces(en)])
            else:
                # data is sorted by score
                break
            bar.text(f'{count_real}/{count}')
        print(f'Sentences: {count_real}/{count}')

if __name__ == '__main__':
    main()
