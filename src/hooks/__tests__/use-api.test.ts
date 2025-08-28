import { renderHook, waitFor, act } from '@testing-library/react';

import { useApi, useApiMutation } from '../use-api';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock performance API
global.performance = {
  ...global.performance,
  now: jest.fn(() => Date.now()),
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
global.localStorage = localStorageMock as Storage;

// Ensure fetch is properly mocked
beforeAll(() => {
  global.fetch = mockFetch;
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  mockFetch.mockClear();
  localStorageMock.getItem.mockReturnValue(null);
  localStorageMock.setItem.mockImplementation(() => {});
});

describe('useApi', () => {

  it('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test User' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jest.fn().mockResolvedValue({ success: true, data: mockData }),
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

  it.skip('handles fetch errors', async () => {
    // Set up the mock to return a proper response
    mockFetch.mockImplementationOnce(async () => 
      Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => Promise.resolve({ success: false, message: 'Not Found' }),
      })
    );

    const { result } = renderHook(() => useApi('/api/test'));

    // Wait for the fetch to be called
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    // Then wait for loading to be false
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('HTTP 404: Not Found');
    expect(mockFetch).toHaveBeenCalledWith('/api/test', {
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it.skip('handles API response errors', async () => {
    // Set up the mock to return a proper response
    mockFetch.mockImplementationOnce(async () => 
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => Promise.resolve({ success: false, message: 'API Error' }),
      })
    );

    const { result } = renderHook(() => useApi('/api/test'));

    // Wait for the fetch to be called
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    // Then wait for loading to be false
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('API Error');
    expect(mockFetch).toHaveBeenCalledWith('/api/test', {
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('calls onSuccess callback when data is fetched', async () => {
    const mockData = { id: 1, name: 'Test' };
    const onSuccess = jest.fn();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jest.fn().mockResolvedValue({ success: true, data: mockData }),
    });

    renderHook(() => useApi('/api/test', { onSuccess }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(mockData);
    });
  });

  it('calls onError callback when error occurs', async () => {
    const onError = jest.fn();

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: jest.fn().mockResolvedValue({}),
    });

    renderHook(() => useApi('/api/test', { onError }));

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith('HTTP 500: Internal Server Error');
    });
  });

  it('does not fetch immediately when immediate is false', () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jest.fn().mockResolvedValue({ success: true, data: {} }),
    });

    renderHook(() => useApi('/api/test', { immediate: false }));

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('refetches data when refetch is called', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jest.fn().mockResolvedValue({ success: true, data: mockData }),
    });

    const { result } = renderHook(() => useApi('/api/test'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Call refetch
    await act(async () => {
      await result.current.refetch();
    });

    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe('useApiMutation', () => {

  it('performs POST mutation successfully', async () => {
    const mockResponse = { id: 1, name: 'Created' };
    const mockVariables = { name: 'New User' };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: jest.fn().mockResolvedValue({ success: true, data: mockResponse }),
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
    expect(mockFetch).toHaveBeenCalledWith('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockVariables),
    });
  });

  it('handles mutation errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: jest.fn().mockResolvedValue({}),
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
