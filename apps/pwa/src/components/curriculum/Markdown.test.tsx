import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { Exercise } from '@cyberlearn/types';
import Markdown, { parseMarkdown } from '@/components/curriculum/Markdown';
import FillBlank from '@/components/exercises/FillBlank';

vi.mock('@/i18n', () => ({ useT: () => (key: string) => key }));
afterEach(cleanup);

const NOTES = `## The forge

A forge heats steel to **850°C to 1,200°C**.

\`\`\`
[ Fire pot ]
     │
\`\`\`

- **Firepot**: brake drum
- **Tuyere**: 50 mm pipe

| Colour | Use |
|---|---|
| Cherry red | Bending |

> Never quench in oil near an open flame.

<script>alert(1)</script>`;

describe('Markdown', () => {
  it('parses the block types used in lesson notes', () => {
    expect(parseMarkdown(NOTES).map((block) => block.kind)).toEqual([
      'heading',
      'paragraph',
      'code',
      'list',
      'table',
      'quote',
      'paragraph',
    ]);
  });

  it('renders tables, emphasis and code, and shows raw HTML as text', () => {
    const { container } = render(<Markdown source={NOTES} />);
    expect(container.querySelector('table td')?.textContent).toBe('Cherry red');
    expect(container.querySelector('strong')?.textContent).toBe('850°C to 1,200°C');
    expect(container.querySelector('pre')?.textContent).toContain('[ Fire pot ]');
    expect(container.querySelector('script')).toBeNull();
    expect(screen.getByText('<script>alert(1)</script>')).toBeTruthy();
  });
});

describe('FillBlank', () => {
  const exercise: Exercise = {
    id: 'q1',
    type: 'FILL_BLANK',
    prompt: 'Splint the joint ___ and the joint ___ the fracture.',
    xpReward: 20,
  } as Exercise;

  it('renders one input per blank and submits a list', async () => {
    const onAnswer = vi.fn().mockResolvedValue({ isCorrect: true, xpAwarded: 20 });
    render(<FillBlank exercise={exercise} onAnswer={onAnswer} />);
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(2);
    expect(screen.getByText(/the fracture\./)).toBeTruthy();
    fireEvent.change(inputs[0], { target: { value: ' above ' } });
    fireEvent.change(inputs[1], { target: { value: 'below' } });
    fireEvent.click(screen.getByRole('button', { name: 'checkAnswer' }));
    await vi.waitFor(() => expect(onAnswer).toHaveBeenCalledWith(['above', 'below']));
  });

  it('submits a single string for one blank', async () => {
    const onAnswer = vi.fn().mockResolvedValue({ isCorrect: false, xpAwarded: 0 });
    render(<FillBlank exercise={{ ...exercise, prompt: 'Cut the pipe ___.' }} onAnswer={onAnswer} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'square' } });
    fireEvent.click(screen.getByRole('button', { name: 'checkAnswer' }));
    await vi.waitFor(() => expect(onAnswer).toHaveBeenCalledWith('square'));
  });
});

describe('bundled lesson notes', () => {
  it('parse cleanly with well-formed tables', async () => {
    const notes = (await import('@/content/generated/lessonNotes.json')).default as Record<string, string>;
    const bad: string[] = [];
    for (const [id, source] of Object.entries(notes)) {
      const blocks = parseMarkdown(source);
      if (!blocks.length) bad.push(`${id}: empty`);
      for (const block of blocks) {
        if (block.kind === 'table' && block.rows.some((row) => row.length !== block.header.length)) {
          bad.push(`${id}: ragged table "${block.header.join(' | ')}"`);
        }
      }
    }
    expect(bad).toEqual([]);
    expect(Object.keys(notes).length).toBeGreaterThanOrEqual(96);
  });
});
