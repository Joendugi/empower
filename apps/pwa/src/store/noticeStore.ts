import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { findLocalAccount } from '@/lib/localAccounts';
import { openFreeMessage, reminderText, type NoticeChannel } from '@/lib/notify';

export interface CampusNotice {
  id: string;
  classId?: string;
  title: string;
  body: string;
  channel: NoticeChannel | 'inbox';
  audienceEmails: string[];
  createdBy: string;
  createdAt: string;
  due?: string;
}

interface NoticeState {
  notices: CampusNotice[];
  postNotice: (
    input: Omit<CampusNotice, 'id' | 'createdAt'> & {
      phones?: string[];
      campus?: string;
      skipDispatch?: boolean;
    }
  ) => CampusNotice;
}

export const useNoticeStore = create<NoticeState>()(
  persist(
    (set) => ({
      notices: [
        {
          id: 'notice-sample-cat',
          classId: 'class-plb-morning',
          title: 'CAT 1 reminder — traps and waste',
          body: 'Bring PPE and a side-view photo plan. Sit CAT 1 on Campus before 30 Sep.',
          channel: 'inbox',
          audienceEmails: ['amina.otieno@learner.ke', 'brian.mwangi@learner.ke', 'faith.wanjiku@learner.ke'],
          createdBy: 'Sample trainer',
          createdAt: '2026-09-20T08:00:00.000Z',
          due: '2026-09-30',
        },
      ],
      postNotice: (input) => {
        const next: CampusNotice = {
          id: `notice-${Date.now().toString(36)}`,
          classId: input.classId,
          title: input.title.trim(),
          body: input.body.trim(),
          channel: input.channel,
          audienceEmails: input.audienceEmails,
          createdBy: input.createdBy,
          createdAt: new Date().toISOString(),
          due: input.due,
        };
        set((state) => ({ notices: [next, ...state.notices] }));
        if (!input.skipDispatch && (input.channel === 'email' || input.channel === 'sms')) {
          const text = reminderText({
            title: next.title,
            body: next.body,
            campus: input.campus,
            due: next.due,
          });
          const to =
            input.channel === 'email'
              ? next.audienceEmails
              : (input.phones ?? []).filter(Boolean);
          if (to.length) openFreeMessage(input.channel, to, next.title, text);
        }
        return next;
      },
    }),
    { name: 'empower-notices' }
  )
);

export function noticesFor(email: string, classIds: string[] = []) {
  const needle = email.trim().toLowerCase();
  return useNoticeStore
    .getState()
    .notices.filter(
      (item) =>
        item.audienceEmails.some((entry) => entry.toLowerCase() === needle) ||
        (item.classId && classIds.includes(item.classId))
    );
}

export function phoneForEmail(email: string) {
  return findLocalAccount(email)?.phone ?? '';
}
