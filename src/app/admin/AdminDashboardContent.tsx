"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { RefreshCw, Calendar, Clock, CheckCircle, Phone, ExternalLink, Shield } from "lucide-react"

interface Appointment {
  id: string
  customer: string
  phone: string
  dateTime: string
  businessId: string
  createdAt: string
  updatedAt: string
  business?: {
    id: string
    name: string
  }
}

interface Stats {
  today: number
  pending: number
  completed: number
}

export default function AdminDashboardContent() {
  const searchParams = useSearchParams()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState<Stats>({ today: 0, pending: 0, completed: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Middleware de Pobre - Verificação de chave de acesso
  const accessKey = searchParams.get('key')
  
  useEffect(() => {
    setIsAuthenticated(accessKey === '123')
  }, [accessKey])

  const fetchAppointments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/appointments')
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
        calculateStats(data)
      } else {
        console.error('Erro ao buscar agendamentos')
      }
    } catch (error) {
      console.error('Erro na requisição:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (appointments: Appointment[]) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.dateTime)
      return aptDate >= today && aptDate < tomorrow
    })

    const pendingAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.dateTime)
      return aptDate > now
    })

    const completedAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.dateTime)
      return aptDate <= now
    })

    setStats({
      today: todayAppointments.length,
      pending: pendingAppointments.length,
      completed: completedAppointments.length
    })
  }

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return date.toLocaleString('pt-BR', options)
  }

  const formatDate = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return date.toLocaleDateString('pt-BR')
  }

  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString)
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  const getStatus = (dateTimeString: string) => {
    const appointmentDate = new Date(dateTimeString)
    const now = new Date()
    
    if (appointmentDate <= now) {
      return { label: 'Concluído', variant: 'default' as const }
    } else {
      return { label: 'Pendente', variant: 'secondary' as const }
    }
  }

  const openWhatsApp = (customerName: string, phone: string, time: string) => {
    const message = `Olá ${customerName}, confirmamos seu horário às ${time}`
    const formattedPhone = phone.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/55${formattedPhone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppointments()
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#09090B] text-foreground flex items-center justify-center pt-20 p-6">
        <Card className="w-full max-w-md border-border shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-red-400">Acesso Negado</h1>
              <p className="text-muted-foreground mt-2">
                Você não tem permissão para acessar esta área.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Entre em contato com o administrador do sistema.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-foreground pt-20 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Dashboard Admin</h1>
            <p className="text-muted-foreground mt-2">Gerencie seus agendamentos</p>
          </div>
          <Button 
            variant="default" 
            onClick={fetchAppointments}
            disabled={isLoading}
            className="shadow-[0_0_20px_rgba(0,242,254,0.3)]"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border shadow-[0_0_30px_rgba(0,242,254,0.1)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Hoje</p>
                  <p className="text-2xl font-bold text-primary">{stats.today}</p>
                  <p className="text-xs text-muted-foreground mt-1">Agendamentos do dia</p>
                </div>
                <Calendar className="w-8 h-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-[0_0_30px_rgba(0,242,254,0.1)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                  <p className="text-xs text-muted-foreground mt-1">Agendamentos futuros</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-400 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-[0_0_30px_rgba(0,242,254,0.1)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Concluídos</p>
                  <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
                  <p className="text-xs text-muted-foreground mt-1">Agendamentos passados</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Table */}
        <Card className="border-border shadow-[0_0_30px_rgba(0,242,254,0.1)]">
          <CardHeader>
            <CardTitle className="text-xl">Todos os Agendamentos</CardTitle>
            <CardDescription>
              Lista completa de agendamentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Os agendamentos aparecerão aqui quando os clientes fizerem reservas
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium text-muted-foreground">Cliente</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">WhatsApp</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Data/Hora</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment, index) => {
                      const status = getStatus(appointment.dateTime)
                      const isToday = formatDate(appointment.dateTime) === new Date().toLocaleDateString('pt-BR')
                      
                      return (
                        <tr 
                          key={appointment.id}
                          className={`border-b transition-colors ${
                            isToday 
                              ? 'border-primary/30 bg-primary/5' 
                              : 'border-border hover:bg-muted/50'
                          }`}
                        >
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{appointment.customer}</p>
                              {isToday && (
                                <Badge variant="outline" className="text-xs mt-1 border-primary/30 text-primary">
                                  Hoje
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openWhatsApp(
                                appointment.customer, 
                                appointment.phone, 
                                formatTime(appointment.dateTime)
                              )}
                              className="text-green-400 hover:text-green-300 hover:bg-green-400/10 border-green-500/30"
                            >
                              <Phone className="w-4 h-4 mr-2" />
                              {appointment.phone}
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{formatDateTime(appointment.dateTime)}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Criado em {formatDate(appointment.createdAt)}
                              </p>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge 
                              variant={status.variant}
                              className={status.variant === 'default' 
                                ? 'bg-green-500/20 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                                : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.3)]'
                              }
                            >
                              {status.label}
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Rodapé */}
        <div className="text-center py-6 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            ZapFlow v1.0 - Sistema de Agendamento Inteligente
          </p>
        </div>
      </div>
    </div>
  )
}
