export type AppObject = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, init);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const objectApi = {
  getAll: () => request<AppObject[]>('/objects'),
  getOne: (id: string) => request<AppObject>(`/objects/${id}`),
  create: async (data: FormData) => {
    const res = await fetch(`${API_URL}/objects`, {
      method: 'POST',
      body: data,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Create failed: ${res.status}`);
    }
    return res.json() as Promise<AppObject>;
  },
  delete: (id: string) =>
    request<{ deleted: boolean; id: string }>(`/objects/${id}`, {
      method: 'DELETE',
    }),
};
