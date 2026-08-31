export type FocusDjRequest = {
  activity: string;
  mood: string;
  duration_minutes: number;
  preferred_genres: string[];
};

export type FocusDjRecommendation = {
  query: string;
  energy: 'low' | 'medium' | 'high';
  reason: string;
};

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) || 'http://localhost:8000/api/v1';

export const getFocusDjRecommendation = async (request: FocusDjRequest): Promise<FocusDjRecommendation> => {
  const response = await fetch(`${apiBaseUrl}/ai/focus-dj`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  const payload = (await response.json().catch(() => null)) as FocusDjRecommendation | { detail?: string } | null;

  if (!response.ok) {
    throw new Error((payload && 'detail' in payload && payload.detail) || `Focus DJ failed with ${response.status}.`);
  }

  return payload as FocusDjRecommendation;
};
