export type NoticeChannel = 'email' | 'sms';

export function normalizePhone(phone: string) {
  const trimmed = phone.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('+')) return `+${trimmed.slice(1).replace(/\D/g, '')}`;
  const digits = trimmed.replace(/\D/g, '');
  if (digits.startsWith('0') && digits.length === 10) return `+254${digits.slice(1)}`;
  if (digits.startsWith('254')) return `+${digits}`;
  return digits ? `+${digits}` : '';
}

export function mailtoHref(to: string[] | string, subject: string, body: string) {
  const list = (Array.isArray(to) ? to : [to]).filter(Boolean).join(',');
  return `mailto:${list}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function smsHref(phone: string | string[], body: string) {
  const list = (Array.isArray(phone) ? phone : [phone]).map(normalizePhone).filter(Boolean).join(',');
  return `sms:${list}?body=${encodeURIComponent(body)}`;
}

export function openFreeMessage(channel: NoticeChannel, to: string[], subject: string, body: string) {
  if (typeof window === 'undefined') return;
  const targets = to.filter(Boolean);
  const href =
    channel === 'email'
      ? mailtoHref(targets, subject, body)
      : targets.length
        ? smsHref(targets, `${subject}\n\n${body}`)
        : '';
  if (!href) return;
  try {
    const link = document.createElement('a');
    link.href = href;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch {
    /* jsdom / blocked pop-up */
  }
}

export function reminderText(input: { title: string; body: string; campus?: string; due?: string }) {
  const lines = [
    input.title,
    input.campus ? `Campus: ${input.campus}` : '',
    input.due ? `When: ${input.due}` : '',
    '',
    input.body,
    '',
    'Sent from Empower.',
  ].filter((line, index, all) => line !== '' || all[index - 1] !== '');
  return lines.join('\n');
}
