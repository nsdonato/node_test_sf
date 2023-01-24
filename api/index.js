const app = require('express')()
const { v4 } = require('uuid')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get('/api/invoices', (req, res) => {
  const path = `/api/invoices/${v4()}`
  res.setHeader('Content-Type', 'text/html')
  // res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
  res.end(`Hello! Go to item: <a href="${path}">${path}</a>`)
})

app.get('/api/invoices/:slug', (req, res) => {
  const { slug } = req.params
  res.end(`Item: ${slug}`)
})

module.exports = app
