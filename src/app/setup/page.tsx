"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const setupDatabase = async () => {
    setIsLoading(true)
    setMessage("")
    
    try {
      const response = await fetch('/api/setup', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setMessage(`✅ ${data.message}`)
      } else {
        setMessage("❌ Erro ao configurar o banco de dados")
      }
    } catch (error) {
      setMessage(`❌ Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border shadow-[0_0_30px_rgba(0,242,254,0.1)]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Setup do Banco</CardTitle>
          <CardDescription>
            Crie o business padrão no banco de dados
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button 
            variant="default" 
            className="w-full"
            onClick={setupDatabase}
            disabled={isLoading}
          >
            {isLoading ? 'Configurando...' : 'Configurar Banco de Dados'}
          </Button>
          
          {message && (
            <div className="p-3 rounded-md bg-muted/50 text-sm">
              {message}
            </div>
          )}
          
          <div className="text-center">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = '/'}
            >
              Voltar para o Formulário
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
