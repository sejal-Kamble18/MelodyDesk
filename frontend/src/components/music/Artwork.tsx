import { cn } from '../../utils/cn';

interface ArtworkProps {
  label: string;
  palette: string;
  imageUrl?: string;
  className?: string;
}

export const Artwork = ({ label, palette, imageUrl, className }: ArtworkProps) => {
  if (imageUrl) {
    return <img alt="" className={cn('rounded-[18px] object-cover shadow-[0_24px_70px_rgba(0,0,0,0.36)]', className)} src={imageUrl} />;
  }

  return (
    <div className={cn('relative overflow-hidden rounded-[18px] bg-gradient-to-br shadow-[0_24px_70px_rgba(0,0,0,0.36)]', palette, className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.55),transparent_22%),linear-gradient(135deg,transparent,rgba(0,0,0,0.54))]" />
      <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full border border-white/25 bg-black/20" />
      <div className="absolute bottom-4 left-4 text-2xl font-black text-white/90">{label}</div>
    </div>
  );
};
