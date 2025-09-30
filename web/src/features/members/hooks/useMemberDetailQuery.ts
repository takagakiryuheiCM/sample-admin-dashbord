import useSWR from "swr"
import urlJoin from "url-join"
import { sampleMembers } from "../sample-data/member"

export const useMemberDetailQuery = (userId: string | undefined, shouldFetch = true) => {
  return useSWR(
    shouldFetch && userId ? urlJoin("api/members/", userId) : null,
    async (url: string) => {
      console.log("url", url)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Find member from sample data
      const member = sampleMembers.find((m) => m.id === userId)

      if (!member) {
        throw new Error("Member not found")
      }

      return member

      // In production, you would use:
      // const res = await fetch(url, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // })

      // if (!res.ok) {
      //   if (res.status === 404) {
      //     throw new Error("Member not found")
      //   }
      //   throw responseToApiError(res, "GET /members/:id")
      // }

      // const responseBody = (await res.json()) as Member

      // return responseBody
    },
    { suspense: true },
  )
}