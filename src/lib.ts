import puppeteer, { Browser, Page } from 'puppeteer'

import { HeadlessEvalOpts, optsWithDefaults } from './options.js'

export default class HeadlessEval {
	private opts: HeadlessEvalOpts
	private browserPromise: Promise<Browser>

	constructor(opts?: Partial<HeadlessEvalOpts>) {
		this.opts = optsWithDefaults(opts)
		this.browserPromise = puppeteer.launch()
	}

	public async evalSnippet(url: string, snippet: string) {
		const browser = await this.browserPromise;
		const page = await browser.newPage()

		try {
			return await this.doEvalSnippetInPage(page, url, snippet)
		} finally {
			await page.close()
		}
	}

	public async close(): Promise<void> {
		const browser = await this.browserPromise
		return browser.close()
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

		if (Array.isArray(result))
			return result.join('\n')

		return result
	}
}
