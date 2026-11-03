import { useState } from 'react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Lock, Upload, Check, AlertCircle, ShieldCheck } from 'lucide-react'
import pb from '@/lib/pocketbase/client'

export default function Settings() {
  const { user, updateProfile, updatePassword, logout } = useAuth()

  const [name, setName] = useState(user?.name || '')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const avatarUrl = user?.avatar
    ? pb.files.getUrl(user, user.avatar, { thumb: '128x128' })
    : undefined

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError(null)
    setProfileSuccess(false)
    setProfileLoading(true)

    try {
      await updateProfile({
        name: name.trim(),
        avatar: avatarFile,
      })
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    } catch (err: any) {
      setProfileError(err?.message || 'Falha ao atualizar perfil.')
    } finally {
      setProfileLoading(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError(null)
    setPasswordSuccess(false)

    if (newPassword.length < 8) {
      setPasswordError('A nova senha deve ter pelo menos 8 caracteres.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('As senhas não coincidem.')
      return
    }

    setPasswordLoading(true)
    try {
      await updatePassword(oldPassword, newPassword)
      setPasswordSuccess(true)
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (err: any) {
      setPasswordError(err?.message || 'Falha ao alterar senha. Verifique a senha atual.')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-8 text-[#f1ede3]">
      <div>
        <h1 className="text-2xl font-fantasy font-bold text-amber-100 tracking-tight flex items-center gap-2">
          <span>Santuário do Mestre & Aventureiro</span>
          <span className="text-lg">🛡️</span>
        </h1>
        <p className="text-sm text-[#a39b8d] mt-1">
          Gerencie o brasão de armas, título de jogador e selos de segurança da sua conta.
        </p>
      </div>

      {/* Perfil */}
      <Card className="border-amber-500/30 shadow-xl bg-[#121620] text-[#f1ede3]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-amber-400" />
            <CardTitle className="text-base font-fantasy font-bold text-amber-100">
              Identidade do Jogador / Mestre
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-[#8e8678]">
            Atualize seu nome de exibição e brasão do avatar.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleUpdateProfile}>
          <CardContent className="space-y-5">
            {profileSuccess && (
              <Alert className="py-2.5 bg-emerald-50 text-emerald-800 border-emerald-200 text-xs">
                <Check className="h-4 w-4 text-emerald-600 inline mr-2" />
                <AlertDescription className="inline">
                  Perfil atualizado com sucesso!
                </AlertDescription>
              </Alert>
            )}

            {profileError && (
              <Alert variant="destructive" className="py-2.5 text-xs">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                <AlertDescription className="inline">{profileError}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-amber-500/40 bg-[#090c10] shadow-md">
                {avatarUrl ? <AvatarImage src={avatarUrl} alt={user?.name || 'Avatar'} /> : null}
                <AvatarFallback className="text-base font-fantasy font-bold bg-amber-500/20 text-amber-300">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'GM'}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1.5 flex-1">
                <Label
                  htmlFor="avatar-upload"
                  className="text-xs font-fantasy font-bold text-amber-200"
                >
                  Alterar brasão / insígnia
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="text-xs max-w-xs cursor-pointer bg-[#090c10] border-[#262e40] text-amber-100"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAvatarFile(e.target.files[0])
                      }
                    }}
                  />
                  {avatarFile && (
                    <span className="text-xs text-amber-400 font-medium">Brasão selecionado</span>
                  )}
                </div>
                <p className="text-[11px] text-[#7d7568]">Formatos aceitos: JPG, PNG até 5MB.</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="profile-name"
                className="text-xs font-fantasy font-bold text-amber-200"
              >
                Nome completo ou Título
              </Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Amanda Mestra da Campanha"
                className="max-w-md text-sm bg-[#090c10] border-[#262e40] text-amber-100 placeholder:text-amber-200/40"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-fantasy font-bold text-amber-200">
                E-mail do Reino
              </Label>
              <Input
                value={user?.email || ''}
                disabled
                className="max-w-md text-sm bg-[#090c10]/60 border-[#262e40] text-[#7d7568] cursor-not-allowed"
              />
              <p className="text-[11px] text-[#7d7568]">
                O endereço de e-mail é sagrado e fixado na criação da conta.
              </p>
            </div>
          </CardContent>

          <CardFooter className="border-t border-[#262e40] pt-4 flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={profileLoading}
              className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-fantasy font-bold text-xs border border-amber-300/40"
            >
              {profileLoading ? 'Gravando...' : 'Salvar Alterações'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Senha */}
      <Card className="border-amber-500/30 shadow-xl bg-[#121620] text-[#f1ede3]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-amber-400" />
            <CardTitle className="text-base font-fantasy font-bold text-amber-100">
              Palavras Rúnicas & Segurança
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-[#8e8678]">
            Altere sua senha de proteção periodicamente para manter suas anotações e fichas seguras.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleUpdatePassword}>
          <CardContent className="space-y-4">
            {passwordSuccess && (
              <Alert className="py-2.5 bg-emerald-50 text-emerald-800 border-emerald-200 text-xs">
                <Check className="h-4 w-4 text-emerald-600 inline mr-2" />
                <AlertDescription className="inline">
                  Senha atualizada com sucesso!
                </AlertDescription>
              </Alert>
            )}

            {passwordError && (
              <Alert variant="destructive" className="py-2.5 text-xs">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                <AlertDescription className="inline">{passwordError}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="old-pass" className="text-xs font-fantasy font-bold text-amber-200">
                Senha atual
              </Label>
              <Input
                id="old-pass"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="max-w-md text-sm bg-[#090c10] border-[#262e40] text-amber-100 placeholder:text-amber-200/40"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="new-pass" className="text-xs font-fantasy font-bold text-amber-200">
                Nova senha (mínimo 8 caracteres)
              </Label>
              <Input
                id="new-pass"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="max-w-md text-sm bg-[#090c10] border-[#262e40] text-amber-100 placeholder:text-amber-200/40"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="confirm-pass"
                className="text-xs font-fantasy font-bold text-amber-200"
              >
                Confirmar nova senha
              </Label>
              <Input
                id="confirm-pass"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="max-w-md text-sm bg-[#090c10] border-[#262e40] text-amber-100 placeholder:text-amber-200/40"
                required
              />
            </div>
          </CardContent>

          <CardFooter className="border-t border-[#262e40] pt-4 flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-xs text-amber-300/70 font-fantasy">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Criptografia & Selos PocketBase
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={passwordLoading}
              className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-fantasy font-bold text-xs border border-amber-300/40"
            >
              {passwordLoading ? 'Alterando...' : 'Alterar Palavra-Chave'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Sair da conta */}
      <div className="flex justify-end pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border-rose-500/30 font-fantasy"
        >
          Abandonar Mesa (Sair da Conta)
        </Button>
      </div>
    </div>
  )
}
