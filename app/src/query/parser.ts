import { EmbeddedActionsParser, Lexer, ParserMethod, createToken } from 'chevrotain';

export type QueryKind = 'Term' | 'Tag' | 'Not' | 'And' | 'Or' | 'Seq';
export type Query =
	| { t: 'Term'; c: string }
	| { t: 'Tag'; c: string }
	| { t: 'Not'; c: Query }
	| { t: 'And'; c: [Query, Query] }
	| { t: 'Or'; c: [Query, Query] }
	| { t: 'Seq'; c: [Query, Query] };

export function parseQuery(input: string): Query {
	const r = lexer.tokenize(input);
	parser.input = r.tokens;
	const res = parser.pexpr();
	if (parser.errors.length) {
		throw new Error(parser.errors.join(', '));
	}
	return res;
}

const WS = createToken({
	name: 'WS',
	pattern: /\s+/,
	group: Lexer.SKIPPED,
});

const PIPE = createToken({
	name: 'PIPE',
	pattern: /[|｜]/,
});

const AND = createToken({
	name: 'AND',
	pattern: /[&＆]/,
});

const LB = createToken({
	name: 'LB',
	pattern: /[{｛]/,
});

const RB = createToken({
	name: 'RB',
	pattern: /[}｝]/,
});

const LP = createToken({
	name: 'LP',
	pattern: /[(（]/,
});

const RP = createToken({
	name: 'RP',
	pattern: /[)）]/,
});

const MINUS = createToken({
	name: 'MINUS',
	pattern: /[-ー!！]/,
});

const TERM = createToken({
	name: 'TERM',
	pattern: /[^|｜&＆{｛}｝(（)）\-ー!！\s]+/,
});

const ALL_TOKENS = [WS, PIPE, AND, LB, RB, LP, RP, MINUS, TERM];

const lexer = new Lexer(ALL_TOKENS);

class Parser extends EmbeddedActionsParser {
	pexpr!: ParserMethod<[], Query>;
	por!: ParserMethod<[], Query>;
	pand!: ParserMethod<[], Query>;
	pseq!: ParserMethod<[], Query>;
	punit!: ParserMethod<[], Query>;
	pnot!: ParserMethod<[], Query>;
	patom!: ParserMethod<[], Query>;
	ptag!: ParserMethod<[], Query>;
	pgroup!: ParserMethod<[], Query>;
	pterm!: ParserMethod<[], Query>;

	constructor() {
		super(ALL_TOKENS);

		this.RULE('pexpr', (): Query => {
			return this.SUBRULE1(this.por);
		});

		this.RULE('por', (): Query => {
			let x = this.SUBRULE1(this.pand);
			this.MANY(() => {
				this.CONSUME(PIPE);
				const y = this.SUBRULE2(this.pand);
				x = { t: 'Or', c: [x, y] };
			});
			return x;
		});

		this.RULE('pand', (): Query => {
			let x = this.SUBRULE1(this.pseq);
			this.MANY(() => {
				this.CONSUME(AND);
				const y = this.SUBRULE2(this.pseq);
				x = { t: 'And', c: [x, y] };
			});
			return x;
		});

		this.RULE('pseq', (): Query => {
			let x = this.SUBRULE3(this.punit);
			this.MANY(() => {
				const y = this.SUBRULE4(this.punit);
				x = { t: 'Seq', c: [x, y] };
			});
			return x;
		});

		this.RULE('punit', (): Query => {
			return this.OR([{ ALT: () => this.SUBRULE1(this.pnot) }, { ALT: () => this.SUBRULE1(this.patom) }]);
		});

		this.RULE('pnot', (): Query => {
			this.CONSUME(MINUS);
			const c = this.SUBRULE2(this.patom);
			return { t: 'Not', c };
		});

		this.RULE('patom', (): Query => {
			return this.OR([
				{ ALT: () => this.SUBRULE1(this.pgroup) },
				{ ALT: () => this.SUBRULE1(this.pterm) },
				{ ALT: () => this.SUBRULE1(this.ptag) },
			]);
		});

		this.RULE('pgroup', (): Query => {
			this.CONSUME(LP);
			const inner = this.SUBRULE3(this.pexpr);
			this.CONSUME(RP);
			return inner;
		});

		this.RULE('ptag', (): Query => {
			this.CONSUME(LB);
			const term = this.CONSUME1(TERM);
			this.CONSUME(RB);
			return { t: 'Tag', c: term.image.replace(/\./g, '・') };
		});

		this.RULE('pterm', (): Query => {
			const term = this.CONSUME2(TERM);
			return { t: 'Term', c: term.image };
		});

		this.performSelfAnalysis();
	}
}

const parser = new Parser();
