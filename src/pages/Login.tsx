import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { RuneCrestIcon } from '@/components/rpg/EternumIcons'
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
    <div className="min-h-screen flex items-center justify-center bg-[#090c10] p-4 sm:p-6 text-[#f1ede3] relative overflow-hidden">
      {/* Brilhos Arcanos */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Logo / Header Rúnico */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-xl shadow-amber-950/40 mb-2">
            <RuneCrestIcon className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-3xl font-fantasy font-bold tracking-tight text-amber-100">Éternum</h1>
          <p className="text-xs text-amber-300/80 font-fantasy uppercase tracking-wider">
            O Grimório da Campanha
          </p>
          <p className="text-xs text-[#a39b8d] max-w-xs mx-auto leading-relaxed">
            Gestão Dark Fantasy: Sessões, Fichas de Personagens, Forja de Loot, Missões e Oráculo
            Arcano.
          </p>
        </div>

        <Card className="border-amber-500/30 shadow-2xl bg-[#121620] text-[#f1ede3]">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg font-fantasy font-bold text-amber-200">
              {isSignUp ? 'Juramento do Aventureiro' : 'Portões da Campanha'}
            </CardTitle>
            <CardDescription className="text-xs text-[#8e8678]">
              {isSignUp
                ? 'Forje seu registro para liderar ou participar de mesas'
                : 'Pronuncie suas credenciais para adentrar o salão'}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert
                  variant="destructive"
                  className="py-2 text-xs bg-rose-950/40 border-rose-500/40 text-rose-300"
                >
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isSignUp && (
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-fantasy font-bold text-amber-200">
                    Nome do Herói / Mestre
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-amber-400/60" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Ex: Amanda Mestra da Campanha"
                      className="pl-9 text-sm bg-[#090c10] border-[#262e40] text-amber-100 placeholder:text-amber-200/40"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={isSignUp}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-fantasy font-bold text-amber-200">
                  E-mail do Aventureiro
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-amber-400/60" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="aventureiro@reino.com"
                    className="pl-9 text-sm bg-[#090c10] border-[#262e40] text-amber-100 placeholder:text-amber-200/40"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-fantasy font-bold text-amber-200">
                  Palavra Rúnica Secreta (Senha)
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-amber-400/60" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9 text-sm bg-[#090c10] border-[#262e40] text-amber-100 placeholder:text-amber-200/40"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-fantasy font-bold text-sm border border-amber-300/40 shadow-md"
                disabled={loading}
              >
                {loading
                  ? 'Decifrando selos...'
                  : isSignUp
                    ? 'Consagrar Juramento'
                    : 'Adentrar os Portões'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-0">
              <div className="relative w-full text-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-[#262e40]" />
                </div>
                <span className="relative bg-[#121620] px-2 text-[11px] text-amber-300/60 uppercase font-fantasy">
                  Invocação Imediata
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fillDemoAccount}
                className="w-full text-xs border-amber-500/30 text-amber-300 hover:text-amber-100 hover:bg-amber-500/10 font-fantasy"
              >
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-amber-400" />
                Preencher com Mestre de Demonstração
              </Button>

              <div className="text-center text-xs text-[#8e8678] pt-1">
                {isSignUp ? (
                  <>
                    Já possui um juramento?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(false)
                        setError(null)
                      }}
                      className="font-medium text-amber-300 hover:underline"
                    >
                      Adentrar mesa
                    </button>
                  </>
                ) : (
                  <>
                    Primeira vez nas crônicas?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSignUp(true)
                        setError(null)
                      }}
                      className="font-medium text-amber-300 hover:underline"
                    >
                      Criar juramento
                    </button>
                  </>
                )}
              </div>
            </CardFooter>
          </form>
        </Card>

        <div className="flex items-center justify-center gap-4 text-xs text-amber-300/60 font-fantasy">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Tomos Sincronizados
          </span>
          <span>•</span>
          <span>Fichas & Bestiários</span>
          <span>•</span>
          <span>Dark Fantasy</span>
        </div>
      </div>
    </div>
  )
}
