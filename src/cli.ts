#!/usr/bin/env node

import { Command } from 'commander'

import { pkgInfo } from './pkg-info.js'
import HeadlessEval from './lib.js'

const program = new Command

const { name, version, description } = pkgInfo.packageJson


program
	.name(name)
	.version(version)
	.description(description!)
	.option('-j, --json', 'output result as JSON')
	.arguments('<url> <js_snippet>')
	.action(main)
	.showHelpAfterError()

program.parse(process.argv)

async function main(url: string, snippet: string) {
	const evaluator = new HeadlessEval(program.opts())
	const result = await evaluator.evalSnippet(url, snippet)
	console.log(result)
	await evaluator.close()
}
