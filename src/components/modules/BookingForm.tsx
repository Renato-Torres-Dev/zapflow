"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { Check, Loader2, Calendar, Clock, User, Phone } from "lucide-react"

interface BookingData {
  name: string
  phone: string
  date: string
  time: string
}

interface AppointmentData {
  id: string
  customer: string
  phone: string
  dateTime: string
}

export default function BookingForm() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [bookingData, setBookingData] = useState<BookingData>({
    name: "",
    phone: "",
    date: "",
    time: ""
  })
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null)

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00", "18:30"
  ]

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "") // Remove todos os não-dígitos
    
    // Limita a 11 dígitos
    if (value.length > 11) {
      value = value.slice(0, 11)
    }
    
    // Aplica a máscara
    if (value.length <= 2) {
      value = `(${value}`
    } else if (value.length <= 7) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`
    } else {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`
    }
    
    setBookingData({ ...bookingData, phone: value })
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleTimeSelect = (time: string) => {
    setBookingData({ ...bookingData, time })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      // Combinar date e time em um único objeto Date
      const dateTime = new Date(`${bookingData.date}T${bookingData.time}:00`)
      
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: bookingData.name,
          phone: bookingData.phone,
          dateTime: dateTime.toISOString(),
          businessId: 'default-business' // ID fixo para o business
        }),
      })

      // Verificar se a resposta é JSON válido
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Resposta não é JSON:', await response.text())
        alert('Erro no servidor. Verifique o terminal para mais detalhes.')
        return
      }

      if (response.status === 201) {
        const appointment = await response.json()
        setAppointmentData(appointment)
        // Avançar para o step 3 (sucesso)
        setStep(3)
      } else {
        const error = await response.json()
        console.error('Erro ao criar agendamento:', error)
        alert(`Erro: ${error.error || 'Erro desconhecido'}`)
      }
    } catch (error) {
      console.error('Erro na requisição:', error)
      alert('Erro de conexão. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewAppointment = () => {
    setStep(1)
    setBookingData({
      name: "",
      phone: "",
      date: "",
      time: ""
    })
    setAppointmentData(null)
  }

  const formatDateTime = (dateString: string, timeString: string) => {
    if (!dateString || !timeString) return ""
    
    const date = new Date(dateString)
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    
    return `${date.getDate()} de ${months[date.getMonth()]} às ${timeString}`
  }
  const phoneDigits = bookingData.phone.replace(/\D/g, "")
  const isStep1Valid = bookingData.name.trim() !== "" && phoneDigits.length === 11
  const isStep2Valid = bookingData.date !== "" && bookingData.time !== ""

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 pt-20">
      <Card className="w-full max-w-md border-border shadow-[0_0_30px_rgba(0,242,254,0.1)]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Fazer Agendamento</CardTitle>
          <CardDescription>
            Preencha os dados para agendar seu horário
          </CardDescription>
          
          {/* Step Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  s === step
                    ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(0,242,254,0.5)]"
                    : s < step
                    ? "bg-primary/80 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in duration-500">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-muted-foreground text-center">Processando seu agendamento...</p>
            </div>
          )}

          {/* Step 1: Dados Pessoais */}
          {step === 1 && !isLoading && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome Completo</label>
                <Input
                  placeholder="Digite seu nome"
                  value={bookingData.name}
                  onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">WhatsApp</label>
                <Input
                  placeholder="(11) 99999-9999"
                  value={bookingData.phone}
                  onChange={handlePhoneChange}
                  maxLength={15} // (99) 99999-9999 = 15 caracteres
                />
              </div>

              <Button 
                variant="default" 
                className="w-full"
                onClick={handleNext}
                disabled={!isStep1Valid}
              >
                Próximo
              </Button>
            </div>
          )}

          {/* Step 2: Data e Horário */}
          {step === 2 && !isLoading && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data do Agendamento</label>
                <Input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Horário Disponível</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={bookingData.time === time ? "default" : "secondary"}
                      size="sm"
                      className="transition-all duration-200 cursor-pointer"
                      onClick={() => handleTimeSelect(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handlePrevious}
                >
                  Voltar
                </Button>
                <Button 
                  variant="default" 
                  className="flex-1"
                  onClick={handleSubmit}
                  disabled={!isStep2Valid || isLoading}
                >
                  {isLoading ? 'Agendando...' : 'Confirmar Agendamento'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmação */}
          {step === 3 && !isLoading && appointmentData && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Header com Ícone Neon */}
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center shadow-[0_0_30px_rgba(0,242,254,0.3)]">
                    <Check className="w-10 h-10 text-primary" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-primary">Agendamento Confirmado!</h3>
                  <p className="text-muted-foreground mt-2">
                    Seu agendamento foi realizado com sucesso
                  </p>
                </div>
              </div>

              {/* Recibo Elegante */}
              <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-6 space-y-4 border border-primary/20 shadow-[0_0_20px_rgba(0,242,254,0.1)]">
                <div className="text-center mb-4">
                  <h4 className="text-lg font-semibold text-primary">Recibo de Agendamento</h4>
                  <p className="text-xs text-muted-foreground mt-1">Guarde estas informações</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <User className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Cliente</p>
                      <p className="text-sm font-medium">{bookingData.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <Phone className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">WhatsApp</p>
                      <p className="text-sm font-medium">{bookingData.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Data e Horário</p>
                      <p className="text-sm font-medium">
                        {formatDateTime(bookingData.date, bookingData.time)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <Clock className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Código do Agendamento</p>
                      <p className="text-sm font-mono font-medium text-primary">#{appointmentData.id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botão de Novo Agendamento */}
              <Button 
                variant="default" 
                className="w-full shadow-[0_0_20px_rgba(0,242,254,0.3)]"
                onClick={handleNewAppointment}
              >
                Novo Agendamento
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
