import useSWR from "swr"
import urlJoin from "url-join"
import { sampleMembers } from "../sample-data/member"

export const useMemberQuery = (shouldFetch = true) => {
  return useSWR(
    shouldFetch ? urlJoin("api/members/") : null,
    async (url: string) => {
      console.log("url", url)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      // return response
      return sampleMembers

      // In production, you would use:
      // const res = await fetch(url, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // })

      // if (!res.ok) {
      //   if (res.status === 404) {
      //     return null
      //   }
      //   throw responseToApiError(res, "GET /members/me")
      // }

      // const responseBody = (await res.json()) as Member[]

      // return responseBody
    },
    { suspense: true },
  )
}
