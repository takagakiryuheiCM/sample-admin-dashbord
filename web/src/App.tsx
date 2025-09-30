import { Suspense, useEffect } from "react"
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary"
import { BrowserRouter } from "react-router-dom"
import { SWRConfig } from "swr"
import "./App.css"
import { ErrorPresenter } from "./components/ErrorPresenter"
import { Loading } from "./components/Loading"
import { Router } from "./routes"

function App() {
  return (
    <SWRConfig
      value={{
        // エラー時にリトライを行わない
        shouldRetryOnError: false,
        // ウィンドウがフォーカスされた時の自動データ取得をOFF
        revalidateOnFocus: false,
        // オンライン復帰時の自動データ取得をOFF
        revalidateOnReconnect: false,
        // アプリ全体でsuspenseはデフォルト有効
        suspense: true,
      }}
    >
      <CustomErrorBoundary>
        <Suspense fallback={<Loading />}>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </Suspense>
      </CustomErrorBoundary>
    </SWRConfig>
  )
}

const CustomErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorPresenter}>
      <ErrorBoundaryForPromise>{children}</ErrorBoundaryForPromise>
    </ErrorBoundary>
  )
}

/**
 * Promise内で発生したエラーをキャッチするErrorBoundary
 * WARN: このコンポーネントの子要素以外で発生したエラーもキャッチされてしまうので注意が必要です
 */
const ErrorBoundaryForPromise = ({ children }: { children: React.ReactNode }) => {
  const { showBoundary } = useErrorBoundary()
  useEffect(() => {
    const onUnhandledRejection = (e: PromiseRejectionEvent) => {
      showBoundary(e.reason)
    }
    window.addEventListener("unhandledrejection", onUnhandledRejection)

    return () => window.removeEventListener("unhandledrejection", onUnhandledRejection)
  }, [showBoundary])

  return <>{children}</>
}

export default App
