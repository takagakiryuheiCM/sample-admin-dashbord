import { useMemo, useState } from "react"
import type { Member } from "../sample-data/member"

export const useMemberPagination = (members: Member[]) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(30)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

  const paginatedAndSortedMembers = useMemo(() => {
    // Sort members
    const sorted = [...members].sort((a, b) => {
      const dateA = new Date(a.registrationDate).getTime()
      const dateB = new Date(b.registrationDate).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

    // Paginate
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return sorted.slice(startIndex, endIndex)
  }, [members, currentPage, itemsPerPage, sortOrder])

  const totalItems = members.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  return {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    sortOrder,
    setSortOrder,
    paginatedAndSortedMembers,
    totalItems,
    totalPages,
  }
}