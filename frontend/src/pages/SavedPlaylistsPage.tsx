import { PlaylistCard } from '../components/music/PlaylistCard';
import { SectionHeader } from '../components/product/SectionHeader';
import { Button } from '../components/ui/Button';
import { demoPlaylists } from '../services/musicMock';
import { useSessionStore } from '../store/sessionStore';

export const SavedPlaylistsPage = () => {
  const setDraft = useSessionStore((state) => state.setDraft);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Saved playlists"
        title="Your session-ready collections"
        description="Saved playlists use rich display metadata and replaceable provider references, never commercial song files."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {demoPlaylists.map((playlist) => (
          <div key={playlist.id}>
            <PlaylistCard playlist={playlist} />
            <Button className="mt-3 w-full" variant="secondary" onClick={() => setDraft({ playlistName: playlist.title, musicSource: 'focus-sound' })}>
              Use in session
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
