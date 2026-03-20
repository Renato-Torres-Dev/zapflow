import { Suspense } from 'react'
import AdminDashboardContent from './AdminDashboardContent'

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#09090B] flex items-center justify-center text-[#00F2FE]">Carregando Painel...</div>}>
      <AdminDashboardContent />
    </Suspense>
  )
}
