import fs from 'fs'

import Router from '@koa/router'
import avaTest, { TestInterface } from 'ava'
import getPort from 'get-port'
import HttpStatus from 'http-status-codes'
import Koa from 'koa'

import HeadlessEval from '../src/lib'

const test = avaTest as TestInterface<{ port: number }>

test.before(async t => {
	const backend = new Koa
	const router = new Router

	router.get('/sentences', async ctx => {
		ctx.body = await fs.promises.readFile('./test/sentences.html')
		ctx.type = 'text/html'
		ctx.status = HttpStatus.OK
	})

	backend.use(router.routes())
	backend.use(router.allowedMethods())

	const port = await getPort()
	backend.listen(port)
	t.context = { port }
})

const sentencesQuerySelector = () =>
	[...document.querySelectorAll("ul#harvard-sentences > li")]
		.map(li => {
			if (!(li instanceof HTMLLIElement))
				throw new TypeError
			return li.innerText
		})

const harvardSentences = [
	'Oak is strong and also gives shade.',
	'Cats and dogs each hate the other.',
	'The pipe began to rust while new.',
]

test('extract sentences', async t => {
	t.plan(1)

	const evaluator = new HeadlessEval()

	const actual = await evaluator.evalSnippet(
		`http://localhost:${t.context.port}/sentences`,
		`(${sentencesQuerySelector})()`
	)

	t.is(actual, harvardSentences.join('\n'))
})

test('extract sentences as JSON', async t => {
	t.plan(1)

	const jsonEvaluator = new HeadlessEval({ json: true })

	const actualJSON = await jsonEvaluator.evalSnippet(
		`http://localhost:${t.context.port}/sentences`,
		`(${sentencesQuerySelector})()`
	)

	t.deepEqual(JSON.parse(actualJSON), harvardSentences)
})

test('can reuse evaluator instance until closed', async t => {
	t.plan(3)

	const evaluator = new HeadlessEval()

	const actualSentences = await evaluator.evalSnippet(
		`http://localhost:${t.context.port}/sentences`,
		`(${sentencesQuerySelector})()`
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
