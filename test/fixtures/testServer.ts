import fs from 'fs';

import Router from '@koa/router';
import { ExecutionContext } from 'ava'
import getPort from 'get-port';
import HttpStatus from 'http-status-codes';
import Koa from 'koa';

export type PortContext = { port: number }

export default async function startServer(t: ExecutionContext<PortContext>) {
	const backend = new Koa
	const router = new Router

	router.get('/sentences', async ctx => {
		ctx.body = await fs.promises.readFile('./test/fixtures/sentences.html')
		ctx.type = 'text/html'
		ctx.status = HttpStatus.OK
	})

	backend.use(router.routes())
	backend.use(router.allowedMethods())

	const port = await getPort()
	backend.listen(port)
	t.context.port = port
}
