export interface CodeProps {
	children: React.ReactNode;
}

export function Code({ children }: CodeProps) {
	return <span className="font-bold font-mono bg-zinc-300 dark:bg-zinc-700 rounded-sm px-0.5">{children}</span>;
}
