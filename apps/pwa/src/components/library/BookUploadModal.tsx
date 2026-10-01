import { FormEvent, useState, useRef } from 'react';
import { UploadCloud, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useBookStore } from '@/store/bookStore';
import type { Book } from '@cyberlearn/types';

interface BookUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newBook: Book) => void;
}

export default function BookUploadModal({
  isOpen,
  onClose,
  onSuccess,
}: BookUploadModalProps) {
  const uploadBook = useBookStore((s) => s.uploadBook);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<Book['category']>('resilience');
  const [tradeTitle, setTradeTitle] = useState('General TVET');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!title) {
        // Auto-populate title from clean filename
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a PDF, EPUB, or Markdown file to upload.');
      return;
    }
    if (!title.trim() || !author.trim()) {
      setError('Title and Author fields are required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const created = await uploadBook({
        file: selectedFile,
        title: title.trim(),
        author: author.trim(),
        category,
        tradeTitle: tradeTitle.trim() || 'General TVET',
        description: description.trim(),
      });
      setIsSubmitting(false);
      onSuccess(created);
      onClose();
    } catch {
      setIsSubmitting(false);
      setError('Failed to upload document. Please verify your connection.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-surface border border-white/10 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full hover:bg-white/10 text-muted hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-accent/15 border border-accent/30 text-accent">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Upload to Community Library</h3>
            <p className="text-xs text-muted">Contribute manuals, field guides, or notes (PDF, EPUB, Markdown)</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-danger/15 border border-danger/30 text-danger-light text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Picker Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
              selectedFile
                ? 'border-accent bg-accent/5'
                : 'border-white/15 hover:border-accent/40 bg-surface-dark/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.epub,.md,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            {selectedFile ? (
              <div className="flex flex-col items-center gap-2">
                <FileText className="w-8 h-8 text-accent" />
                <span className="font-semibold text-sm text-white">{selectedFile.name}</span>
                <span className="text-xs text-muted">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Click to choose different file
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <UploadCloud className="w-8 h-8 text-muted" />
                <span className="font-semibold text-sm text-white">Click or drag document here</span>
                <span className="text-xs text-muted">PDF, EPUB, or Markdown (up to 50MB)</span>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              Book / Manual Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Community Biogas Digester Construction Guide"
              className="w-full rounded-xl bg-surface-dark border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/50"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Author / Technical Body *
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Kenya Industrial R&D Institute"
                className="w-full rounded-xl bg-surface-dark border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
                Track / Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Book['category'])}
                className="w-full rounded-xl bg-surface-dark border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/50"
              >
                <option value="resilience">Civilization Resilience</option>
                <option value="engineering">Engineering & Energy</option>
                <option value="health">Emergency Health & First Aid</option>
                <option value="agriculture">Food & Agriculture</option>
                <option value="tvet-trade">Vocational Trade Practice</option>
                <option value="technology">Digital & Computing</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              Trade / Specialization Label
            </label>
            <input
              type="text"
              value={tradeTitle}
              onChange={(e) => setTradeTitle(e.target.value)}
              placeholder="e.g. Solar Energy, Masonry, Public Health"
              className="w-full rounded-xl bg-surface-dark border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
              Synopsis / Key Learnings (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Brief summary of the techniques, tools, or procedures covered..."
              className="w-full rounded-xl bg-surface-dark border border-white/10 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/50 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary !py-2.5 !px-5 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary !py-2.5 !px-6 text-xs font-bold flex items-center gap-2"
            >
              {isSubmitting ? (
                <span>Publishing Manual...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Publish to MyLibrary
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
