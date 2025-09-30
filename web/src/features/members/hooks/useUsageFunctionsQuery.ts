import useSWR from "swr"
import urlJoin from "url-join"

const usageFunctions = [
  "施設情報管理",
  "会員管理",
  "キャンペーン管理",
  "イベント管理",
  "お買物券管理",
  "クーポン管理",
  "情報コンテンツ管理",
  "お知らせ管理",
  "PUSH通知管理",
  "利用者権限管理",
]

export const useUsageFunctionsQuery = (shouldFetch = true) => {
  return useSWR(
    shouldFetch ? urlJoin("api/usage-functions/") : null,
    async (url: string) => {
      console.log("url", url)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300))

      return usageFunctions

      // In production, you would use:
      // const res = await fetch(url, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // })

      // if (!res.ok) {
      //   throw responseToApiError(res, "GET /usage-functions")
      // }

      // const responseBody = (await res.json()) as string[]

      // return responseBody
    },
    { suspense: true },
  )
}