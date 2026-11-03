import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ModeProvider } from '@/contexts/ModeContext'
import Index from './pages/Index'
import PageEditor from './pages/PageEditor'
import BoardView from './pages/BoardView'
import DatabaseView from './pages/DatabaseView'
import SessionsCalendar from './pages/SessionsCalendar'
import LootForge from './pages/LootForge'
import NpcView from './pages/NpcView'
import OracleChat from './pages/OracleChat'
import Settings from './pages/Settings'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-400 text-sm">
        Carregando seu espaço...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ModeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Index />} />
              <Route path="/pages/:id" element={<PageEditor />} />
              <Route path="/boards/:id" element={<BoardView />} />
              <Route path="/databases/:id" element={<DatabaseView />} />
              <Route path="/sessions" element={<SessionsCalendar />} />
              <Route path="/loot" element={<LootForge />} />
              <Route path="/npcs" element={<NpcView />} />
              <Route path="/oracle" element={<OracleChat />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </ModeProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
