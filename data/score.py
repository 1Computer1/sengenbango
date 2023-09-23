"""
This file is gpt2-japanesegpt2-score.py modified to run on a csv file.
"""

import importlib
import json
import math
import os
import tensorflow.compat.v1 as tf
import argparse
import csv
import pathlib

if int(tf.__version__[0]) > 1:
    model = importlib.import_module('gpt2-japanese.model')
    HParams = model.HParams
else:
    from tensorflow.contrib.training import HParams

model = importlib.import_module('gpt2-japanese.model')
encode_bpe = importlib.import_module('gpt2-japanese.encode_bpe')
BPEEncoder_ja = encode_bpe.BPEEncoder_ja

def score_tokens(*, hparams, tokens):
    # tokens is 1d, but model expects a batch of token-lists, so make a batch of 1
    x = tf.stack([tokens])

    lm_output = model.model(hparams=hparams, X=x, past=None, reuse=tf.AUTO_REUSE)

    # lm_output['logits'] should have shape [batch_size, tokens_length, vocab_size],
    # but from the slice in sample.py, it seemed like this might not always be the case?
    assert lm_output['logits'].shape[2] == hparams.n_vocab

    # take the first tensor, since batch size is fixed at 1
    logits = lm_output['logits'][0]
    # logits has shape [tokens_length, vocab_size]

    # get actual probabilities, in same shape as logits
    probs = model.softmax(logits)

    # The probabilities are for its guesses about the next token after each position.
    # We want to look up the probability that it gave for what actually turned out to be the "true"
    # next token.
    next_tokens = tokens[1:]
    tokens_range = tf.range(tf.shape(next_tokens)[0])
    indices = tf.stack([tokens_range, next_tokens], axis=-1)
    # indices has shape [next_tokens_length, 2]. it is a list of [pos, token] that we want to lookup in probs
    probs_next = tf.gather_nd(probs, indices)
    # probs_next has shape [tokens_length-1], and has the predicted probability of each input token (after the first one)

    # Get log probabilities
    ln_probs_next = tf.log(probs_next)

    return ln_probs_next

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('source')
    parser.add_argument('--folder', default='./')
    parser.add_argument('--model', default='gpt2ja-medium')
    parser.add_argument('--exclude-end', action='store_true')
    parser.add_argument('--gpu', type=str, default='0')
    args = parser.parse_args()

    with open('gpt2-japanese/ja-bpe.txt', encoding='utf-8') as f:
        bpe = f.read().split('\n')

    with open('gpt2-japanese/emoji.json', encoding='utf-8') as f:
        emoji = json.loads(f.read())

    enc = BPEEncoder_ja(bpe, emoji)
    n_vocab = len(enc)

    if os.path.isfile(args.model+'/hparams.json'):
        with open(args.model+'/hparams.json', encoding='utf-8') as f:
            params = json.loads(f.read())
            hparams = HParams(**params)
    elif 'small' in args.model:
        hparams = HParams(**{
        "n_vocab": n_vocab,
        "n_ctx": 1024,
        "n_embd": 768,
        "n_head": 12,
        "n_layer": 12
        })
    elif 'medium' in args.model:
        hparams = HParams(**{
        "n_vocab": n_vocab,
        "n_ctx": 1024,
        "n_embd": 1024,
        "n_head": 16,
        "n_layer": 24
        })
    elif 'large' in args.model:
        hparams = HParams(**{
        "n_vocab": n_vocab,
        "n_ctx": 1024,
        "n_embd": 1280,
        "n_head": 20,
        "n_layer": 36
        })
    else:
        raise ValueError('invalid model name.')

    with open(pathlib.Path(args.folder, 'output/' + args.source + '.csv'), 'r', encoding='utf-8', newline='') as fin, \
        open(pathlib.Path(args.folder, 'scored/' + args.source + '.csv'), 'w', encoding='utf-8', newline='') as fout:
        reader = csv.reader(fin, dialect='unix')
        writer = csv.writer(fout, dialect='unix')

        config = tf.ConfigProto()

        if int(args.gpu) >= 0:
            config.gpu_options.allow_growth = True
            config.gpu_options.visible_device_list = args.gpu
            # config.log_device_placement=True

        with tf.Session(config=config, graph=tf.Graph()) as sess:
            tokens_tensor = tf.placeholder(tf.int32, [None])

            output = score_tokens(hparams=hparams, tokens=tokens_tensor)

            saver = tf.train.Saver()
            ckpt = tf.train.latest_checkpoint(args.model)
            saver.restore(sess, ckpt)

            end_token = enc.encode('<|endoftext|>')[0]
            start_token = end_token # it does double duty

            for source, name, _, jp, en in reader:
                # prepend the start token so that we get a probability for the first "real" token
                tokens = enc.encode(jp)
                if not args.exclude_end:
                    tokens += [end_token]
                tokens_with_start = [start_token] + tokens

                logprobs = sess.run(output, feed_dict={
                    tokens_tensor: tokens_with_start,
                })

                logprobs_list = logprobs.tolist()
                assert len(logprobs_list) == len(tokens) # sanity check

                score = f"{sum(logprobs_list):.5g}"
                writer.writerow([source, name, score, jp, en])

if __name__ == '__main__':
    main()
