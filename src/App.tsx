import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ModeProvider } from '@/contexts/ModeContext'
import { EternumLoadingScreen } from '@/components/rpg/EternumLoadingScreen'
import Index from './pages/Index'
import PageEditor from './pages/PageEditor'
import BoardView from './pages/BoardView'
import DatabaseView from './pages/DatabaseView'
import SessionsCalendar from './pages/SessionsCalendar'
import LootForge from './pages/LootForge'
import NpcView from './pages/NpcView'
import OracleChat from './pages/OracleChat'
import CombatTracker from './pages/CombatTracker'
import Settings from './pages/Settings'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Layout from './components/Layout'

function AppBootstrapGate({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth()
  const [showSplash, setShowSplash] = useState(true)
  const [isFadingOut, setIsFadingOut] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      // Inicia a transição suave de fade out
      setIsFadingOut(true)
      const timer = setTimeout(() => {
        setShowSplash(false)
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  return (
    <>
      {showSplash && (
        <EternumLoadingScreen
          message="Despertando os segredos de Éternum..."
          submessage="Sincronizando crônicas, fichas e arcanos"
          isExiting={isFadingOut}
        />
      )}
      {children}
    </>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <EternumLoadingScreen
        message="Acessando o santuário da mesa..."
        submessage="Validando selo do aventureiro"
      />
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
      <AppBootstrapGate>
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
                <Route path="/combat" element={<CombatTracker />} />
                <Route path="/npcs" element={<NpcView />} />
                <Route path="/oracle" element={<OracleChat />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </ModeProvider>
      </AppBootstrapGate>
    </AuthProvider>
  </BrowserRouter>
)

export default App
