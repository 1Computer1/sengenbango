import {
	EarlyExitException,
	EmbeddedActionsParser,
	IRecognitionException,
	Lexer,
	MismatchedTokenException,
	NoViableAltException,
	ParserMethod,
	createToken,
} from 'chevrotain';

export type QueryKind = 'term' | 'tag' | 'not' | 'and' | 'or' | 'seq';

export type Query = { t: QueryKind } & (
	| { t: 'term'; c: string }
	| { t: 'tag'; c: string }
	| { t: 'not'; c: Query }
	| { t: 'and'; c: [Query, Query] }
	| { t: 'or'; c: [Query, Query] }
	| { t: 'seq'; c: [Query, Query] }
);

export type Result<A, B> = { ok: true; value: A } | { ok: false; error: B };

export function parseQuery(input: string): Result<Query, IRecognitionException[]> {
	const r = lexer.tokenize(input);
	parser.input = r.tokens;
	const res = parser.pexpr();
	if (parser.errors.length) {
		return { ok: false, error: parser.errors };
	}
	return { ok: true, value: res };
}

export function formatError(errors: IRecognitionException[]): string[] {
	return errors.map((e) => {
		if (e instanceof EarlyExitException) {
			return `Syntax error in query at ${
				e.token.image ? `'${e.token.image}'` : 'end'
			}: query is malformed, not enough input.`;
		} else if (e instanceof MismatchedTokenException) {
			const t = e.message.match(/--> (.+?) <--/)![1];
			return `Syntax error in query at ${e.token.image ? `'${e.token.image}'` : 'the end'}: expected ${tokenToName(
				t,
			)} to be next.`;
		} else if (e instanceof NoViableAltException) {
			const ts = [...e.message.matchAll(/\d+\. \[(.+)\]/g)];
			return `Syntax error in query at ${e.token.image ? `'${e.token.image}'` : 'the end'}: expected one of ${ts
				.map((t) => tokenToName(t[1]))
				.sort()
				.join(', ')}.`;
		} else {
			return `Syntax error in query at ${e.token.image ? `'${e.token.image}'` : 'the end'}: query is malformed.`;
		}
	});
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
	pattern: /[!！]/,
});

const TERM = createToken({
	name: 'TERM',
	pattern: /[^|｜&＆{｛}｝(（)）!！\s]+/,
});

export function tokenToName(t: string): string {
	switch (t) {
		case 'WS':
			return 'whitespace';
		case 'PIPE':
			return "'|'";
		case 'AND':
			return "'&'";
		case 'LB':
			return "'{'";
		case 'RB':
			return "'}'";
		case 'LP':
			return "'('";
		case 'RP':
			return "')'";
		case 'MINUS':
			return "'!'";
		case 'TERM':
			return 'text';
		default:
			throw new Error('unknown token type');
	}
}

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
				x = { t: 'or', c: [x, y] };
			});
			return x;
		});

		this.RULE('pand', (): Query => {
			let x = this.SUBRULE1(this.pseq);
			this.MANY(() => {
				this.CONSUME(AND);
				const y = this.SUBRULE2(this.pseq);
				x = { t: 'and', c: [x, y] };
			});
			return x;
		});

		this.RULE('pseq', (): Query => {
			let x = this.SUBRULE3(this.punit);
			this.MANY(() => {
				const y = this.SUBRULE4(this.punit);
				x = { t: 'seq', c: [x, y] };
			});
			return x;
		});

		this.RULE('punit', (): Query => {
			return this.OR([{ ALT: () => this.SUBRULE1(this.pnot) }, { ALT: () => this.SUBRULE1(this.patom) }]);
		});

		this.RULE('pnot', (): Query => {
			this.CONSUME(MINUS);
			const c = this.SUBRULE2(this.patom);
			return { t: 'not', c };
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
			return { t: 'tag', c: term.image.replace(/\./g, '・') };
		});

		this.RULE('pterm', (): Query => {
			const term = this.CONSUME2(TERM);
			return { t: 'term', c: term.image };
		});

		this.performSelfAnalysis();
	}
}

const parser = new Parser();
