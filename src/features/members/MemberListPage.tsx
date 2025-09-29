"use client"

import AppSidebar from "@/components/AppSidebar"
import DataTable from "@/components/DataTable"
import { PageHeader } from "@/components/PageHeader"
import { Autocomplete } from "@/components/ui/autocomplete"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useMemberQuery, useOrganizationsQuery } from "@/features/members/hooks"
import { Search } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

export const MemberListPage = () => {
  const { data: members } = useMemberQuery()
  const { data: organizationOptions } = useOrganizationsQuery()

  const [emailInput, setEmailInput] = useState("")
  const [adminNameInput, setAdminNameInput] = useState("")
  const [emailSearch, setEmailSearch] = useState("")
  const [adminNameSearch, setAdminNameSearch] = useState("")
  const [selectedOrganization, setSelectedOrganization] = useState("")
  const [selectedRole] = useState("すべて")
  const [hideInactiveAccounts, setHideInactiveAccounts] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(30)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [activeMenu, setActiveMenu] = useState("管理者権限")
  const [showCSVDialog, setShowCSVDialog] = useState(false)

  const filteredAndSortedData = (members || [])
    .filter((members) => {
      const matchesEmail = emailSearch === "" || members.email.toLowerCase().includes(emailSearch.toLowerCase())

      const matchesAdminName =
        adminNameSearch === "" || members.name.toLowerCase().includes(adminNameSearch.toLowerCase())

      const matchesOrganization =
        selectedOrganization === "" ||
        selectedOrganization === "all" ||
        members.organization1 === organizationOptions.find((opt) => opt.id === selectedOrganization)?.name

      const matchesRole = selectedRole === "すべて" || members.role === selectedRole
      const matchesStatus = !hideInactiveAccounts || members.status === "有効"

      return matchesEmail && matchesAdminName && matchesOrganization && matchesRole && matchesStatus
    })
    .sort((a, b) => {
      const dateA = new Date(a.registrationDate).getTime()
      const dateB = new Date(b.registrationDate).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

  const totalItems = filteredAndSortedData.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredAndSortedData.slice(startIndex, endIndex)

  const handleCSVDownload = (adminType?: "AM管理者" | "外部管理者") => {
    console.log("[v0] Starting CSV download for members permissions data", { adminType })

    // Filter data based on administrator type if specified
    let dataToExport = filteredAndSortedData
    if (adminType) {
      dataToExport = filteredAndSortedData.filter((members) => {
        const isAMAdmin = members.company === "イオンモール"
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
    const csvData = dataToExport.map((members) => [
      members.id,
      members.name,
      members.email,
      members.company,
      members.organization1,
      members.organization2,
      members.organization3,
      members.role,
      members.status,
      members.registrationDate,
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

    setShowCSVDialog(false)

    console.log("[v0] CSV download completed", { adminType, recordCount: dataToExport.length })
  }

  const handleCSVButtonClick = () => {
    setShowCSVDialog(true)
  }

  const handleSearch = () => {
    setEmailSearch(emailInput)
    setAdminNameSearch(adminNameInput)
  }

  const getAdminType = (company: string) => {
    return company === "イオンモール" ? "AM管理者" : "外部管理者"
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* サイドバー */}
      <AppSidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader title="管理者管理" />

        {/* 検索フィルター */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="grid grid-cols-12 gap-2">
            {/* 所属組織 (Autocomplete) */}
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">所属組織</label>
              <Autocomplete
                options={organizationOptions}
                value={selectedOrganization}
                onValueChange={setSelectedOrganization}
                placeholder="組織を選択または検索"
                searchPlaceholder="組織名、メール、説明で検索..."
                emptyMessage="該当する組織が見つかりません"
              />
            </div>

            {/* メールアドレス */}
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
              <Input
                placeholder="メールアドレスで検索"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full"
              />
            </div>

            {/* 管理者名 */}
            <div className="col-span-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">管理者名</label>
              <Input
                placeholder="管理者名で検索"
                value={adminNameInput}
                onChange={(e) => setAdminNameInput(e.target.value)}
                className="w-full"
              />
            </div>

            {/* 検索ボタン */}
            <div className="col-span-1 flex items-end">
              <Button className="bg-primary hover:bg-primary/90" onClick={handleSearch}>
                <Search className="w-4 h-4 mr-1" />
                検索
              </Button>
            </div>
          </div>

          {/* 廃止アカウント非表示チェックボックス */}
          <div className="grid grid-cols-12 gap-2 mt-4">
            <div className="col-span-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hide-inactive"
                  checked={hideInactiveAccounts}
                  onCheckedChange={(checked) => setHideInactiveAccounts(checked as boolean)}
                />
                <label htmlFor="hide-inactive" className="text-sm font-medium text-gray-700">
                  廃止アカウントを表示しない
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* テーブル表示エリア */}
        <div className="flex-1 bg-white px-6 py-4 overflow-y-auto">
          <DataTable
            data={currentData}
            columns={[
              { key: "id", header: "管理者ID" },
              { key: "name", header: "管理者名" },
              { key: "email", header: "メールアドレス" },
              {
                key: "company",
                header: "管理者タイプ",
                render: (value) => {
                  const adminType = getAdminType(value)
                  return (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        adminType === "AM管理者" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {adminType}
                    </span>
                  )
                },
              },
              { key: "company", header: "会社" },
              { key: "organization1", header: "組織1" },
              { key: "organization2", header: "組織2" },
              { key: "organization3", header: "組織3" },
              {
                key: "status",
                header: "ステータス",
                render: (value) => (
                  <span className={value === "有効" ? "text-green-600" : "text-gray-500"}>{value}</span>
                ),
              },
              {
                key: "id",
                header: "操作",
                render: (value) => (
                  <Button variant="secondary" className="px-3 py-1 text-sm" asChild>
                    <Link to={`/members-permissions/edit/${value}`}>編集</Link>
                  </Button>
                ),
              },
            ]}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            onCSVExport={handleCSVButtonClick}
            onNewRecord={() => (window.location.href = "/members-permissions/register")}
            onBulkImport={() => console.log("Bulk import clicked")}
            sortBy="registrationDate"
            sortOrder={sortOrder}
            onSortChange={(_field, order) => setSortOrder(order)}
            sortOptions={[{ value: "registrationDate", label: "登録日時" }]}
            showSortControls={true}
            showCSVDownload={true}
            showBulkImport={false}
            showNewRecord={true}
          />
        </div>
      </div>

      {/* CSV Download Type Selection Dialog */}
      <Dialog open={showCSVDialog} onOpenChange={setShowCSVDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>CSVダウンロード</DialogTitle>
            <DialogDescription>ダウンロードする管理者タイプを選択してください。</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-4">
            <Button
              variant="outline"
              className="justify-start h-auto p-4 bg-transparent"
              onClick={() => handleCSVDownload("AM管理者")}
            >
              <div className="text-left">
                <div className="font-medium">AM管理者</div>
                <div className="text-sm text-gray-500">イオンモール所属の管理者のみ</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="justify-start h-auto p-4 bg-transparent"
              onClick={() => handleCSVDownload("外部管理者")}
            >
              <div className="text-left">
                <div className="font-medium">外部管理者</div>
                <div className="text-sm text-gray-500">外部企業所属の管理者のみ</div>
              </div>
            </Button>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowCSVDialog(false)}>
              キャンセル
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
