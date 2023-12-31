import { Heading, Text } from 'react-aria-components';
import { FaCircleQuestion } from 'react-icons/fa6';
import { CustomDialog } from './layout/CustomDialog';
import { Sources } from '../util/Sources.tsx';
import { Code } from './Code.tsx';

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
								<Code>A B</Code> A must be followed by B.
							</li>
							<li>
								<Code>A & B</Code> Both A and B must match.
							</li>
							<li>
								<Code>A | B</Code> One of A or B must match.
							</li>
							<li>
								<Code>!A</Code> A must not match.
							</li>
							<li>
								<Code>(A)</Code> Subqueries can be nested with parentheses.
							</li>
							<li>
								<Code>
									{'{'}A{'}'}
								</Code>{' '}
								Part-of-speech tags, e.g. 名詞, can be used instead of words. See{' '}
								<a
									href="http://web.archive.org/web/20221001202616/https://www.unixuser.org/~euske/doc/postag/"
									className="text-blue-600 dark:text-blue-400 underline"
								>
									the ChaSen section here
								</a>{' '}
								for the list. Subtypes can be searched by separating them with middle dots, e.g. 名詞・固有名詞.
							</li>
							<li>
								<Code>J : E</Code> The queries J and E are searched in parallel in the two languages. This is useful to
								find Japanese words being translated to English in certain ways.
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
						<ul className="flex flex-col text-xs gap-2">
							{Sources.map((s) => (
								<li key={s.short.join(' ')} className="flex flex-col gap-0.5">
									<div>
										⋅{' '}
										<a href={s.url} className="text-blue-600 dark:text-blue-400 underline">
											{s.name}
										</a>
										{s.short.map((t) => (
											<>
												{' '}
												<Code>{t}</Code>
											</>
										))}
									</div>
									<ul className="flex flex-col text-xs gap-0.5 ml-2">
										<li>⋅ {s.license}</li>
										{s.original && (
											<li>
												⋅ Data provided by{' '}
												<a href={s.original} className="text-blue-600 dark:text-blue-400 underline">
													{s.original}
												</a>
												.
											</li>
										)}
										<li>⋅ {s.desc}</li>
										{s.cites &&
											s.cites.map((c) => (
												<li key={c.title} className="flex flex-col">
													<span>
														⋅ {c.authors.join(', ')}. ({c.year}). {c.title}.{' '}
														<a href={c.url} className="text-blue-600 dark:text-blue-400 underline">
															{c.url}
														</a>
													</span>
												</li>
											))}
										{s.unscored && (
											<li>
												⋅{' '}
												<span className="text-red-600">
													This source is currently not scored properly. Sorting will be inaccurate.
												</span>
											</li>
										)}
									</ul>
								</li>
							))}
						</ul>
					</Text>
				</div>
			</div>
		</CustomDialog>
	);
}
