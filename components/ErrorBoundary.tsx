import React, { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — Lazy-loaded bileşenlerin render/chunk-load
 * hatalarını yakalayıp kullanıcıya anlamlı mesaj gösterir.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const isChunkError =
        this.state.error?.message?.includes("Failed to fetch") ||
        this.state.error?.message?.includes("Loading chunk") ||
        this.state.error?.message?.includes("dynamically imported module");

      return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#06060e] flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {isChunkError ? "Bağlantı Hatası" : "Bir şeyler ters gitti"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm leading-relaxed">
              {isChunkError
                ? "Sayfa yüklenirken bağlantı kesildi. İnternet bağlantınızı kontrol edip tekrar deneyin."
                : "Beklenmeyen bir hata oluştu. Sayfayı yenilemeyi deneyin."}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm shadow-lg shadow-purple-500/20"
              >
                <RefreshCw className="w-4 h-4" />
                Tekrar Dene
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="px-5 py-2.5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-sm font-medium"
              >
                Ana Sayfa
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
