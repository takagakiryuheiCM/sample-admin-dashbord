import { useSWRConfig } from "swr"
import urlJoin from "url-join"
import { sampleMembers } from "../sample-data/member"

export type MemberUpdateInput = {
  name: string
  email: string
  organization: string
  isValid: boolean
  usageFunctions: string[]
}

export const useMemberUpdateMutation = () => {
  const { mutate } = useSWRConfig()

  const updateMember = async (userId: string, input: MemberUpdateInput) => {
    console.log("Updating member:", userId, input)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Update sample data
    const memberIndex = sampleMembers.findIndex((m) => m.id === userId)
    if (memberIndex === -1) {
      throw new Error("Member not found")
    }

    // Update the member in sample data
    sampleMembers[memberIndex] = {
      ...sampleMembers[memberIndex],
      name: input.name,
      email: input.email,
      organization1: input.organization,
      status: input.isValid ? "有効" : "廃止",
      // Note: usageFunctions are not stored in the sample data structure
      // but would be in a real API response
    }

    // Invalidate and refetch relevant queries
    await mutate(urlJoin("api/members/", userId))
    await mutate(urlJoin("api/members/"))

    return sampleMembers[memberIndex]

    // In production, you would use:
    // const res = await fetch(urlJoin("api/members/", userId), {
    //   method: "PUT",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(input),
    // })

    // if (!res.ok) {
    //   throw responseToApiError(res, "PUT /members/:id")
    // }

    // const responseBody = (await res.json()) as Member

    // // Invalidate and refetch relevant queries
    // await mutate(urlJoin("api/members/", userId))
    // await mutate(urlJoin("api/members/"))

    // return responseBody
  }

  return { updateMember }
}