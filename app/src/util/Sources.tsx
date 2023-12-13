export interface Cite {
	title: string;
	authors: string[];
	url: string;
	year: number;
}

export interface Source {
	short: string[];
	name: string;
	url: string;
	license: string;
	original?: string;
	desc: string;
	cites?: Cite[];
	unscored?: boolean;
}

export const Sources: Source[] = [
	{
		short: ['basics'],
		name: '日英中基本文データ',
		url: 'https://nlp.ist.i.kyoto-u.ac.jp/index.php?%E6%97%A5%E8%8B%B1%E4%B8%AD%E5%9F%BA%E6%9C%AC%E6%96%87%E3%83%87%E3%83%BC%E3%82%BF',
		license: 'CC BY 3.0',
		desc: 'Simple sentences.',
	},
	{
		short: ['bpersona-ja-en', 'bpersona-en-ja'],
		name: 'BPersona-chat',
		url: 'https://github.com/cl-tohoku/BPersona-chat',
		license: 'CC BY-NC 4.0',
		desc: 'Conversations in English and Japanese.',
		cites: [
			{
				title: 'Chat Translation Error Detection for Assisting Cross-lingual Communications',
				year: 2022,
				authors: [
					'Li, Yunmeng',
					'Suzuki, Jun',
					'Morishita, Makoto',
					'Abe, Kaori',
					'Tokuhisa, Ryoko',
					'Brassard, Ana',
					'Inui, Kentaro',
				],
				url: 'https://aclanthology.org/2022.eval4nlp-1.9',
			},
			{
				title: 'Empirical Analysis of Training Strategies of Transformer-based Japanese Chit-chat Systems',
				year: 2021,
				authors: [
					'Hiroaki Sugiyama',
					'Masahiro Mizukami',
					'Tsunehiro Arimoto',
					'Hiromi Narimatsu',
					'Yuya Chiba',
					'Hideharu Nakajima',
					'Toyomi Meguro',
				],
				url: 'https://arxiv.org/abs/2109.05217',
			},
		],
	},
	{
		short: ['coursera'],
		name: 'Coursera Corpus',
		url: 'https://github.com/shyyhs/CourseraParallelCorpusMining',
		license: 'Apache-2.0',
		desc: 'Transcripts of Coursera lectures.',
		cites: [
			{
				title: 'Coursera Corpus Mining and Multistage Fine-Tuning for Improving Lectures Translation',
				year: 2020,
				authors: ['Song, Haiyue', 'Dabre, Raj', 'Fujita, Atsushi', 'Kurohashi, Sadao'],
				url: 'https://www.aclweb.org/anthology/2020.lrec-1.449',
			},
		],
	},
	{
		short: ['flores'],
		name: 'FLORES-200',
		url: 'https://github.com/facebookresearch/flores/tree/main/flores200',
		license: 'CC BY-SA 4.0',
		desc: 'Professionally translated sentences of web articles.',
		cites: [
			{
				title: 'No Language Left Behind: Scaling Human-Centered Machine Translation',
				year: 2022,
				authors: ['NLLB Team'],
				url: 'https://arxiv.org/abs/2207.04672',
			},
			{
				title: 'The Flores-101 Evaluation Benchmark for Low-Resource and Multilingual Machine Translation',
				year: 2022,
				authors: [
					'Naman Goyal',
					'Cynthia Gao',
					'Vishrav Chaudhary',
					'Peng-Jen Chen',
					'Guillaume Wenzek',
					'Da Ju',
					'Sanjana Krishnan',
					'Marc’Aurelio Ranzato',
					'Francisco Guzmán',
					'Angela Fan',
				],
				url: 'https://aclanthology.org/2022.tacl-1.30',
			},
		],
	},
	{
		short: ['jparacrawl'],
		name: 'JParaCrawl',
		url: 'http://www.kecl.ntt.co.jp/icl/lirg/jparacrawl/',
		license: 'See LICENSE section.',
		desc: 'Crawled text from websites.',
		cites: [
			{
				title: 'JParaCrawl: A Large Scale Web-Based English-Japanese Parallel Corpus',
				year: 2020,
				authors: ['Morishita, Makoto', 'Suzuki, Jun', 'Nagata, Masaaki'],
				url: 'https://www.aclweb.org/anthology/2020.lrec-1.443',
			},
		],
	},
	{
		short: ['kyoto'],
		name: "Japanese-English Bilingual Corpus of Wikipedia's Kyoto Articles",
		url: 'https://alaginrc.nict.go.jp/WikiCorpus/index_E.html',
		license: 'CC BY-SA 3.0',
		desc: 'Sentences from Japanese Wikipedia articles about Kyoto.',
	},
	{
		short: ['legal'],
		name: 'Japanese-English Legal Parallel Corpus',
		url: 'http://www.phontron.com/jaen-law/',
		license: 'See terms of use.',
		desc: 'Legal documents, relating to patents.',
	},
	{
		short: ['natcom'],
		name: 'ParaNatCom',
		url: 'https://www2.nict.go.jp/astrec-att/member/mutiyama/paranatcom/index.html',
		license: 'CC BY 4.0',
		desc: 'Abstrasts of articles from Nature Communications.',
		cites: [
			{
				title: 'ParaNatCom --- Parallel English-Japanese abstract corpus made from Nature Communications articles',
				year: 2019,
				authors: ['Masao Utiyama'],
				url: 'https://www2.nict.go.jp/astrec-att/member/mutiyama/paranatcom/index.html',
			},
		],
	},
	{
		short: ['nllb'],
		name: 'No Language Left Behind',
		url: 'https://github.com/facebookresearch/fairseq/tree/nllb',
		license: 'ODC-BY 1.0',
		desc: 'Corpus of high-quality sentences from public and mined sources.',
		cites: [
			{
				title: 'No Language Left Behind: Scaling Human-Centered Machine Translation',
				year: 2022,
				authors: ['NLLB Team'],
				url: 'https://arxiv.org/abs/2207.04672',
			},
		],
	},
	{
		short: ['novels'],
		name: '日英対訳文対応付けデータ',
		url: 'https://www2.nict.go.jp/astrec-att/member/mutiyama/align/index.html',
		license: 'CC BY-SA 3.0',
		desc: 'Text from novels.',
		cites: [
			{
				title: 'English-Japanese Translation Alignment Data',
				year: 2003,
				authors: ['Masao Utiyama', 'Mayumi Takahashi'],
				url: 'https://www2.nict.go.jp/astrec-att/member/mutiyama/align/index.html',
			},
		],
	},
	{
		short: ['opensubtitles'],
		name: 'OpenSubtitles',
		url: 'https://opus.nlpl.eu/OpenSubtitles-v2018.php',
		license: 'See terms of use.',
		original: 'http://www.opensubtitles.org',
		desc: 'Subtitles from TV shows and movies.',
		cites: [
			{
				title: 'OpenSubtitles2016: Extracting Large Parallel Corpora from Movie and TV Subtitles',
				year: 2016,
				authors: ['P. Lison', 'J. Tiedemann'],
				url: 'http://www.lrec-conf.org/proceedings/lrec2016/pdf/947_Paper.pdf',
			},
		],
		unscored: true,
	},
	{
		short: ['reuters'],
		name: 'Alignment of Reuters Corpora',
		url: 'https://web.archive.org/web/20220619084240/https://www2.nict.go.jp/astrec-att/member/mutiyama/jea/reuters/index.html',
		license: 'See terms of use.',
		desc: 'News articles from Reuters.',
		cites: [
			{
				title: 'Reliable Measures for Aligning Japanese-English News Articles and Sentences',
				year: 2003,
				authors: ['Masao Utiyama', 'Hitoshi Isahara'],
				url: 'https://www2.nict.go.jp/astrec-att/member/mutiyama/jea/align-final.pdf',
			},
		],
	},
	{
		short: ['tatoeba'],
		name: 'Tatoeba',
		url: 'https://tatoeba.org/en',
		license: 'CC0, CC ND, CC BY, CC SA',
		desc: 'User written sentences and translations.',
	},
	{
		short: ['ted'],
		name: 'TED2020',
		url: 'https://opus.nlpl.eu/TED2020-v1.php',
		license: 'CC BY-NC-ND 4.0',
		original: 'https://www.ted.com/participate/translate',
		desc: 'Transcripts of TED and TED-X talks.',
		cites: [
			{
				title: 'Making Monolingual Sentence Embeddings Multilingual using Knowledge Distillation',
				year: 2020,
				authors: ['Reimers, Nils', 'Gurevych, Iryna'],
				url: 'https://arxiv.org/abs/2004.09813',
			},
		],
		unscored: true,
	},
	{
		short: ['wordnet-def', 'wordnet-exe'],
		name: 'Japanese WordNet',
		url: 'https://bond-lab.github.io/wnja/eng/downloads.html',
		license: 'See LICENSE section.',
		desc: 'Definitions and examples from the WordNet project.',
	},
];
