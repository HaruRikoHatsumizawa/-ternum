import React from 'react'
import {
  parseInline,
  renderInlineTokens,
  DiscordSpoiler,
  DiscordInline,
} from './discordMarkdownInline'

export { DiscordSpoiler, DiscordInline }

export interface DiscordMarkdownProps {
  content: string
  className?: string
}

type BlockToken =
  | { type: 'subtext'; raw: string }
  | { type: 'h1'; raw: string }
  | { type: 'h2'; raw: string }
  | { type: 'h3'; raw: string }
  | { type: 'codeblock'; language: string; code: string }
  | { type: 'blockquote'; lines: string[] }
  | { type: 'bullet_list'; items: string[] }
  | { type: 'ordered_list'; items: { num: number; text: string }[] }
  | { type: 'paragraph'; lines: string[] }

export function parseDiscordMarkdown(content: string): BlockToken[] {
  if (!content) return []
  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const blocks: BlockToken[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // 1. Bloco de código com crases triplas
    if (line.trimStart().startsWith('```')) {
      const fenceMatch = line.trimStart().match(/^```([a-zA-Z0-9_-]*)/)
      const language = fenceMatch ? fenceMatch[1] : ''
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      if (i < lines.length) {
        i++
      }
      blocks.push({
        type: 'codeblock',
        language,
        code: codeLines.join('\n'),
      })
      continue
    }

    // 2. Citação multilinha com >>>
    if (line.trimStart().startsWith('>>>')) {
      const quoteLines: string[] = []
      const firstLineContent = line.replace(/^\s*>>>\s?/, '')
      if (firstLineContent) quoteLines.push(firstLineContent)
      i++
      while (i < lines.length) {
        quoteLines.push(lines[i])
        i++
      }
      blocks.push({ type: 'blockquote', lines: quoteLines })
      continue
    }

    // 3. Citação simples com >
    if (line.trimStart().startsWith('>')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].trimStart().startsWith('>')) {
        quoteLines.push(lines[i].replace(/^\s*>\s?/, ''))
        i++
      }
      blocks.push({ type: 'blockquote', lines: quoteLines })
      continue
    }

    // 4. Subtexto do Discord: -# texto (o caso prioritário do usuário)
    if (/^\s*-#\s+/.test(line)) {
      const raw = line.replace(/^\s*-#\s+/, '')
      blocks.push({ type: 'subtext', raw })
      i++
      continue
    }

    // 5. Títulos H1, H2, H3
    if (/^\s*#\s+/.test(line)) {
      const raw = line.replace(/^\s*#\s+/, '')
      blocks.push({ type: 'h1', raw })
      i++
      continue
    }

    if (/^\s*##\s+/.test(line)) {
      const raw = line.replace(/^\s*##\s+/, '')
      blocks.push({ type: 'h2', raw })
      i++
      continue
    }

    if (/^\s*###\s+/.test(line)) {
      const raw = line.replace(/^\s*###\s+/, '')
      blocks.push({ type: 'h3', raw })
      i++
      continue
    }

    // 6. Lista com marcadores (- item ou * item)
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''))
        i++
      }
      blocks.push({ type: 'bullet_list', items })
      continue
    }

    // 7. Lista numerada (1. item, 2. item...)
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: { num: number; text: string }[] = []
      while (i < lines.length && /^\s*(\d+)\.\s+/.test(lines[i])) {
        const match = lines[i].match(/^\s*(\d+)\.\s+(.*)$/)
        if (match) {
          items.push({ num: parseInt(match[1], 10), text: match[2] })
        }
        i++
      }
      blocks.push({ type: 'ordered_list', items })
      continue
    }

    // 8. Linha vazia
    if (line.trim() === '') {
      i++
      continue
    }

    // 9. Parágrafo comum acumulando linhas
    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].trimStart().startsWith('```') &&
      !lines[i].trimStart().startsWith('>') &&
      !/^\s*-#\s+/.test(lines[i]) &&
      !/^\s*#{1,3}\s+/.test(lines[i]) &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i])
    ) {
      paraLines.push(lines[i])
      i++
    }

    if (paraLines.length > 0) {
      blocks.push({ type: 'paragraph', lines: paraLines })
    }
  }

  return blocks
}

export function DiscordMarkdown({ content, className = '' }: DiscordMarkdownProps) {
  if (!content) return null

  const blocks = parseDiscordMarkdown(content)

  return (
    <div className={`space-y-2 text-xs sm:text-sm leading-relaxed ${className}`}>
      {blocks.map((block, idx) => {
        const key = `blk_${idx}`

        switch (block.type) {
          case 'subtext': {
            const tokens = parseInline(block.raw)
            return (
              <div
                key={key}
                className="text-[11px] sm:text-xs text-[#8c8476] tracking-tight py-0.5 leading-snug font-sans opacity-85"
              >
                {renderInlineTokens(tokens, key)}
              </div>
            )
          }

          case 'h1': {
            const tokens = parseInline(block.raw)
            return (
              <h1
                key={key}
                className="text-lg sm:text-xl font-fantasy font-black tracking-wide text-amber-100 border-b border-amber-500/25 pb-1 mt-3 first:mt-0"
              >
                {renderInlineTokens(tokens, key)}
              </h1>
            )
          }

          case 'h2': {
            const tokens = parseInline(block.raw)
            return (
              <h2
                key={key}
                className="text-base sm:text-lg font-fantasy font-bold tracking-wide text-amber-200 mt-2 first:mt-0"
              >
                {renderInlineTokens(tokens, key)}
              </h2>
            )
          }

          case 'h3': {
            const tokens = parseInline(block.raw)
            return (
              <h3
                key={key}
                className="text-sm sm:text-base font-fantasy font-semibold text-amber-300/90 mt-1.5 first:mt-0"
              >
                {renderInlineTokens(tokens, key)}
              </h3>
            )
          }

          case 'blockquote': {
            return (
              <blockquote
                key={key}
                className="border-l-2 border-amber-500/70 pl-3 py-1 my-1 italic bg-amber-500/5 text-amber-100/90 rounded-r font-serif"
              >
                {block.lines.map((l, lIdx) => (
                  <div key={`${key}_l_${lIdx}`} className="min-h-[1.2em]">
                    {renderInlineTokens(parseInline(l), `${key}_l_${lIdx}`)}
                  </div>
                ))}
              </blockquote>
            )
          }

          case 'codeblock': {
            return (
              <div
                key={key}
                className="my-2 rounded-xl bg-[#0a0d13] border border-[#242d3e] overflow-hidden text-xs shadow-inner"
              >
                {block.language && (
                  <div className="px-3 py-1 bg-[#121622] border-b border-[#20293a] text-[10px] font-mono text-amber-400/80 uppercase tracking-wider flex items-center justify-between">
                    <span>{block.language}</span>
                    <span className="text-[9px] text-[#6d6658]">Grimório</span>
                  </div>
                )}
                <pre className="p-3 overflow-x-auto font-mono text-[12px] leading-relaxed text-amber-100/90 selection:bg-amber-500/30">
                  <code>{block.code}</code>
                </pre>
              </div>
            )
          }

          case 'bullet_list': {
            return (
              <ul key={key} className="space-y-1 my-1 pl-1">
                {block.items.map((itemText, iIdx) => {
                  const itemTokens = parseInline(itemText)
                  return (
                    <li key={`${key}_li_${iIdx}`} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        {renderInlineTokens(itemTokens, `${key}_li_${iIdx}`)}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )
          }

          case 'ordered_list': {
            return (
              <ol key={key} className="space-y-1 my-1 pl-1">
                {block.items.map((item, iIdx) => {
                  const itemTokens = parseInline(item.text)
                  return (
                    <li key={`${key}_ol_${iIdx}`} className="flex items-start gap-2">
                      <span className="text-amber-400/80 font-mono text-xs mt-0.5 shrink-0 min-w-[1.2rem]">
                        {item.num}.
                      </span>
                      <div className="flex-1 min-w-0">
                        {renderInlineTokens(itemTokens, `${key}_ol_${iIdx}`)}
                      </div>
                    </li>
                  )
                })}
              </ol>
            )
          }

          case 'paragraph': {
            return (
              <div key={key} className="space-y-0.5">
                {block.lines.map((line, lIdx) => (
                  <div key={`${key}_p_${lIdx}`}>
                    {renderInlineTokens(parseInline(line), `${key}_p_${lIdx}`)}
                  </div>
                ))}
              </div>
            )
          }

          default:
            return null
        }
      })}
    </div>
  )
}
