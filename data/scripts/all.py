import basics
import bpersona
import coursera
import jparacrawl
import kyoto
import legal
import natcom
import novels
import reuters
import tatoeba
import wordnet

def main():
    for x in [basics, bpersona, coursera, jparacrawl, kyoto, legal, natcom, novels, reuters, tatoeba, wordnet]:
        print(f'=== {x.__name__} ===')
        x.main()

if __name__ == '__main__':
    main()
