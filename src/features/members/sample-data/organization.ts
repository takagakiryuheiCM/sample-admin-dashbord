import { sampleMembers } from "./member"

export interface Organization {
  id: string
  name: string
  email: string
  description: string
}

// Extract unique organizations from sample members
const organizations = Array.from(new Set(sampleMembers.map((member) => member.organization1).filter(Boolean)))

export const organizationData: Organization[] = [
  { id: "all", name: "すべて", email: "", description: "全ての組織を表示" },
  ...organizations.map((org, index) => ({
    id: `org-${index}`,
    name: org,
    email: `contact@${org.toLowerCase().replace(/\s+/g, "")}.example`,
    description: `${org}の組織情報`,
  })),
]
