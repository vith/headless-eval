#!/usr/bin/env node

import { Command } from 'commander'
import readPkgUp from 'read-pkg-up'

import HeadlessEval from './lib'

const program = new Command

const pkg = readPkgUp.sync({ cwd: __dirname })

const { name, version, description } = pkg!.packageJson

program
	.name(name)
	.version(version)
	.description(description!)
	.option('-j, --json', 'output result as JSON')
	.arguments('<url> <js_snippet>')
	.action(main)

program.parse(process.argv)

if (program.args.length < 2)
	program.outputHelp()

async function main(url: string, snippet: string) {
	const evaluator = new HeadlessEval(program.opts())
	const result = await evaluator.evalSnippet(url, snippet)
	console.log(result)
	await evaluator.close()
}
