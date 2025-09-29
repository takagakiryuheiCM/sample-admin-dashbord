import { errorAction, type ErrorAction } from "@/utils/error"
import type { FC } from "react"
import { Button } from "./ui/button"

export const ErrorPresenterView = ({
  errorTitle,
  errorDescription,
  children,
}: {
  errorTitle: string
  errorDescription: string
  children: React.ReactNode
}) => (
  <>
    <main data-testid="errorPresenter" className="flex flex-col gap-4 px-4 pt-8">
      <span className="text-14ptW6">{errorTitle}</span>
      <span className="text-14ptW3">{errorDescription}</span>
      {children}
    </main>
  </>
)

export const ErrorPresenter = () => {
  return (
    <ErrorPresenterView
      errorTitle="エラーが発生しました"
      errorDescription="ご迷惑をおかけしております。しばらくお待ちいただくか、再度お試しください。"
    >
      <RetryButtonList errorActions={[errorAction.backToTopPage]} />
    </ErrorPresenterView>
  )
}

export const RetryButtonList: FC<{
  errorActions: ErrorAction[]
}> = ({ errorActions }) => {
  return (
    <>
      {errorActions.map(({ buttonText, onAction }) => {
        return (
          <Button key={buttonText} variant="default" onClick={onAction}>
            {buttonText}
          </Button>
        )
      })}
    </>
  )
}
