import basics
import bpersona
import coursera
import flores
import jparacrawl
import kyoto
import legal
import natcom
import nllb
import novels
import reuters
import tatoeba
import wordnet

def main():
    for x in [
        basics,
        bpersona,
        coursera,
        flores,
        jparacrawl,
        kyoto,
        legal,
        natcom,
        nllb,
        novels,
        reuters,
        tatoeba,
        wordnet
    ]:
        print(f'=== {x.__name__} ===')
        x.main()

if __name__ == '__main__':
    main()
