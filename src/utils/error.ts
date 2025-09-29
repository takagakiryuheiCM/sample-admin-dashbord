/**
 * ユーザーにどのような操作をしてもらうか
 * `onAction` に 画面遷移を実装する場合は `window.location.href = `を利用してください（ `react-router` を利用できません）
 */
export type ErrorAction = { buttonText: string; onAction: () => void }

export const errorAction = {
  backToTopPage: {
    buttonText: "TOPに戻る",
    onAction: () => (window.location.href = "/"),
  },
}
