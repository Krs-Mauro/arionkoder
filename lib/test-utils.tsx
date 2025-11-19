import { render, RenderOptions, RenderResult } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";

type CustomRenderOptions = Omit<RenderOptions, "wrapper">;

/**
 * Custom render function that wraps components with necessary providers
 * for testing (e.g., Context providers, Router, etc.)
 */
function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
): RenderResult {
  const Wrapper = ({ children }: { children: ReactNode }): ReactElement => {
    // Add any providers here that your components need
    // For now, just return children as-is
    return <>{children}</>;
  };

  return render(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything from React Testing Library
export * from "@testing-library/react";

// Override the default render with our custom render
export { customRender as render };
