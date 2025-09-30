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
import {
  useMemberCSVExport,
  useMemberFilters,
  useMemberPagination,
  useMemberQuery,
  useOrganizationsQuery,
} from "@/features/members/hooks"
import { useState } from "react"
import { Link } from "react-router-dom"

export const MemberListPage = () => {
  const { data: members } = useMemberQuery()
  const { data: organizationOptions } = useOrganizationsQuery()

  // Custom hooks for functionality
  const {
    emailInput,
    setEmailInput,
    adminNameInput,
    setAdminNameInput,
    selectedOrganization,
    setSelectedOrganization,
    hideInactiveAccounts,
    setHideInactiveAccounts,
    filteredMembers,
  } = useMemberFilters(members, organizationOptions)

  const {
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    sortOrder,
    setSortOrder,
    paginatedAndSortedMembers,
    totalItems,
    totalPages,
  } = useMemberPagination(filteredMembers)

  const { exportToCSV } = useMemberCSVExport()

  const [showCSVDialog, setShowCSVDialog] = useState(false)

  const handleCSVDownload = (adminType?: "AM管理者" | "外部管理者") => {
    exportToCSV(filteredMembers, adminType)
    setShowCSVDialog(false)
  }

  const getAdminType = (company: string) => {
    return company === "イオンモール" ? "AM管理者" : "外部管理者"
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* サイドバー */}
      <AppSidebar activeMenu={"管理者管理"} />

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader title="管理者管理" />

        {/* 検索フィルター */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="grid grid-cols-3 gap-4">
            {/* 所属組織 (Autocomplete) */}
            <div>
              <label className="block text-left text-sm font-medium text-gray-700 mb-1">所属組織</label>
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
            <div>
              <label className="block text-left text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
              <Input
                placeholder="メールアドレスで検索"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full"
              />
            </div>

            {/* 管理者名 */}
            <div>
              <label className="block text-left text-sm font-medium text-gray-700 mb-1">管理者名</label>
              <Input
                placeholder="管理者名で検索"
                value={adminNameInput}
                onChange={(e) => setAdminNameInput(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* 廃止アカウント非表示チェックボックス */}
          <div className="mt-4">
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

        {/* テーブル表示エリア */}
        <div className="flex-1 bg-white px-6 py-4 overflow-y-auto">
          <DataTable
            data={paginatedAndSortedMembers}
            columns={[
              { key: "id", header: "管理者ID" },
              { key: "name", header: "管理者名" },
              { key: "email", header: "メールアドレス" },
              {
                key: "company",
                header: "管理者タイプ",
                render: (value) => {
                  const adminType = getAdminType(value as string)
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
                    <Link to={`/edit/${value}`}>編集</Link>
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
            onCSVExport={() => setShowCSVDialog(true)}
            onNewRecord={() => (window.location.href = "/register")}
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
