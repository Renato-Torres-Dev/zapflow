const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed...')
  
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
  console.log('Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
