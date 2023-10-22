import { Heading, Text } from 'react-aria-components';
import { FaCircleQuestion } from 'react-icons/fa6';
import { CustomDialog } from './layout/CustomDialog';

export interface HelpProps {}

export function Help() {
	return (
		<CustomDialog
			title="Help"
			button={
				<div className="flex flex-row items-center gap-1">
					<FaCircleQuestion /> Help
				</div>
			}
		>
			<div className="flex flex-col gap-2">
				<div className="flex flex-col gap-2">
					<Heading level={2} className="text-xl font-bold">
						Query Syntax
					</Heading>
					<Text>
						The following search operators are available:
						<ul className="list-disc list-inside">
							<li>
								<span className="font-bold font-mono mr-1">A B</span> A must be followed by B.
							</li>
							<li>
								<span className="font-bold font-mono mr-1">A & B</span> Both A and B must match.
							</li>
							<li>
								<span className="font-bold font-mono mr-1">A | B</span> One of A or B must match.
							</li>
							<li>
								<span className="font-bold font-mono mr-1">!A -A</span> A must not match.
							</li>
							<li>
								<span className="font-bold font-mono mr-1">(A)</span> Subqueries can be nested with parentheses.
							</li>
							<li>
								<span className="font-bold font-mono mr-1">
									{'{'}A{'}'}
								</span>{' '}
								Part-of-speech tags, e.g. 名詞, can be used instead of words. See{' '}
								<a
									href="http://web.archive.org/web/20221001202616/https://www.unixuser.org/~euske/doc/postag/"
									className="text-blue-600 dark:text-blue-400 underline"
								>
									the ChaSen section here
								</a>{' '}
								for the full list. Subtypes can be searched by separating them with middle dots, e.g. 名詞・固有名詞.
							</li>
						</ul>
					</Text>
				</div>
				<div className="flex flex-col gap-2">
					<Heading level={2} className="text-xl font-bold">
						Sentence Quality
					</Heading>
					<Text>
						Sentences are sorted according to how natural the Japanese seem, using the{' '}
						<a
							href="https://github.com/tanreinama/gpt2-japanese"
							className="text-blue-600 dark:text-blue-400 underline"
						>
							gpt2-japanese
						</a>{' '}
						project. Any sentence that reach a certain threshold is given a yellow star.
						<br />
						English translations are not checked for accuracy. For some data sources which do not manually align their
						translations, some sentences may not have the correct translation included.
					</Text>
				</div>
				<div className="flex flex-col gap-2">
					<Heading level={2} className="text-xl font-bold">
						Reporting Issues
					</Heading>
					<Text>
						sengenbango is open source! Report issues on the{' '}
						<a href="https://github.com/1Computer1/sengenbango/" className="text-blue-600 dark:text-blue-400 underline">
							Github
						</a>{' '}
						repository. <br />
						Note: Problems with individual sentences should not be reported.
					</Text>
				</div>
				<div className="flex flex-col gap-2">
					<Heading level={2} className="text-xl font-bold">
						Sources
					</Heading>
					<Text>
						<ul className="list-disc list-inside text-xs">
							<li>
								<span className="font-bold font-mono mr-1">tatoeba</span> User written sentences and translations.{' '}
								<a href="https://tatoeba.org/en" className="text-blue-600 dark:text-blue-400 underline">
									Tatoeba
								</a>
							</li>
							<li>
								<span className="font-bold font-mono mr-1">kyoto</span> Sentences from Japanese Wikipedia articles about
								Kyoto.{' '}
								<a
									href="https://alaginrc.nict.go.jp/WikiCorpus/index_E.html"
									className="text-blue-600 dark:text-blue-400 underline"
								>
									Japanese-English Bilingual Corpus of Wikipedia's Kyoto Articles
								</a>
							</li>
							<li>
								<span className="font-bold font-mono mr-1">coursera</span> Subtitles from Coursera lectures.{' '}
								<a
									href="https://github.com/shyyhs/CourseraParallelCorpusMining"
									className="text-blue-600 dark:text-blue-400 underline"
								>
									Coursera Corpus
								</a>
							</li>
							<li>
								<span className="font-bold font-mono mr-1">bpersona-ja-en bpersona-en-ja</span> Conversations in English
								and Japanese.{' '}
								<a
									href="https://github.com/cl-tohoku/BPersona-chat"
									className="text-blue-600 dark:text-blue-400 underline"
								>
									BPersona-chat
								</a>
							</li>
							<li>
								<span className="font-bold font-mono mr-1">jparacrawl</span> Crawled text from websites.{' '}
								<a
									href="http://www.kecl.ntt.co.jp/icl/lirg/jparacrawl/"
									className="text-blue-600 dark:text-blue-400 underline"
								>
									JParaCrawl
								</a>
							</li>
							<li>
								<span className="font-bold font-mono mr-1">wordnet-def wordnet-exe</span> Definitions and examples from
								the WordNet project.{' '}
								<a
									href="https://bond-lab.github.io/wnja/eng/downloads.html"
									className="text-blue-600 dark:text-blue-400 underline"
								>
									Japanese WordNet
								</a>
							</li>
							<li>
								<span className="font-bold font-mono mr-1">legal</span> Legal documents, relating to patents.{' '}
								<a href="http://www.phontron.com/jaen-law/" className="text-blue-600 dark:text-blue-400 underline">
									Japanese-English Legal Parallel Corpus
								</a>
							</li>
							<li>
								<span className="font-bold font-mono mr-1">reuters</span> News articles from Reuters.{' '}
								<a
									href="https://www2.nict.go.jp/astrec-att/member/mutiyama/jea/reuters/index.html"
									className="text-blue-600 dark:text-blue-400 underline"
								>
									Alignment of Reuters Corpora
								</a>
							</li>
							<li>
								<span className="font-bold font-mono mr-1">natcom</span> Abstrasts of articles from Nature
								Communications.{' '}
								<a
									href="https://www2.nict.go.jp/astrec-att/member/mutiyama/paranatcom/index.html"
									className="text-blue-600 dark:text-blue-400 underline"
								>
									ParaNatCom
								</a>
							</li>
							<li>
								<span className="font-bold font-mono mr-1">novels</span> Text from novels.{' '}
								<a
									href="https://www2.nict.go.jp/astrec-att/member/mutiyama/align/index.html"
									className="text-blue-600 dark:text-blue-400 underline"
								>
									日英対訳文対応付けデータ
								</a>
							</li>
							<li>
								<span className="font-bold font-mono mr-1">basics</span> Simple sentences.{' '}
								<a
									href="https://nlp.ist.i.kyoto-u.ac.jp/index.php?%E6%97%A5%E8%8B%B1%E4%B8%AD%E5%9F%BA%E6%9C%AC%E6%96%87%E3%83%87%E3%83%BC%E3%82%BF"
									className="text-blue-600 dark:text-blue-400 underline"
								>
									日英中基本文データ
								</a>
							</li>
						</ul>
					</Text>
				</div>
			</div>
		</CustomDialog>
	);
}
