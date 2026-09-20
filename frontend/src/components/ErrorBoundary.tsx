import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("UI error:", error, info);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen font-[var(--font-seed-sans)] antialiased bg-[--color-snow-white] flex flex-col items-center justify-center gap-4 p-6 text-center">
          <h1
            className="text-[28px] text-[--color-forest-depths]"
            style={{ fontWeight: 350 }}
          >
            Đã có lỗi xảy ra
          </h1>
          <p className="text-[14px] text-[--color-pewter]">
            Vui lòng tải lại trang hoặc quay về trang chủ.
          </p>
          <a
            href="/"
            className="mt-2 inline-flex items-center justify-center rounded-full bg-[--color-forest-depths] text-[--color-snow-white] px-6 py-3 text-[14px]"
          >
            Về trang chủ
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;