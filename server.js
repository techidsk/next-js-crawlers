// server.js
const express = require('express')
const next = require('next')
const { createProxyMiddleware } = require('http-proxy-middleware');

const devProxy = {
    'http://site.yunzitui.com:10024/api': {
        // 'http://localhost:10024/api': {
        target: 'http://spider.yunzitui.com:7474/api', // 端口自己配置合适的
        // target: 'http://localhost:7474/api', // 端口自己配置合适的
        pathRewrite: {
            '^/api': '/'
        },
        changeOrigin: true
    }
}

const port = parseInt(process.env.PORT, 10) || 10024
const dev = process.env.NODE_ENV !== 'production'
const app = next({
    dev
})
const handle = app.getRequestHandler()

app.prepare()
    .then(() => {
        const server = express()

        Object.keys(devProxy).forEach(function (context) {
            server.use(createProxyMiddleware(context, devProxy[context]))
        })

        server.all('*', (req, res) => {
            handle(req, res)
        })

        server.listen(port, err => {
            if (err) {
                throw err
            }
            console.log(`> Ready on http://localhost:${port}`)
        })
    })
    .catch(err => {
        console.log('An error occurred, unable to start the server')
        console.log(err)
    })