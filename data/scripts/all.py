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
import opensubtitles
import reuters
import tatoeba
import ted
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
        opensubtitles,
        reuters,
        tatoeba,
        ted,
        wordnet
    ]:
        print(f'=== {x.__name__} ===')
        x.main()

if __name__ == '__main__':
    main()
