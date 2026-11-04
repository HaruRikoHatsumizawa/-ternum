import React, { useState } from 'react'

/**
 * Renderizador de formatação estilo Discord (Markdown do Discord) para o Éternum.
 *
 * Suporta:
 * - `-# texto` (subtexto com fonte reduzida e cor atenuada)
 * - `# `, `## `, `### ` (títulos H1, H2, H3)
 * - `**negrito**`, `*itálico*`, `_itálico_`, `__sublinhado__`, `~~riscado~~`
 * - `***negrito itálico***`, `__***combinações***__`
 * - `` `código inline` ``
 * - ` ```lang\nbloco de código\n``` `
 * - `> citação` e `>>> citação multilinha`
 * - `||spoiler||` (sigilo arcano: borrado que revela ao clicar)
 * - `- item` e `* item` (listas)
 * - `1. item` (listas numeradas)
 * - `[texto](url)` (links seguros)
 * - Escape com barra invertida `\*`
 */

export interface DiscordMarkdownProps {
  content: string
  className?: string
}

export function DiscordSpoiler({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation()
        setRevealed((prev) => !prev)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          e.stopPropagation()
          setRevealed((prev) => !prev)
        }
      }}
      title={revealed ? 'Sigilo Arcano revelado' : 'Sigilo Arcano (clique para revelar)'}
      className={`inline-block px-1.5 py-0.2 rounded transition-all cursor-pointer font-serif select-none ${
        revealed
          ? 'bg-[#1b2230] text-amber-100 border border-amber-500/30'
          : 'bg-[#1a1f2c] text-transparent border border-dashed border-amber-500/40 blur-[4px] hover:blur-[2px]'
      }`}
    >
      <span className={revealed ? 'opacity-100' : 'opacity-0'}>{children}</span>
    </span>
  )
}

type InlineToken =
  | { type: 'text'; text: string }
  | { type: 'bold'; children: InlineToken[] }
  | { type: 'italic'; children: InlineToken[] }
  | { type: 'underline'; children: InlineToken[] }
  | { type: 'strikethrough'; children: InlineToken[] }
  | { type: 'bold_italic'; children: InlineToken[] }
  | { type: 'code'; code: string }
  | { type: 'spoiler'; children: InlineToken[] }
  | { type: 'link'; text: string; href: string }

function sanitizeHref(raw: string): string | null {
  const trimmed = raw.trim()
  if (/^(https?:|mailto:|\/|#)/i.test(trimmed)) {
    return trimmed
  }
  return null
}

export function parseInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = []
  let cursor = 0
  const len = text.length

  while (cursor < len) {
    if (text[cursor] === '\\' && cursor + 1 < len) {
      tokens.push({ type: 'text', text: text[cursor + 1] })
      cursor += 2
      continue
    }

    if (text.startsWith('||', cursor)) {
      const end = text.indexOf('||', cursor + 2)
      if (end !== -1) {
        const inner = text.substring(cursor + 2, end)
        tokens.push({ type: 'spoiler', children: parseInline(inner) })
        cursor = end + 2
        continue
      }
    }

    if (text[cursor] === '`') {
      const end = text.indexOf('`', cursor + 1)
      if (end !== -1) {
        tokens.push({ type: 'code', code: text.substring(cursor + 1, end) })
        cursor = end + 1
        continue
      }
    }

    if (text[cursor] === '[') {
      const closeBracket = text.indexOf(']', cursor + 1)
      if (closeBracket !== -1 && text[closeBracket + 1] === '(') {
        const closeParen = text.indexOf(')', closeBracket + 2)
        if (closeParen !== -1) {
          const linkText = text.substring(cursor + 1, closeBracket)
          const safeHref = sanitizeHref(text.substring(closeBracket + 2, closeParen))
          if (safeHref) {
            tokens.push({ type: 'link', text: linkText, href: safeHref })
            cursor = closeParen + 1
            continue
          }
        }
      }
    }

    if (text.startsWith('__***', cursor)) {
      const end = text.indexOf('***__', cursor + 5)
      if (end !== -1) {
        tokens.push({
          type: 'underline',
          children: [
            { type: 'bold_italic', children: parseInline(text.substring(cursor + 5, end)) },
          ],
        })
        cursor = end + 5
        continue
      }
    }

    if (text.startsWith('__**', cursor)) {
      const end = text.indexOf('**__', cursor + 4)
      if (end !== -1) {
        tokens.push({
          type: 'underline',
          children: [{ type: 'bold', children: parseInline(text.substring(cursor + 4, end)) }],
        })
        cursor = end + 4
        continue
      }
    }

    if (text.startsWith('***', cursor)) {
      const end = text.indexOf('***', cursor + 3)
      if (end !== -1) {
        tokens.push({ type: 'bold_italic', children: parseInline(text.substring(cursor + 3, end)) })
        cursor = end + 3
        continue
      }
    }

    if (text.startsWith('**', cursor)) {
      const end = text.indexOf('**', cursor + 2)
      if (end !== -1) {
        tokens.push({ type: 'bold', children: parseInline(text.substring(cursor + 2, end)) })
        cursor = end + 2
        continue
      }
    }

    if (text.startsWith('__', cursor)) {
      const end = text.indexOf('__', cursor + 2)
      if (end !== -1) {
        tokens.push({ type: 'underline', children: parseInline(text.substring(cursor + 2, end)) })
        cursor = end + 2
        continue
      }
    }

    if (text.startsWith('~~', cursor)) {
      const end = text.indexOf('~~', cursor + 2)
      if (end !== -1) {
        tokens.push({
          type: 'strikethrough',
          children: parseInline(text.substring(cursor + 2, end)),
        })
        cursor = end + 2
        continue
      }
    }

    if (text[cursor] === '*' && (cursor === 0 || text[cursor - 1] !== '\\')) {
      const end = text.indexOf('*', cursor + 1)
      if (end !== -1) {
        tokens.push({ type: 'italic', children: parseInline(text.substring(cursor + 1, end)) })
        cursor = end + 1
        continue
      }
    }

    if (text[cursor] === '_' && (cursor === 0 || text[cursor - 1] !== '\\')) {
      const end = text.indexOf('_', cursor + 1)
      if (end !== -1) {
        tokens.push({ type: 'italic', children: parseInline(text.substring(cursor + 1, end)) })
        cursor = end + 1
        continue
      }
    }

    let nextSpecial = len
    const specials = ['\\', '|', '`', '[', '*', '_', '~']
    for (const s of specials) {
      const idx = text.indexOf(s, cursor)
      if (idx !== -1 && idx < nextSpecial) {
        nextSpecial = idx
      }
    }

    const plain = text.substring(cursor, nextSpecial === cursor ? cursor + 1 : nextSpecial)
    tokens.push({ type: 'text', text: plain })
    cursor = nextSpecial === cursor ? cursor + 1 : nextSpecial
  }

  const merged: InlineToken[] = []
  for (const t of tokens) {
    const last = merged[merged.length - 1]
    if (t.type === 'text' && last && last.type === 'text') {
      last.text += t.text
    } else {
      merged.push(t)
    }
  }

  return merged
}

export function renderInlineTokens(tokens: InlineToken[], keyPrefix = 'in'): React.ReactNode[] {
  return tokens.map((token, index) => {
    const key = `${keyPrefix}_${index}`
    switch (token.type) {
      case 'text':
        return <React.Fragment key={key}>{token.text}</React.Fragment>
      case 'bold':
        return (
          <strong key={key} className="font-bold text-amber-200">
            {renderInlineTokens(token.children, key)}
          </strong>
        )
      case 'italic':
        return (
          <em key={key} className="italic text-amber-100/90 font-serif">
            {renderInlineTokens(token.children, key)}
          </em>
        )
      case 'bold_italic':
        return (
          <strong key={key} className="font-bold italic text-amber-200 font-serif">
            {renderInlineTokens(token.children, key)}
          </strong>
        )
      case 'underline':
        return (
          <span key={key} className="underline underline-offset-2 decoration-amber-500/50">
            {renderInlineTokens(token.children, key)}
          </span>
        )
      case 'strikethrough':
        return (
          <span key={key} className="line-through decoration-rose-500/60 opacity-60">
            {renderInlineTokens(token.children, key)}
          </span>
        )
      case 'code':
        return (
          <code
            key={key}
            className="px-1.5 py-0.5 rounded bg-[#0b0e14] border border-[#263145] text-amber-300 font-mono text-[0.88em]"
          >
            {token.code}
          </code>
        )
      case 'spoiler':
        return <DiscordSpoiler key={key}>{renderInlineTokens(token.children, key)}</DiscordSpoiler>
      case 'link':
        return (
          <a
            key={key}
            href={token.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
          >
            {token.text}
          </a>
        )
      default:
        return null
    }
  })
}

export function DiscordInline({
  content,
  className = '',
}: {
  content: string
  className?: string
}) {
  if (!content) return null
  return <span className={className}>{renderInlineTokens(parseInline(content), 'inl')}</span>
}
