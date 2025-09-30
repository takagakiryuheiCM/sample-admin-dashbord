import { useMemo, useState } from "react"
import type { Member } from "../sample-data/member"
import type { AutocompleteOption } from "@/components/ui/autocomplete"

export const useMemberFilters = (members: Member[], organizations: AutocompleteOption[]) => {
  const [emailInput, setEmailInput] = useState("")
  const [adminNameInput, setAdminNameInput] = useState("")
  const [selectedOrganization, setSelectedOrganization] = useState("")
  const [hideInactiveAccounts, setHideInactiveAccounts] = useState(false)

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      // Email filter
      const matchesEmail = !emailInput || member.email.toLowerCase().includes(emailInput.toLowerCase())

      // Admin name filter
      const matchesAdminName = !adminNameInput || member.name.toLowerCase().includes(adminNameInput.toLowerCase())

      // Organization filter
      const matchesOrganization =
        !selectedOrganization ||
        selectedOrganization === "all" ||
        member.organization1 === organizations.find((opt) => opt.id === selectedOrganization)?.name

      // Status filter
      const matchesStatus = !hideInactiveAccounts || member.status === "有効"

      return matchesEmail && matchesAdminName && matchesOrganization && matchesStatus
    })
  }, [members, emailInput, adminNameInput, selectedOrganization, hideInactiveAccounts, organizations])

  return {
    emailInput,
    setEmailInput,
    adminNameInput,
    setAdminNameInput,
    selectedOrganization,
    setSelectedOrganization,
    hideInactiveAccounts,
    setHideInactiveAccounts,
    filteredMembers,
  }
}