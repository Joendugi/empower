import { beforeEach, describe, expect, it } from 'vitest';
import { applyPathOverlay, overlayFor, useCampusCatalogue } from '@/store/campusCatalogue';
import { scanCodeFor } from '@/lib/qrV1';
import { buildScanPdf } from '@/lib/scanPdf';

describe('campus catalogue', () => {
  beforeEach(() => {
    localStorage.removeItem('empower-campus-catalogue');
    useCampusCatalogue.setState({
      overlays: {
        plumbing: overlayFor('plumbing') ?? {
          pathId: 'plumbing',
          educatorName: 'Sample trainer',
          school: 'Nairobi Technical Training Institute',
          relatedIds: ['electrical-installation'],
          pdfs: [],
          lessonBriefings: {},
          lessonTitles: {},
          updatedAt: new Date().toISOString(),
          updatedBy: 'test',
        },
      },
      reviews: [],
    });
  });

  it('overlays educator credit without replacing the shipped id', () => {
    useCampusCatalogue.getState().upsertOverlay(
      'plumbing',
      { educatorName: 'Amina Otieno', school: 'Kisumu National Poly' },
      'amina@poly.ac.ke'
    );
    const path = applyPathOverlay({
      id: 'plumbing',
      title: 'Plumbing',
      description: 'Traps and waste',
      nodes: [],
    });
    expect(path.id).toBe('plumbing');
    expect(overlayFor('plumbing')?.school).toBe('Kisumu National Poly');
  });

  it('stores one review per learner and averages stars', () => {
    const add = useCampusCatalogue.getState().addReview;
    add({
      pathId: 'plumbing',
      stars: 5,
      comment: 'Clear workshop notes',
      learnerName: 'Brian',
      learnerEmail: 'brian@learner.ke',
    });
    add({
      pathId: 'plumbing',
      stars: 3,
      comment: 'Updated after more practice',
      learnerName: 'Brian',
      learnerEmail: 'brian@learner.ke',
    });
    const reviews = useCampusCatalogue.getState().reviews.filter((item) => item.pathId === 'plumbing');
    expect(reviews).toHaveLength(1);
    expect(reviews[0]?.stars).toBe(3);
  });

  it('builds a searchable scan-card PDF with a scan code', () => {
    const pdf = buildScanPdf({
      title: 'Plumbing',
      school: 'NTTI',
      educatorName: 'Amina',
      url: 'http://127.0.0.1:5173/s/plumbing',
      pathId: 'plumbing',
    });
    expect(pdf.startsWith('%PDF-1.4')).toBe(true);
    expect(pdf.includes('Scan card')).toBe(true);
    expect(pdf.includes(scanCodeFor('plumbing'))).toBe(true);
    expect(pdf.includes('searchable')).toBe(true);
  });
});
