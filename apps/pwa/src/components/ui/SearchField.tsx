export default function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block relative">
      <span className="sr-only">{placeholder}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl bg-surface border border-surface-light px-4 py-2.5 text-sm text-white placeholder:text-muted focus:outline-none focus:border-accent"
      />
    </label>
  );
}
