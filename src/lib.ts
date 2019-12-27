import { isArray } from 'util'

import puppeteer, { Page } from 'puppeteer'

export default class HeadlessEval {
	opts: HeadlessEvalOpts

	constructor(opts?: Partial<HeadlessEvalOpts>) {
		this.opts = optsWithDefaults(opts ?? {})
	}

	public async evalSnippet(url: string, snippet: string) {
		const browser = await puppeteer.launch()
		const page = await browser.newPage()
		try {
			return await this.doEvalSnippetInPage(page, url, snippet)
		} finally {
			await browser.close()
		}
	}

	private async doEvalSnippetInPage(page: Page, url: string, snippet: string) {
		await page.goto(url, {
			waitUntil: "networkidle2", // otherwise redirects can destroy the page context, throwing an exception on .evaluate
			timeout: 0,
		})

		const result = await page.evaluate(s => eval(s), snippet)

		const formattedResult = this.maybeSerialize(result)

		return formattedResult
	}

	private maybeSerialize(result: any) {
		if (this.opts.json)
			return JSON.stringify(result, undefined, '\t')

		if (isArray(result))
			return result.join('\n')

		return result
	}
}

type HeadlessEvalOpts = {
	json: boolean,
}

const defaultOpts: HeadlessEvalOpts = {
	json: false,
}

export function optsWithDefaults(partialOpts: Partial<HeadlessEvalOpts>): HeadlessEvalOpts {
	return {
		...defaultOpts,
		...partialOpts,
	}
}
