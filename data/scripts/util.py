import re

RE_SPACES = re.compile(r'[\r\n\t\f\v \u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+', flags=re.M)
RE_EN = re.compile(r'[A-Za-z]')
RE_JP = re.compile(r'[一-龯ぁ-ゔゞァ-・ヽヾ゛゜]')

ens = r'[A-Za-z]'

RE_EN_SPACE = re.compile(fr'(?<!{ens})\s(?!{ens})|(?<={ens})\s(?!{ens})|(?<!{ens})\s(?={ens})')

def _make_gen(reader):
    b = reader(1024 * 1024)
    while b:
        yield b
        b = reader(1024*1024)

def numlines(filename):
    """
    From https://stackoverflow.com/a/27518377/10499803
    """

    f = open(filename, 'rb')
    f_gen = _make_gen(f.raw.read)
    return sum(buf.count(b'\n') for buf in f_gen)

def likely_good(en, jp, check_punctuation_en=True, check_punctuation_jp=True, allow_quotes=True):
    """
    Make sure text is strip()'d first.
    """
    if not en or not jp:
        return False
    if not RE_EN.search(en) or not RE_JP.search(jp):
        return False

    k = False
    matching_quotes_en = (
            (not (en.startswith('"') or en.endswith('"')) or (k := k or en.count('"') % 2 == 0))
        and (not (en.startswith("'") or en.endswith("'")) or (k := k or en.count("'") % 2 == 0))
        and (not (en.startswith("``") or en.endswith("''")) or (k := k or en.count("``") == en.count("''")))
        and (not (en.startswith("(") or en.endswith(")")) or (k := k or en.count("(") == en.count(")")))
    )
    if not allow_quotes and k:
        return False

    k = False
    matching_quotes_jp = (
            (not (jp.startswith("「") or jp.endswith("」")) or (k := k or jp.count("「") == jp.count("」")))
        and (not (jp.startswith("（") or jp.endswith("）")) or (k := k or jp.count("（") == jp.count("）")))
    )
    if not allow_quotes and k:
        return False

    if check_punctuation_en:
        sentence_like_en = (
            not (en[0].islower() or not matching_quotes_en)
            and en.endswith(('.', '!', '?'))
        )
        if not sentence_like_en:
            return False
    if check_punctuation_jp:
        sentence_like_jp = (
            matching_quotes_jp
            and jp.endswith(('。', '！', '？'))
        )
        if not sentence_like_jp:
            return False
    return True

def clean_spaces(t):
    return RE_SPACES.sub(' ', t)

def remove_jp_spaces(t):
    return RE_EN_SPACE.sub('', t)
