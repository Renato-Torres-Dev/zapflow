import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Usar upsert para garantir que o business exista
    const business = await prisma.business.upsert({
      where: { id: 'default-business' },
      update: {
        name: 'ZapFlow Barbearia',
      },
      create: {
        id: 'default-business',
        name: 'ZapFlow Barbearia',
      },
    })

    console.log('Business configurado:', business)

    return NextResponse.json({ 
      message: "Banco configurado!",
      business 
    })
  } catch (error) {
    console.error('Erro ao configurar banco:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao configurar banco de dados',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
