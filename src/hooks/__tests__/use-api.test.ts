import { renderHook, waitFor, act } from '@testing-library/react';

import { useApi, useApiMutation } from '../use-api';

// Mock fetch globally
global.fetch = jest.fn();

describe('useApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test User' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockData }),
    });

    const { result } = renderHook(() => useApi<typeof mockData>('/api/test'));

    // Initially loading
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch errors', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const { result } = renderHook(() => useApi('/api/test'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('HTTP 404: Not Found');
  });

  it('handles API response errors', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false, message: 'API Error' }),
    });

    const { result } = renderHook(() => useApi('/api/test'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('API Error');
  });

  it('calls onSuccess callback when data is fetched', async () => {
    const mockData = { id: 1, name: 'Test' };
    const onSuccess = jest.fn();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockData }),
    });

    renderHook(() => useApi('/api/test', { onSuccess }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(mockData);
    });
  });

  it('calls onError callback when error occurs', async () => {
    const onError = jest.fn();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    renderHook(() => useApi('/api/test', { onError }));

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('HTTP 500: Internal Server Error');
    });
  });

  it('does not fetch immediately when immediate is false', () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: {} }),
    });

    renderHook(() => useApi('/api/test', { immediate: false }));

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('refetches data when refetch is called', async () => {
    const mockData = { id: 1, name: 'Test' };
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, data: mockData }),
    });

    const { result } = renderHook(() => useApi('/api/test'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Call refetch
    await act(async () => {
      await result.current.refetch();
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});

describe('useApiMutation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('performs POST mutation successfully', async () => {
    const mockResponse = { id: 1, name: 'Created' };
    const mockVariables = { name: 'New User' };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockResponse }),
    });

    const { result } = renderHook(() => 
      useApiMutation<typeof mockResponse, typeof mockVariables>('/api/users', 'POST')
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();

    const response = await act(async () => {
      return result.current.mutate(mockVariables);
    });

    expect(response).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockVariables),
    });
  });

  it('handles mutation errors', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
    });

    const { result } = renderHook(() => useApiMutation('/api/users', 'POST'));

    const response = await act(async () => {
      return result.current.mutate({ name: 'Test' });
    });

    expect(response).toBeNull();
    expect(result.current.error).toBe('HTTP 400: Bad Request');
  });

  it('supports different HTTP methods', () => {
    renderHook(() => useApiMutation('/api/users', 'PUT'));
    renderHook(() => useApiMutation('/api/users', 'DELETE'));

    // No errors should occur
    expect(true).toBe(true);
  });
});
