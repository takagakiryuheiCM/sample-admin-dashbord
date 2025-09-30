import useSWR from "swr"
import urlJoin from "url-join"
import { sampleOrganizations } from "../sample-data/organization"

export const useOrganizationsQuery = (shouldFetch = true) => {
  return useSWR(
    shouldFetch ? urlJoin("api/organizations/") : null,
    async (url: string) => {
      console.log("url", url)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      // return response
      // id: "all"は除外

      return sampleOrganizations

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
