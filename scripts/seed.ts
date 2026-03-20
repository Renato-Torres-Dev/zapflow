import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Criar um business de exemplo
  const business = await prisma.business.upsert({
    where: { id: 'default-business' },
    update: {},
    create: {
      id: 'default-business',
      name: 'Barbearia Exemplo',
    },
  })

  console.log('Business criado:', business)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
