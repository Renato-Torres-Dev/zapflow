"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, Home } from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-4 left-4 z-50 flex gap-2">
      <Link href="/">
        <Button 
          variant={pathname === "/" ? "default" : "outline"}
          size="sm"
          className="shadow-[0_0_15px_rgba(0,242,254,0.3)]"
        >
          <Home className="w-4 h-4 mr-2" />
          Agendar
        </Button>
      </Link>
      
      {/* Apenas mostra Setup e Admin se não estiver na página inicial */}
      {pathname !== "/" && (
        <>
          <Link href="/setup">
            <Button 
              variant={pathname === "/setup" ? "default" : "outline"}
              size="sm"
              className="shadow-[0_0_15px_rgba(0,242,254,0.3)]"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Setup
            </Button>
          </Link>
          
          <Link href="/admin?key=123">
            <Button 
              variant={pathname === "/admin" ? "default" : "outline"}
              size="sm"
              className="shadow-[0_0_15px_rgba(0,242,254,0.3)]"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </Link>
        </>
      )}
    </nav>
  )
}
