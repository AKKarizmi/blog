export async function readJsonResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? '';
  const text = await response.text();

  if (!response.ok) {
    const detail = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    throw new Error(detail || `Request failed with status ${response.status}`);
  }

  if (response.status === 204 || !text.trim()) return undefined as T;

  if (!contentType.toLowerCase().includes('json')) {
    throw new Error(
      `Expected JSON but received ${contentType || 'an unknown response'} (${response.url}). ` +
      'Check that the backend API is running and the endpoint is proxied correctly.'
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`The server returned invalid JSON (${response.url}).`);
  }
}

export async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options?.headers ?? {})
    }
  });
  return readJsonResponse<T>(response);
}
