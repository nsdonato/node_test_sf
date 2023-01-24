const app = require('express')()
const { v4 } = require('uuid')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

async function getAllInvoicesController() {
  try {
    const invoices = await prisma.invoice.findMany({
      select: {
        id: true,
        paymentDue: true,
        status: true,
        total: true,
        client: {
          select: {
            name: true
          }
        }
      }
    })
    return invoices
  } catch (error) {
    console.log('getAllInvoicesController: ', error)
  }
}

async function getAllInvoices(_req, res, next) {
  try {
    const invoices = await getAllInvoicesController()
    res.status(200).json({
      ok: true,
      data: invoices
    })
  } catch (error) {
    console.log('getAllInvoices - error: ', error)
  }
}

app.get('/api/invoices', getAllInvoices)

// app.get('/api/invoices/:slug', (req, res) => {
//   const { slug } = req.params
//   res.end(`Item: ${slug}`)
// })

module.exports = app
