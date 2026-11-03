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
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          Configurações da Conta
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Gerencie seu perfil de usuário, foto de exibição e credenciais de segurança.
        </p>
      </div>

      {/* Perfil */}
      <Card className="border-slate-200/80 shadow-sm bg-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-500" />
            <CardTitle className="text-base font-medium text-slate-900">Perfil Pessoal</CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500">
            Atualize seu nome de exibição e foto do avatar.
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
              <Avatar className="h-16 w-16 border border-slate-200 bg-slate-100">
                {avatarUrl ? <AvatarImage src={avatarUrl} alt={user?.name || 'Avatar'} /> : null}
                <AvatarFallback className="text-base font-medium bg-slate-800 text-white">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1.5 flex-1">
                <Label htmlFor="avatar-upload" className="text-xs font-medium text-slate-700">
                  Alterar foto de perfil
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="text-xs max-w-xs cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAvatarFile(e.target.files[0])
                      }
                    }}
                  />
                  {avatarFile && (
                    <span className="text-xs text-emerald-600 font-medium">Foto selecionada</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">Formatos aceitos: JPG, PNG até 5MB.</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-name" className="text-xs font-medium text-slate-700">
                Nome completo
              </Label>
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="max-w-md text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-700">E-mail</Label>
              <Input
                value={user?.email || ''}
                disabled
                className="max-w-md text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400">
                O endereço de e-mail é fixo para sua conta.
              </p>
            </div>
          </CardContent>

          <CardFooter className="border-t border-slate-100 pt-4 flex justify-end">
            <Button
              type="submit"
              size="sm"
              disabled={profileLoading}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs"
            >
              {profileLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Senha */}
      <Card className="border-slate-200/80 shadow-sm bg-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-slate-500" />
            <CardTitle className="text-base font-medium text-slate-900">
              Segurança & Senha
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500">
            Altere sua senha de acesso periodicamente para manter sua conta protegida.
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
              <Label htmlFor="old-pass" className="text-xs font-medium text-slate-700">
                Senha atual
              </Label>
              <Input
                id="old-pass"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="max-w-md text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="new-pass" className="text-xs font-medium text-slate-700">
                Nova senha (mínimo 8 caracteres)
              </Label>
              <Input
                id="new-pass"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="max-w-md text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm-pass" className="text-xs font-medium text-slate-700">
                Confirmar nova senha
              </Label>
              <Input
                id="confirm-pass"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="max-w-md text-sm"
                required
              />
            </div>
          </CardContent>

          <CardFooter className="border-t border-slate-100 pt-4 flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Criptografia padrão PocketBase
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={passwordLoading}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs"
            >
              {passwordLoading ? 'Alterando...' : 'Alterar Senha'}
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
          className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
        >
          Sair da Conta
        </Button>
      </div>
    </div>
  )
}
