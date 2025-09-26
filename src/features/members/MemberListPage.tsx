"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Search } from "lucide-react"
import { Link } from "react-router-dom"
import AppSidebar from "@/components/AppSidebar"
import { PageHeader } from "@/components/PageHeader"
import { Autocomplete } from "@/components/ui/autocomplete"
import DataTable from "@/components/DataTable"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const userData = [
  {
    id: "0000000020",
    name: "鈴木次郎",
    email: "suzuki@aeonmall.com",
    company: "イオンモール",
    organization1: "営業統括部",
    organization2: "マーケティング部",
    organization3: "",
    role: "Admin",
    status: "有効",
    registrationDate: "2024-01-15",
  },
  {
    id: "0000000019",
    name: "高橋裕子",
    email: "takahashi@aeonmall.com",
    company: "イオンモール",
    organization1: "営業統括部",
    organization2: "マーケティング部",
    organization3: "",
    role: "Editor",
    status: "有効",
    registrationDate: "2024-01-20",
  },
  {
    id: "0000000018",
    name: "中田由美",
    email: "nakatay@aeonmall.com",
    company: "イオンモール",
    organization1: "営業統括部",
    organization2: "マーケティング部",
    organization3: "",
    role: "Viewer",
    status: "有効",
    registrationDate: "2024-02-01",
  },
  {
    id: "0000000017",
    name: "川口和夫",
    email: "kawaguchi@aeonmall.com",
    company: "イオンモール",
    organization1: "営業統括部",
    organization2: "マーケティング部",
    organization3: "",
    role: "その他",
    status: "廃止",
    registrationDate: "2024-02-10",
  },
  {
    id: "0000000016",
    name: "石田剛",
    email: "ishidat@aeonmall.com",
    company: "イオンモール",
    organization1: "営業統括部",
    organization2: "パートナーシップ部",
    organization3: "",
    role: "Editor",
    status: "有効",
    registrationDate: "2024-02-15",
  },
  {
    id: "0000000015",
    name: "木村正子",
    email: "kimuram@aeonmall.com",
    company: "イオンモール",
    organization1: "営業統括部",
    organization2: "パートナーシップ部",
    organization3: "",
    role: "Admin",
    status: "有効",
    registrationDate: "2024-03-01",
  },
  {
    id: "0000000014",
    name: "佐々木一",
    email: "sasaki@opa.co.jp",
    company: "イオンモール",
    organization1: "営業統括部",
    organization2: "アセット活用部",
    organization3: "",
    role: "Viewer",
    status: "有効",
    registrationDate: "2024-03-05",
  },
  {
    id: "0000000013",
    name: "田中花子",
    email: "tanaka@sample-corp.example",
    company: "イオンモール",
    organization1: "営業統括部",
    organization2: "アセット活用部",
    organization3: "",
    role: "Editor",
    status: "有効",
    registrationDate: "2024-03-10",
  },
  {
    id: "0000000012",
    name: "佐藤太郎",
    email: "sato@sample-corp.example",
    company: "イオンモール",
    organization1: "営業統括部",
    organization2: "ESGグループ",
    organization3: "",
    role: "Admin",
    status: "有効",
    registrationDate: "2024-03-15",
  },
  {
    id: "0000000011",
    name: "伊藤美咲",
    email: "ito@sample-corp.example",
    company: "イオンモール",
    organization1: "",
    organization2: "",
    organization3: "",
    role: "その他",
    status: "有効",
    registrationDate: "2024-03-20",
  },
  {
    id: "0000000030",
    name: "山田太郎",
    email: "yamada@sample-corp.example",
    company: "サンプル株式会社",
    organization1: "営業統括部",
    organization2: "マーケティング部",
    organization3: "",
    role: "Admin",
    status: "有効",
    registrationDate: "2024-04-01",
  },
  {
    id: "0000000029",
    name: "田村花子",
    email: "tamura@sample-corp.example",
    company: "サンプル株式会社",
    organization1: "営業統括部",
    organization2: "マーケティング部",
    organization3: "",
    role: "Editor",
    status: "有効",
    registrationDate: "2024-04-02",
  },
  {
    id: "0000000028",
    name: "佐藤次郎",
    email: "sato.jiro@sample-corp.example",
    company: "サンプル株式会社",
    organization1: "営業統括部",
    organization2: "パートナーシップ部",
    organization3: "",
    role: "Viewer",
    status: "有効",
    registrationDate: "2024-04-03",
  },
  {
    id: "0000000027",
    name: "鈴木美咲",
    email: "suzuki.misaki@sample-corp.example",
    company: "サンプル株式会社",
    organization1: "営業統括部",
    organization2: "パートナーシップ部",
    organization3: "",
    role: "Admin",
    status: "有効",
    registrationDate: "2024-04-04",
  },
  {
    id: "0000000026",
    name: "高橋一郎",
    email: "takahashi.ichiro@sample-corp.example",
    company: "サンプル株式会社",
    organization1: "営業統括部",
    organization2: "アセット活用部",
    organization3: "",
    role: "Editor",
    status: "有効",
    registrationDate: "2024-04-05",
  },
  {
    id: "0000000025",
    name: "中村由美",
    email: "nakamura.yumi@sample-corp.example",
    company: "サンプル株式会社",
    organization1: "営業統括部",
    organization2: "アセット活用部",
    organization3: "",
    role: "Viewer",
    status: "廃止",
    registrationDate: "2024-04-06",
  },
  {
    id: "0000000024",
    name: "伊藤健太",
    email: "ito.kenta@sample-corp.example",
    company: "サンプル株式会社",
    organization1: "営業統括部",
    organization2: "ESGグループ",
    organization3: "",
    role: "Admin",
    status: "有効",
    registrationDate: "2024-04-07",
  },
  {
    id: "0000000023",
    name: "渡辺真理",
    email: "watanabe.mari@sample-corp.example",
    company: "サンプル株式会社",
    organization1: "営業統括部",
    organization2: "ESGグループ",
    organization3: "",
    role: "その他",
    status: "有効",
    registrationDate: "2024-04-08",
  },
  {
    id: "0000000022",
    name: "小林正雄",
    email: "kobayashi.masao@sample-corp.example",
    company: "サンプル株式会社",
    organization1: "技術開発部",
    organization2: "システム企画課",
    organization3: "",
    role: "Admin",
    status: "有効",
    registrationDate: "2024-04-09",
  },
  {
    id: "0000000021",
    name: "加藤恵子",
    email: "kato.keiko@sample-corp.example",
    company: "サンプル株式会社",
    organization1: "技術開発部",
    organization2: "システム企画課",
    organization3: "",
    role: "Editor",
    status: "有効",
    registrationDate: "2024-04-10",
  },
  {
    id: "0000000031",
    name: "松本和子",
    email: "matsumoto.kazuko@sample-corp.example",
    company: "イオンリテール",
    organization1: "東日本支社",
    organization2: "東北・北海道事業部",
    organization3: "",
    role: "Admin",
    status: "有効",
    registrationDate: "2024-04-11",
  },
  {
    id: "0000000032",
    name: "森田健一",
    email: "morita.kenichi@sample-corp.example",
    company: "イオンリテール",
    organization1: "東日本支社",
    organization2: "東北・北海道事業部",
    organization3: "",
    role: "Editor",
    status: "有効",
    registrationDate: "2024-04-12",
  },
  {
    id: "0000000033",
    name: "清水美香",
    email: "shimizu.mika@sample-corp.example",
    company: "イオンリテール",
    organization1: "東日本支社",
    organization2: "首都圏事業部",
    organization3: "",
    role: "Viewer",
    status: "有効",
    registrationDate: "2024-04-13",
  },
  {
    id: "0000000034",
    name: "橋本雄二",
    email: "hashimoto.yuji@sample-corp.example",
    company: "イオンフィナンシャルサービス",
    organization1: "西日本支社",
    organization2: "関西事業部",
    organization3: "",
    role: "Admin",
    status: "有効",
    registrationDate: "2024-04-14",
  },
  {
    id: "0000000035",
    name: "藤田智子",
    email: "fujita.tomoko@sample-corp.example",
    company: "イオンフィナンシャルサービス",
    organization1: "西日本支社",
    organization2: "関西事業部",
    organization3: "",
    role: "Editor",
    status: "廃止",
    registrationDate: "2024-04-15",
  },
  {
    id: "0000000036",
    name: "岡田修平",
    email: "okada.shuhei@sample-corp.example",
    company: "イオンモール",
    organization1: "西日本支社",
    organization2: "九州事業部",
    organization3: "",
    role: "Viewer",
    status: "有効",
    registrationDate: "2024-04-16",
  },
  {
    id: "0000000037",
    name: "長谷川恵",
    email: "hasegawa.megumi@sample-corp.example",
    company: "イオンモール",
    organization1: "西日本支社",
    organization2: "九州事業部",
    organization3: "",
    role: "Admin",
    status: "有効",
    registrationDate: "2024-04-17",
  },
  {
    id: "0000000038",
    name: "村上直樹",
    email: "murakami.naoki@sample-corp.example",
    company: "イオンリテール",
    organization1: "中部支社",
    organization2: "東海事業部",
    organization3: "",
    role: "Editor",
    status: "有効",
    registrationDate: "2024-04-18",
  },
  {
    id: "0000000039",
    name: "近藤由紀",
    email: "kondo.yuki@sample-corp.example",
    company: "イオンリテール",
    organization1: "中部支社",
    organization2: "東海事業部",
    organization3: "",
    role: "Viewer",
    status: "有効",
    registrationDate: "2024-04-19",
  },
  {
    id: "0000000040",
    name: "斎藤光男",
    email: "saito.mitsuo@sample-corp.example",
    company: "イオンフィナンシャルサービス",
    organization1: "中部支社",
    organization2: "北陸事業部",
    organization3: "",
    role: "その他",
    status: "有効",
    registrationDate: "2024-04-20",
  },
]

export const MemberListPage = () => {
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


  const organizations = Array.from(new Set(userData.map((u) => u.organization1).filter(Boolean)))

  const organizationOptions = [
    { id: "all", name: "すべて", email: "", description: "全ての組織を表示" },
    ...organizations.map((org, index) => ({
      id: `org-${index}`,
      name: org,
      email: `contact@${org.toLowerCase().replace(/\s+/g, "")}.example`,
      description: `${org}の組織情報`,
    })),
  ]

  const filteredAndSortedData = userData
    .filter((user) => {
      const matchesEmail = emailSearch === "" || user.email.toLowerCase().includes(emailSearch.toLowerCase())

      const matchesAdminName = adminNameSearch === "" || user.name.toLowerCase().includes(adminNameSearch.toLowerCase())

      const matchesOrganization =
        selectedOrganization === "" ||
        selectedOrganization === "all" ||
        user.organization1 === organizationOptions.find((opt) => opt.id === selectedOrganization)?.name

      const matchesRole = selectedRole === "すべて" || user.role === selectedRole
      const matchesStatus = !hideInactiveAccounts || user.status === "有効"

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
    console.log("[v0] Starting CSV download for user permissions data", { adminType })

    // Filter data based on administrator type if specified
    let dataToExport = filteredAndSortedData
    if (adminType) {
      dataToExport = filteredAndSortedData.filter((user) => {
        const isAMAdmin = user.company === "イオンモール"
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
    const csvData = dataToExport.map((user) => [
      user.id,
      user.name,
      user.email,
      user.company,
      user.organization1,
      user.organization2,
      user.organization3,
      user.role,
      user.status,
      user.registrationDate,
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
                    <Link to={`/user-permissions/edit/${value}`}>編集</Link>
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
            onNewRecord={() => (window.location.href = "/user-permissions/register")}
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
