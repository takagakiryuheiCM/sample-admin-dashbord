import type { Member } from "../sample-data/member"

export const useMemberCSVExport = () => {
  const exportToCSV = (members: Member[], adminType?: "AM管理者" | "外部管理者") => {
    console.log("[v0] Starting CSV download for members permissions data", { adminType })

    // Filter data based on administrator type if specified
    let dataToExport = members
    if (adminType) {
      dataToExport = members.filter((member) => {
        const isAMAdmin = member.company === "イオンモール"
        return adminType === "AM管理者" ? isAMAdmin : !isAMAdmin
      })
    }

    // CSV headers in Japanese
    const headers = [
      "管理者ID",
      "管理者名",
      "メールアドレス",
      "会社",
      "組織1",
      "組織2",
      "組織3",
      "ロール",
      "ステータス",
      "登録日時",
    ]

    // Use filtered data for CSV export
    const csvData = dataToExport.map((member) => [
      member.id,
      member.name,
      member.email,
      member.company,
      member.organization1,
      member.organization2,
      member.organization3,
      member.role,
      member.status,
      member.registrationDate,
    ])

    // Create CSV content
    const csvContent = [headers.join(","), ...csvData.map((row) => row.map((field) => `"${field}"`).join(","))].join(
      "\n",
    )

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    const filename = adminType
      ? `管理者管理_${adminType}_${new Date().toISOString().split("T")[0]}.csv`
      : `管理者管理_${new Date().toISOString().split("T")[0]}.csv`
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log("[v0] CSV download completed", { adminType, recordCount: dataToExport.length })
  }

  return { exportToCSV }
}