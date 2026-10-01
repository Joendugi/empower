import { Navigate, useParams } from 'react-router-dom';
import { getSkillPaths } from '@/content';
import { scanCodeFor } from '@/lib/qrV1';

export default function ScanPage() {
  const { code } = useParams<{ code: string }>();
  const needle = (code ?? '').toUpperCase().replace(/^E\//, '');
  const path = getSkillPaths().find(
    (item) => item.id === code || scanCodeFor(item.id).replace('E/', '') === needle
  );
  if (!path) return <Navigate to="/learn/skill-tree" replace />;
  return <Navigate to={`/learn/course/${path.id}`} replace />;
}
