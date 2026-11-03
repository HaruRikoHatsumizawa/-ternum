import { useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { RuneScrollIcon } from '@/components/rpg/EternumIcons'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/i18n/LanguageContext'

const NotFound = () => {
  const location = useLocation()
  const { t } = useLanguage()

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0c0f14] text-[#f1ede3] relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-950/80 to-[#0c0f14] pointer-events-none" />

      <div className="text-center space-y-4 max-w-md relative z-10">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
          <RuneScrollIcon className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="text-2xl font-fantasy font-bold text-amber-100">{t('notFound.title')}</h1>
        <p className="text-xs text-[#a39b8d] leading-relaxed">{t('notFound.desc')}</p>
        <Link to="/">
          <Button
            variant="outline"
            className="mt-4 border-amber-500/30 text-amber-300 hover:text-amber-100 hover:bg-amber-500/10 font-fantasy text-xs"
          >
            {t('notFound.backHome')}
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
