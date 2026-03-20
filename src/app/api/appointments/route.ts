import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Dados recebidos:', body)
    
    const { customer, phone, dateTime, businessId } = body

    // Validação básica
    if (!customer || !phone || !dateTime) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: customer, phone, dateTime' },
        { status: 400 }
      )
    }

    // Usar businessId padrão se não for enviado
    const finalBusinessId = businessId || 'default-business'
    console.log('Business ID final:', finalBusinessId)

    // Converter string para Date
    const appointmentDate = new Date(dateTime)
    console.log('Data convertida:', appointmentDate)

    // Verificar se a data é válida
    if (isNaN(appointmentDate.getTime())) {
      return NextResponse.json(
        { error: 'Data inválida' },
        { status: 400 }
      )
    }

    // Verificar se o business existe antes de criar o appointment
    const business = await prisma.business.findUnique({
      where: { id: finalBusinessId }
    })

    if (!business) {
      return NextResponse.json(
        { error: 'Business não encontrado' },
        { status: 400 }
      )
    }

    console.log('Business encontrado:', business)

    // Salvar no banco de dados
    const appointment = await prisma.appointment.create({
      data: {
        customer,
        phone,
        dateTime: appointmentDate,
        businessId: finalBusinessId,
      },
    })

    console.log('Agendamento criado:', appointment)
    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Erro detalhado ao criar agendamento:', error)
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        business: true,
      },
      orderBy: {
        dateTime: 'desc',
      },
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
