import { beforeEach, describe, expect, it } from 'vitest';
import { useBookStore } from '@/store/bookStore';

describe('useBookStore', () => {
  beforeEach(() => {
    localStorage.removeItem('cyberlearn_readflix_library_v1');
    useBookStore.setState({
      savedBookIds: [],
      offlineBookIds: [],
      progress: {},
      activeBookId: null,
    });
  });

  it('loads core seeded books on initialization', () => {
    const state = useBookStore.getState();
    expect(state.books.length).toBeGreaterThanOrEqual(4);

    const water = state.getBook('book-water-engineering');
    expect(water).toBeDefined();
    expect(water?.title).toContain('Potable Water');
    expect(water?.chapters?.length).toBeGreaterThanOrEqual(3);
  });

  it('records reading progress with percentages', () => {
    const { saveProgress } = useBookStore.getState();
    saveProgress('book-solar-pv-systems', 28, 112);

    const progress = useBookStore.getState().progress['book-solar-pv-systems'];
    expect(progress).toBeDefined();
    expect(progress.currentPage).toBe(28);
    expect(progress.totalPages).toBe(112);
    expect(progress.percent).toBe(25);
    expect(progress.completed).toBe(false);
  });

  it('toggles saved shelf and offline status', () => {
    const { toggleSaved, toggleOffline } = useBookStore.getState();

    // Toggle save on and off
    toggleSaved('book-water-engineering');
    expect(useBookStore.getState().savedBookIds).toContain('book-water-engineering');
    toggleSaved('book-water-engineering');
    expect(useBookStore.getState().savedBookIds).not.toContain('book-water-engineering');

    // Toggle offline on and off
    toggleOffline('book-trauma-first-aid');
    expect(useBookStore.getState().offlineBookIds).toContain('book-trauma-first-aid');
  });

  it('creates a local book record when uploading', async () => {
    const dummyFile = new File(['# Rainwater Tank Construction'], 'rainwater.md', {
      type: 'text/markdown',
    });

    const book = await useBookStore.getState().uploadBook({
      file: dummyFile,
      title: 'Rainwater Tank Manual',
      author: 'Eldoret TVET',
      category: 'resilience',
      tradeTitle: 'Plumbing',
    });

    expect(book).toBeDefined();
    expect(book.title).toBe('Rainwater Tank Manual');
    expect(book.author).toBe('Eldoret TVET');
    expect(useBookStore.getState().books[0].title).toBe('Rainwater Tank Manual');
  });
});
