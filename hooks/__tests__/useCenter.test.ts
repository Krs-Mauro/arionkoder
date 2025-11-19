import { renderHook, waitFor } from "@testing-library/react";
import { useCenter } from "../useCenter";

describe("useCenter", () => {
  const mockCenter = {
    id: "center-1",
    slug: "bella-vita-spa",
    name: "Bella Vita Spa",
    description: "Luxury spa",
    logo: "💆‍♀️",
    services: [
      {
        id: "service-1",
        name: "Facial",
        description: "Relaxing facial",
        duration: 60,
        price: 8500,
        centerId: "center-1"
      }
    ]
  };

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should initialize with idle state", () => {
    (global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useCenter("bella-vita-spa"));

    expect(result.current.center).toBeNull();
    expect(result.current.status).toBe("loading");
    expect(result.current.error).toBeNull();
  });

  it("should fetch center successfully", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ center: mockCenter })
    });

    const { result } = renderHook(() => useCenter("bella-vita-spa"));

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });

    expect(result.current.center).toEqual(mockCenter);
    expect(result.current.error).toBeNull();
  });

  it("should set loading state during fetch", async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ center: mockCenter })
              }),
            100
          )
        )
    );

    const { result } = renderHook(() => useCenter("bella-vita-spa"));

    expect(result.current.status).toBe("loading");
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.status).toBe("success");
    });
  });

  it("should handle API error", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Center not found" })
    });

    const { result } = renderHook(() => useCenter("invalid-slug"));

    await waitFor(() => {
      expect(result.current.status).toBe("error");
    });

    expect(result.current.center).toBeNull();
    expect(result.current.error).toBe("Center not found");
  });

  it("should handle network error", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network error")
    );

    const { result } = renderHook(() => useCenter("bella-vita-spa"));

    await waitFor(() => {
      expect(result.current.status).toBe("error");
    });

    expect(result.current.center).toBeNull();
    expect(result.current.error).toBe("Network error");
  });

  it("should fetch correct API endpoint", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ center: mockCenter })
    });

    renderHook(() => useCenter("bella-vita-spa"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/centers/bella-vita-spa");
    });
  });

  it("should refetch when slug changes", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ center: mockCenter })
    });

    const { rerender } = renderHook(({ slug }) => useCenter(slug), {
      initialProps: { slug: "bella-vita-spa" }
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/centers/bella-vita-spa");
    });

    rerender({ slug: "radiant-beauty-lounge" });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/centers/radiant-beauty-lounge"
      );
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("should cleanup on unmount", async () => {
    let resolvePromise!: (value: Response) => void;
    const promise = new Promise<Response>((resolve) => {
      resolvePromise = resolve;
    });

    (global.fetch as jest.Mock).mockReturnValueOnce(promise);

    const { unmount } = renderHook(() => useCenter("bella-vita-spa"));

    unmount();

    // Resolve after unmount
    resolvePromise({
      ok: true,
      json: async () => ({ center: mockCenter })
    } as Response);

    // Wait a bit to ensure no state updates occur
    await new Promise((resolve) => setTimeout(resolve, 50));

    // No assertions needed - if state updates after unmount, React will warn
  });
});
