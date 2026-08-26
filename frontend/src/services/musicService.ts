import { isSupabaseConfigured, supabase } from '../lib/supabase';

export type MusicProviderId = 'apple-preview' | 'demo';

export type ProviderTrack = {
  id: string;
  provider: MusicProviderId;
  providerTrackId: string;
  title: string;
  artist: string;
  album?: string;
  artworkUrl?: string;
  durationSeconds: number;
  streamUrl?: string;
  attribution?: string;
  playable: boolean;
};

export type MusicSearchResult = {
  provider: MusicProviderId;
  providerConfigured: boolean;
  tracks: ProviderTrack[];
  attribution?: string;
};

export interface MusicProvider {
  id: MusicProviderId;
  search(query: string, limit?: number): Promise<MusicSearchResult>;
  resolvePlayableTrack(track: ProviderTrack): Promise<ProviderTrack>;
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:8000/api/v1';
const itunesSearchUrl = 'https://itunes.apple.com/search';
const itunesLookupUrl = 'https://itunes.apple.com/lookup';

const readJson = async <T>(response: Response): Promise<T> => {
  const payload = (await response.json().catch(() => null)) as { detail?: unknown; message?: string } | null;
  if (!response.ok) {
    const detail = typeof payload?.detail === 'string' ? payload.detail : payload?.message;
    throw new Error(detail || `Music request failed with ${response.status}.`);
  }
  return payload as T;
};

export const previewProvider: MusicProvider = {
  id: 'apple-preview',
  async search(query, limit = 12) {
    if (!query.trim()) {
      return { provider: 'apple-preview', providerConfigured: true, tracks: [] };
    }

    const params = new URLSearchParams({ q: query.trim(), limit: String(limit) });
    try {
      return await readJson<MusicSearchResult>(await fetch(`${apiBaseUrl}/music/search?${params.toString()}`));
    } catch {
      return searchItunesDirect(query, limit);
    }
  },
  async resolvePlayableTrack(track) {
    if (track.streamUrl) return Promise.resolve(track);
    try {
      return await fetch(`${apiBaseUrl}/music/resolve/${track.provider}/${track.providerTrackId}`).then(readJson<ProviderTrack>);
    } catch {
      return resolveItunesDirect(track.providerTrackId);
    }
  },
};

type ItunesTrack = {
  trackId?: number;
  trackName?: string;
  artistName?: string;
  collectionName?: string;
  artworkUrl100?: string;
  trackTimeMillis?: number;
  previewUrl?: string;
};

const searchTerms = (query: string) => {
  const cleaned = query.trim();
  const lower = cleaned.toLowerCase();
  if (lower.includes('old hindi')) return ['old hindi songs', 'kishore kumar', 'lata mangeshkar', 'mohammed rafi'];
  if (lower.includes('new hindi') || lower.includes('latest hindi')) return ['new hindi songs', 'arijit singh', 'bollywood hits'];
  if (lower === 'new songs' || lower === 'latest songs') return ['top songs', 'new music'];
  return [cleaned];
};

const mapItunesTrack = (item: ItunesTrack): ProviderTrack | null => {
  if (!item.trackId || !item.previewUrl) return null;
  return {
    id: `apple-preview:${item.trackId}`,
    provider: 'apple-preview',
    providerTrackId: String(item.trackId),
    title: item.trackName || 'Untitled preview',
    artist: item.artistName || 'Unknown artist',
    album: item.collectionName,
    artworkUrl: item.artworkUrl100?.replace('100x100bb', '600x600bb'),
    durationSeconds: 30,
    streamUrl: item.previewUrl,
    attribution: '30-second preview from Apple iTunes Search API',
    playable: true,
  };
};

const searchItunesDirect = async (query: string, limit = 12): Promise<MusicSearchResult> => {
  const tracks = new Map<string, ProviderTrack>();
  for (const term of searchTerms(query)) {
    for (const country of ['IN', 'US', 'GB']) {
      if (tracks.size >= limit) break;
      const params = new URLSearchParams({ term, media: 'music', entity: 'song', limit: String(limit), country });
      const response = await fetch(`${itunesSearchUrl}?${params.toString()}`);
      const payload = (await response.json()) as { results?: ItunesTrack[] };
      payload.results?.map(mapItunesTrack).forEach((track) => {
        if (track && tracks.size < limit) tracks.set(track.id, track);
      });
    }
  }
  return { provider: 'apple-preview', providerConfigured: true, tracks: [...tracks.values()], attribution: '30-second previews from Apple iTunes Search API.' };
};

const resolveItunesDirect = async (trackId: string): Promise<ProviderTrack> => {
  const response = await fetch(`${itunesLookupUrl}?${new URLSearchParams({ id: trackId, entity: 'song', country: 'IN' })}`);
  const payload = (await response.json()) as { results?: ItunesTrack[] };
  const track = payload.results?.map(mapItunesTrack).find((item) => item?.providerTrackId === trackId);
  if (!track) throw new Error('Playable preview is unavailable for this track.');
  return track;
};

export const searchProviderTracks = (query: string, limit?: number) => previewProvider.search(query, limit);
export const resolvePlayableTrack = (track: ProviderTrack) => previewProvider.resolvePlayableTrack(track);

export const saveFavoriteTrack = async (track: ProviderTrack) => {
  if (!isSupabaseConfigured) return;
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;

  const { error } = await supabase.from('favorites').upsert({
    user_id: data.user.id,
    provider: track.provider,
    provider_track_id: track.providerTrackId,
    track_title: track.title,
    artist_name: track.artist,
    artwork_url: track.artworkUrl ?? null,
    duration_seconds: track.durationSeconds,
  });

  if (error) throw new Error(error.message, { cause: error });
};

export const removeFavoriteTrack = async (track: Pick<ProviderTrack, 'provider' | 'providerTrackId'>) => {
  if (!isSupabaseConfigured) return;
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', data.user.id)
    .eq('provider', track.provider)
    .eq('provider_track_id', track.providerTrackId);

  if (error) throw new Error(error.message, { cause: error });
};
