import { Fragment, type ReactNode } from 'react';

/**
 * Minimal Markdown → React renderer for lesson notes.
 * Supports headings, paragraphs, **bold**, *italic*, `code`, lists, tables, fenced code and quotes.
 * Output is React elements only (no innerHTML), so lesson text can never inject markup.
 */

type Block =
  | { kind: 'heading'; level: number; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'code'; text: string }
  | { kind: 'quote'; text: string }
  | { kind: 'list'; ordered: boolean; items: string[] }
  | { kind: 'table'; header: string[]; rows: string[][] };

const LIST_ITEM = /^\s*(?:[-*+]|\d+[.)])\s+/;
const ORDERED_ITEM = /^\s*\d+[.)]\s+/;

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

function isTableSeparator(line: string) {
  return /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(line);
}

export function parseMarkdown(source: string): Block[] {
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }
    if (line.trim().startsWith('```')) {
      const body: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) body.push(lines[i++]);
      i += 1; // closing fence
      blocks.push({ kind: 'code', text: body.join('\n') });
      continue;
    }
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      blocks.push({ kind: 'heading', level: heading[1].length, text: heading[2].trim() });
      i += 1;
      continue;
    }
    if (line.includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const header = splitRow(line);
      const rows: string[][] = [];
      i += 2;
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) rows.push(splitRow(lines[i++]));
      blocks.push({ kind: 'table', header, rows });
      continue;
    }
    if (/^\s*>/.test(line)) {
      const body: string[] = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) body.push(lines[i++].replace(/^\s*>\s?/, ''));
      blocks.push({ kind: 'quote', text: body.join(' ') });
      continue;
    }
    if (LIST_ITEM.test(line)) {
      const ordered = ORDERED_ITEM.test(line);
      const items: string[] = [];
      while (i < lines.length && lines[i].trim()) {
        if (LIST_ITEM.test(lines[i])) items.push(lines[i].replace(LIST_ITEM, ''));
        else if (items.length) items[items.length - 1] += ` ${lines[i].trim()}`; // wrapped item text
        i += 1;
      }
      blocks.push({ kind: 'list', ordered, items });
      continue;
    }
    const body: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,6})\s/.test(lines[i]) &&
      !lines[i].trim().startsWith('```') &&
      !LIST_ITEM.test(lines[i]) &&
      !/^\s*>/.test(lines[i])
    ) {
      body.push(lines[i++].trim());
    }
    blocks.push({ kind: 'paragraph', text: body.join(' ') });
  }
  return blocks;
}

const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*\s][^*]*\*|_[^_\s][^_]*_)/g;

export function renderInline(text: string): ReactNode[] {
  return text.split(INLINE).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={index} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code key={index} className="px-1 py-0.5 rounded bg-surface-light font-mono text-[13px]">
          {part.slice(1, -1)}
        </code>
      );
    }
    if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
      if (part.length > 2) return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

export default function Markdown({ source }: { source: string }) {
  const blocks = parseMarkdown(source);
  return (
    <div className="space-y-3 text-[15px] leading-relaxed text-white/90">
      {blocks.map((block, index) => {
        switch (block.kind) {
          case 'heading': {
            const cls =
              block.level <= 2 ? 'text-lg font-bold text-white pt-2' : 'text-base font-semibold text-white pt-1';
            return block.level <= 2 ? (
              <h3 key={index} className={cls}>{renderInline(block.text)}</h3>
            ) : (
              <h4 key={index} className={cls}>{renderInline(block.text)}</h4>
            );
          }
          case 'code':
            return (
              <div key={index} className="overflow-x-auto rounded-xl bg-black/50 border border-surface-light">
                <pre className="p-3 font-mono text-xs leading-snug text-green-300 whitespace-pre">{block.text}</pre>
              </div>
            );
          case 'quote':
            return (
              <blockquote key={index} className="border-l-4 border-accent/60 pl-3 italic text-white/80">
                {renderInline(block.text)}
              </blockquote>
            );
          case 'list': {
            const items = block.items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>);
            return block.ordered ? (
              <ol key={index} className="list-decimal pl-5 space-y-1">{items}</ol>
            ) : (
              <ul key={index} className="list-disc pl-5 space-y-1">{items}</ul>
            );
          }
          case 'table':
            return (
              <div key={index} className="overflow-x-auto rounded-xl border border-surface-light">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-surface-light/60">
                    <tr>
                      {block.header.map((cell, cellIndex) => (
                        <th key={cellIndex} className="text-left font-semibold text-white px-3 py-2 align-top">
                          {renderInline(cell)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-t border-surface-light/60">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-3 py-2 align-top">{renderInline(cell)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return <p key={index}>{renderInline(block.text)}</p>;
        }
      })}
    </div>
  );
}
