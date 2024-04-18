import { test } from 'node:test'
import assert from 'node:assert'
import { HttpServer } from './lib/httpServer.js'

test('HttpServer', async () => {
	const body = 'Hello, World!\r\n'
	const server = new HttpServer({ hostname: '0.0.0.0', port: 8080 })

	server.listen(async (req, err) => {
		assert.deepStrictEqual(req.method, 'POST')
		assert.deepStrictEqual(req.url, `http://${server.hostname}:${server.port}/`)
		assert.deepStrictEqual(req.headers.get('content-length'), '15')
		assert.deepStrictEqual(await req.text(), body)
		return new Response(body, {
			status: 200,
			statusText: 'OK',
			headers: { 'Content-Type': 'text/plain', 'Content-Length': '15' },
		})
	})

	const res = await fetch(`http://${server.hostname}:${server.port}`, { method: 'POST', body })

	const text = await res.text()
	assert.deepStrictEqual(text, body)
	server.close()
})
