import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchInput = ({ value, onChange, placeholder = 'Search music, artists, moods, playlists' }: SearchInputProps) => {
  return (
    <label className="relative block">
      <span className="sr-only">{placeholder}</span>
      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
      <input
        className="h-14 w-full rounded-full border border-white/10 bg-white/[0.06] px-12 text-base text-white outline-none transition placeholder:text-zinc-500 focus:border-[#22e26b]/70 focus:bg-white/[0.09] focus:ring-4 focus:ring-[#22e26b]/10"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
      {value ? (
        <button aria-label="Clear search" className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white" onClick={() => onChange('')} type="button">
          <X size={20} />
        </button>
      ) : null}
    </label>
  );
};
