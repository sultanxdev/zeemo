const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'x-workspace-id': '00000000-0000-0000-0000-000000000001',
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `API Error: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
}
