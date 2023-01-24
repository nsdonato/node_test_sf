import fs from 'fs'

import { PrismaClient } from '@prisma/client'

import { type Data } from './data.dto'

const data = JSON.parse(fs.readFileSync('./prisma/data.json', 'utf-8'))

const prisma = new PrismaClient()

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function main() {
  await prisma.$transaction(
    data.map((d: Data) =>
      prisma.invoice.upsert({
        where: { id: d.id },
        update: {},
        create: {
          paymentDue: new Date(d.paymentDue),
          description: d.description,
          status: d.status,
          paymentTerms: d.paymentTerms,
          total: d.total,
          address: {
            create: {
              street: d.senderAddress.street,
              city: d.senderAddress.city,
              postCode: d.senderAddress.postCode,
              country: d.senderAddress.country
            }
          },
          client: {
            create: {
              name: d.clientName,
              email: d.clientEmail,
              address: {
                create: {
                  street: d.clientAddress.street,
                  city: d.clientAddress.city,
                  postCode: d.clientAddress.postCode,
                  country: d.clientAddress.country
                }
              }
            }
          },
          items: {
            create: [...d.items]
          }
        }
      })
    )
  )
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
