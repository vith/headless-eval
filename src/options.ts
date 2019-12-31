export type HeadlessEvalOpts = {
	json: boolean,
}

const defaultOpts: HeadlessEvalOpts = {
	json: false,
}

export function optsWithDefaults(partialOpts: Partial<HeadlessEvalOpts> = {}): HeadlessEvalOpts {
	return {
		...defaultOpts,
		...partialOpts,
	}
}
