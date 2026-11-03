import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Sparkles, ArrowRight, Lock, Mail, User, CheckCircle2 } from 'lucide-react'

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('amanda_fac1@yahoo.com.br')
  const [password, setPassword] = useState('Skip@Pass')
  const [name, setName] = useState('Amanda')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { login, signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isSignUp) {
        if (!name.trim()) {
          throw new Error('Informe seu nome para continuar.')
        }
        await signup(email, password, name)
      } else {
        await login(email, password)
      }
      navigate('/')
    } catch (err: any) {
      const message =
        err?.data?.message || err?.message || 'Falha ao autenticar. Verifique seus dados.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const fillDemoAccount = () => {
    setEmail('amanda_fac1@yahoo.com.br')
    setPassword('Skip@Pass')
    setIsSignUp(false)
    setError(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/60 p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Logo / Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-900 text-white shadow-sm mb-2">
            <span className="text-2xl font-bold font-mono">N</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Notion Aprimorado
          </h1>
          <p className="text-sm text-slate-500">
            Mais simples, rápido e direto para suas notas, tarefas e tabelas.
          </p>
        </div>

        <Card className="border-slate-200/80 shadow-sm bg-white">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg font-medium text-slate-900">
              {isSignUp ? 'Criar nova conta' : 'Entrar no seu espaço'}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              {isSignUp
                ? 'Preencha seus dados para começar gratuitamente'
                : 'Digite suas credenciais de acesso'}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="py-2 text-xs">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isSignUp && (
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-medium text-slate-700">
                    Seu Nome
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Amanda"
                      className="pl-9 text-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={isSignUp}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-slate-700">
                  E-mail
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="voce@exemplo.com"
                    className="pl-9 text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium text-slate-700">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9 text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm"
                disabled={loading}
              >
                {loading ? 'Aguarde...' : isSignUp ? 'Criar conta' : 'Entrar'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-0">
              <div className="relative w-full text-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-2 text-[11px] text-slate-400 uppercase tracking-wider">
                  Acesso rápido
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fillDemoAccount}
                className="w-full text-xs border-dashed text-slate-600 hover:bg-slate-50"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
                Preencher com conta de demonstração
              </Button>

              <div className="text-center text-xs text-slate-500 pt-1">
                {isSignUp ? (
                  <>
                    Já tem uma conta?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(false)
                        setError(null)
                      }}
                      className="font-medium text-slate-900 hover:underline"
                    >
                      Fazer login
                    </button>
                  </>
                ) : (
                  <>
                    Ainda não tem conta?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(true)
                        setError(null)
                      }}
                      className="font-medium text-slate-900 hover:underline"
                    >
                      Criar agora
                    </button>
                  </>
                )}
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Dados sincronizados
          </span>
          <span>•</span>
          <span>Sem poluição visual</span>
          <span>•</span>
          <span>Design veloz</span>
        </div>
      </div>
    </div>
  )
}
