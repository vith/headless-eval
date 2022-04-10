import avaTest, { ExecutionContext, TestFn } from 'ava'

import HeadlessEval from '../src/lib.js'
import { harvardSentences, sentencesQuerySelectorStringified } from './fixtures/data.js'
import startServer, { PortContext } from './fixtures/testServer.js'

const test = avaTest as TestFn<PortContext>

test.before(startServer)

test('extract sentences', async (t: ExecutionContext<PortContext>) => {
	t.plan(1)

	const evaluator = new HeadlessEval()

	const actual = await evaluator.evalSnippet(
		`http://localhost:${t.context.port}/sentences`,
		sentencesQuerySelectorStringified
	)

	t.is(actual, harvardSentences.join('\n'), 'extracted sentences')
})

test('extract sentences as JSON', async t => {
	t.plan(1)

	const jsonEvaluator = new HeadlessEval({ json: true })

	const actualJSON = await jsonEvaluator.evalSnippet(
		`http://localhost:${t.context.port}/sentences`,
		sentencesQuerySelectorStringified
	)

	t.deepEqual(JSON.parse(actualJSON), harvardSentences, 'extracted sentences as json')
})

test('can reuse evaluator instance until closed', async t => {
	t.plan(3)

	const evaluator = new HeadlessEval()

	const actualSentences = await evaluator.evalSnippet(
		`http://localhost:${t.context.port}/sentences`,
		sentencesQuerySelectorStringified
	)

	t.is(
		actualSentences,
		harvardSentences.join('\n'),
		'extracted sentences'
	)

	const getListId = () => document.querySelector('ul')!.id

	const actualListId = await evaluator.evalSnippet(
		`http://localhost:${t.context.port}/sentences`,
		`(${getListId})()`
	)

	t.is(
		actualListId,
		'harvard-sentences',
		'extracted list id'
	)

	evaluator.close()

	await t.throwsAsync(async () =>
		await evaluator.evalSnippet(
			`http://localhost:${t.context.port}/sentences`,
			'2+2'
		),
		{ message: 'Protocol error (Target.createTarget): Target closed.' },
		"attempting to reuse closed instance throws an error"
	)
})
