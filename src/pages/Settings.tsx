import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useAppMode, AppMode } from '@/contexts/ModeContext'
import {
  RuneGearIcon,
  RuneSwordIcon,
  RuneScrollIcon,
  RuneCrestIcon,
} from '@/components/rpg/EternumIcons'
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
import {
  User,
  Lock,
  Upload,
  Check,
  AlertCircle,
  ShieldCheck,
  Palette,
  Sparkles,
  Swords,
  Scroll,
} from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { AvatarFrame, PFP_FRAMES } from '@/components/rpg/AvatarFrame'

export default function Settings() {
  const { user, updateProfile, updatePassword, logout } = useAuth()
  const { mode, setMode } = useAppMode()

  const [name, setName] = useState(user?.name || '')
  const [selectedFrame, setSelectedFrame] = useState<string>(user?.pfp_frame || 'runic-gold')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null)
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
        pfp_frame: selectedFrame,
        app_mode: mode,
      })
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    } catch (err: any) {
      setProfileError(err?.message || 'Falha ao atualizar perfil.')
    } finally {
      setProfileLoading(false)
    }
  }

  const handleModeToggle = async (newMode: AppMode) => {
    await setMode(newMode)
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
        <h1 className="text-2xl font-fantasy font-bold mode-accent-text tracking-tight flex items-center gap-2">
          <span>Santuário do Mestre & Aventureiro</span>
          <RuneGearIcon className="w-5 h-5 mode-accent-text shrink-0" />
        </h1>
        <p className="text-sm text-[#a39b8d] mt-1">
          Gerencie as molduras da foto de perfil, a paleta visual (RP Roxo / RPG Ouro), título de
          jogador e segurança.
        </p>
      </div>

      {/* Seletor Visual dos Dois Modos: RP Roxo vs RPG Laranja/Dourado */}
      <Card className="border-2 mode-accent-border shadow-xl bg-[#121620] text-[#f1ede3]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 mode-accent-text" />
            <CardTitle className="text-base font-fantasy font-bold mode-accent-text">
              Modo de Exibição do Reino: Geral, RPG Tático & RP Narrativo
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-[#8e8678]">
            Escolha como navegar pelo Éternum. O modo selecionado é salvo na sua conta e filtra
            automaticamente todo o site: sidebar, busca ⌘K, salas, oráculo e listagens.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Opção Geral */}
            <div
              onClick={() => handleModeToggle('geral')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                mode === 'geral'
                  ? 'border-amber-300/70 bg-amber-500/15 shadow-md shadow-amber-950'
                  : 'border-[#262c3a] bg-[#0d1017] hover:border-amber-400/40 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-fantasy font-bold text-amber-100">
                  <RuneCrestIcon className="w-4 h-4 text-amber-300" />
                  Modo Geral — Reino Completo
                </span>
                {mode === 'geral' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200/20 text-amber-200 font-mono font-bold">
                    ATIVO
                  </span>
                )}
              </div>
              <p className="text-xs text-[#b8b0a0]">
                Exibe todas as seções e conteúdos juntos (RPG e RP combinados). A barra lateral
                volta a ser completa e neutra.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="w-4 h-4 rounded-full bg-[#c99c36] border border-amber-200 shadow-xs" />
                <span className="w-4 h-4 rounded-full bg-[#121620] border border-[#2b3345]" />
                <span className="text-[11px] font-fantasy text-amber-200/80">
                  Obsidiana & Ouro Ancestral
                </span>
              </div>
            </div>

            {/* Opção RPG */}
            <div
              onClick={() => handleModeToggle('rpg')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                mode === 'rpg'
                  ? 'border-amber-400 bg-amber-500/15 shadow-md shadow-amber-950'
                  : 'border-[#262c3a] bg-[#0d1017] hover:border-amber-500/40 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-fantasy font-bold text-amber-300">
                  <RuneSwordIcon className="w-4 h-4 text-amber-400" />
                  Modo RPG — Ouro Forjado
                </span>
                {mode === 'rpg' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200 font-mono font-bold">
                    ATIVO
                  </span>
                )}
              </div>
              <p className="text-xs text-[#b8b0a0]">
                Apenas conteúdos de RPG e tática: missões, forja de loot, combates e códices
                bestiários.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="w-4 h-4 rounded-full bg-[#e7ab2c] border border-amber-300 shadow-xs" />
                <span className="w-4 h-4 rounded-full bg-[#171b26] border border-[#2b3345]" />
                <span className="text-[11px] font-fantasy text-amber-300/80">
                  Laranja & Ouro Rúnico
                </span>
              </div>
            </div>

            {/* Opção RP */}
            <div
              onClick={() => handleModeToggle('rp')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                mode === 'rp'
                  ? 'border-purple-400 bg-purple-500/15 shadow-md shadow-purple-950'
                  : 'border-[#262c3a] bg-[#0d1017] hover:border-purple-500/40 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-fantasy font-bold text-purple-300">
                  <RuneScrollIcon className="w-4 h-4 text-purple-400" />
                  Modo RP — Roxo Aristocrático
                </span>
                {mode === 'rp' && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-200 font-mono font-bold">
                    ATIVO
                  </span>
                )}
              </div>
              <p className="text-xs text-[#b8b0a0]">
                Apenas crônicas, cenas, tramas e relações entre personagens, com Salão de Narrativa
                e foco em interpretação.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="w-4 h-4 rounded-full bg-[#9d4edd] border border-purple-300 shadow-xs" />
                <span className="w-4 h-4 rounded-full bg-[#121620] border border-[#2b3345]" />
                <span className="text-[11px] font-fantasy text-purple-300/80">
                  Roxo Ametista Nobre
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Perfil & Molduras Decorativas Customizáveis */}
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

            {/* Foto de Perfil + Moldura Selecionada com Prévia */}
            <div className="p-4 rounded-xl border border-amber-500/20 bg-[#0c1017] flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="flex flex-col items-center gap-1.5">
                <AvatarFrame frameId={selectedFrame} size="xl" showBadge>
                  <Avatar className="h-full w-full rounded-full">
                    {avatarPreviewUrl ? (
                      <AvatarImage src={avatarPreviewUrl} alt="Nova Foto" />
                    ) : avatarUrl ? (
                      <AvatarImage src={avatarUrl} alt={user?.name || 'Avatar'} />
                    ) : null}
                    <AvatarFallback className="text-xl font-fantasy font-bold bg-amber-500/20 text-amber-300">
                      {user?.name ? user.name.slice(0, 2).toUpperCase() : 'GM'}
                    </AvatarFallback>
                  </Avatar>
                </AvatarFrame>
                <span className="text-[10px] text-amber-300/70 font-fantasy">
                  Prévia da Moldura
                </span>
              </div>

              <div className="space-y-2 flex-1">
                <Label
                  htmlFor="avatar-upload"
                  className="text-xs font-fantasy font-bold text-amber-200"
                >
                  Substituir Foto / Brasão de Perfil
                </Label>
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="text-xs max-w-xs cursor-pointer bg-[#090c10] border-[#262e40] text-amber-100"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0]
                        setAvatarFile(file)
                        setAvatarPreviewUrl(URL.createObjectURL(file))
                      }
                    }}
                  />
                  {avatarFile && (
                    <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Imagem carregada
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#7d7568]">
                  Selecione sua arte ou foto pessoal (JPG, PNG, GIF, WebP até 5MB).
                </p>
              </div>
            </div>

            {/* Galeria de Molduras Decorativas */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-fantasy font-bold text-amber-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Escolha sua Moldura Temática (PFP Frame)
                </Label>
                <span className="text-[11px] text-[#8e8678]">
                  A moldura adorna seu avatar na barra lateral, santuário e códices
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {PFP_FRAMES.map((frame) => {
                  const isSelected = selectedFrame === frame.id
                  return (
                    <div
                      key={frame.id}
                      onClick={() => setSelectedFrame(frame.id)}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/15 shadow-md shadow-amber-950'
                          : 'border-[#262c3a] bg-[#0c1017] hover:border-amber-500/40 hover:bg-[#121722]'
                      }`}
                    >
                      <AvatarFrame frameId={frame.id} size="md">
                        <Avatar className="h-full w-full rounded-full">
                          {avatarPreviewUrl ? (
                            <AvatarImage src={avatarPreviewUrl} />
                          ) : avatarUrl ? (
                            <AvatarImage src={avatarUrl} />
                          ) : null}
                          <AvatarFallback className="text-xs font-fantasy font-bold bg-amber-500/20 text-amber-300">
                            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'GM'}
                          </AvatarFallback>
                        </Avatar>
                      </AvatarFrame>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-fantasy font-bold text-amber-100 truncate">
                            {frame.name}
                          </h4>
                          {isSelected && (
                            <span className="text-[9px] font-bold text-amber-300 bg-amber-500/30 px-1 py-0.2 rounded shrink-0">
                              ✓
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#8e8678] line-clamp-1 mt-0.5">
                          {frame.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
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
