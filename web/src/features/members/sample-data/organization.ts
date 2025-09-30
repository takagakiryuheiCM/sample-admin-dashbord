export interface Organization {
  id: string
  name: string
  email: string
  description: string
}

// Extract unique organizations from sample members
const organizations = ["営業統括部", "技術開発部", "東日本支社", "西日本支社", "中部支社"]

export const sampleOrganizations: Organization[] = [
  { id: "all", name: "すべて", email: "", description: "全ての組織を表示" },
  ...organizations.map((org, index) => ({
    id: `org-${index}`,
    name: org,
    email: `contact@${org.toLowerCase().replace(/\s+/g, "")}.example`,
    description: `${org}の組織情報`,
  })),
]
