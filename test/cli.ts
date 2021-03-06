import path from 'path'
import pkgDir from 'pkg-dir'

import avaTest, { ExecutionContext, TestInterface } from 'ava'
import execa from 'execa'
import npm from 'npm'

import { harvardSentences, sentencesQuerySelectorStringified } from './fixtures/data'
import startServer, { PortContext } from './fixtures/testServer'

type CliContext = {
	tsNodePath: string,
	headlessEvalCliPath: string,
}

type PortAndCliContext = PortContext & CliContext

const test = avaTest as TestInterface<PortAndCliContext>

test.before(startServer)

test.before(async function findPaths(t: ExecutionContext<CliContext>) {
	// @ts-expect-error upstream types are wrong
	await npm.config.load()
	t.context.tsNodePath = path.join(npm.bin, 'ts-node')

	const headlessEvalPkgDir = await pkgDir()
	if (!headlessEvalPkgDir)
		throw new Error("Couldn't find headless-eval package directory")
	t.context.headlessEvalCliPath = path.join(headlessEvalPkgDir, 'src', 'cli.ts')
})

test('extraction via cli', async (t: ExecutionContext<PortAndCliContext>) => {
	t.plan(1)

	const { stdout } = await execa(t.context.tsNodePath, [
		t.context.headlessEvalCliPath,
		`http://localhost:${t.context.port}/sentences`,
		sentencesQuerySelectorStringified,
	])

	t.is(stdout, harvardSentences.join('\n'), 'extracted sentences')
})

test('json extraction via cli', async (t: ExecutionContext<PortAndCliContext>) => {
	t.plan(1)

	const { stdout } = await execa(t.context.tsNodePath, [
		t.context.headlessEvalCliPath,
		'-j',
		`http://localhost:${t.context.port}/sentences`,
		sentencesQuerySelectorStringified,
	])

	t.deepEqual(JSON.parse(stdout), harvardSentences, 'extracted sentences as json')
})
