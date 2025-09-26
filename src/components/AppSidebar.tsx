"use client"

import { useState, useMemo, useCallback } from "react"
import { ChevronDown, FileText } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface MenuItem {
  id: string // Added unique id for stable keys
  name: string
  hasSubmenu: boolean
  submenu: { id: string; name: string; route?: string }[] // Changed submenu to objects with ids
  route?: string
  disabled?: boolean
}

interface AppSidebarProps {
  activeMenu: string
  onMenuChange: (menu: string) => void
}

export default function AppSidebar({ activeMenu, onMenuChange }: AppSidebarProps) {
  const navigate = useNavigate()

  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>(() => ({
    "user-management": true,
    "content-management": true,
  }))

  const [showSpecifications, setShowSpecifications] = useState(false)
  const [showSpecsLink] = useState(true) // Set to false to hide specifications link

  const menuItems: MenuItem[] = useMemo(
    () => [
      {
        id: "user-management",
        name: "管理者・権限管理",
        hasSubmenu: true,
        submenu: [
          { id: "user-permissions", name: "管理者管理", route: "/user-permissions" },
          { id: "permissions", name: "組織管理", route: "/permissions" },
        ],
      },
      {
        id: "member-management",
        name: "会員管理",
        hasSubmenu: true,
        submenu: [
          { id: "member-list", name: "会員一覧" },
          { id: "member-register", name: "会員登録" },
        ],
        disabled: true,
      },
      {
        id: "coupon-management",
        name: "お買物券・クーポン管理",
        hasSubmenu: true,
        submenu: [
          { id: "shopping-ticket", name: "お買物券管理" },
          { id: "coupon", name: "クーポン管理" },
        ],
      },
      {
        id: "campaign-management",
        name: "キャンペーン管理",
        hasSubmenu: true,
        submenu: [
          { id: "campaign-list", name: "キャンペーン一覧" },
          { id: "campaign-register", name: "キャンペーン登録" },
        ],
      },
      {
        id: "event-management",
        name: "イベント予約管理",
        hasSubmenu: true,
        submenu: [
          { id: "event-list", name: "イベント一覧" },
          { id: "reservation", name: "予約管理" },
        ],
      },
      {
        id: "facility-management",
        name: "施設管理",
        hasSubmenu: true,
        submenu: [
          { id: "facility-list", name: "施設一覧", route: "/facilities" },
          { id: "facility-register", name: "施設登録", route: "/facilities/register" },
        ],
      },
      {
        id: "content-management",
        name: "情報コンテンツ管理",
        hasSubmenu: true,
        submenu: [
          { id: "facility-info", name: "施設情報", route: "/" },
          { id: "event-info", name: "イベント情報" },
          { id: "campaign-info", name: "キャンペーン情報" },
          { id: "shop-news", name: "ショップニュース" },
        ],
      },
      {
        id: "notification-management",
        name: "お知らせ/PUSH通知管理",
        hasSubmenu: true,
        submenu: [
          { id: "notice", name: "お知らせ管理" },
          { id: "push-notification", name: "PUSH通知管理" },
        ],
      },
    ],
    [],
  )

  const toggleMenu = useCallback((menuId: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }))
  }, [])

  const handleNavigation = useCallback(
    (route: string, menuName: string) => {
      onMenuChange(menuName)
      navigate(route)
    },
    [onMenuChange, navigate],
  )

  const handleMenuClick = useCallback(
    (item: MenuItem) => {
      if (item.disabled) return

      if (item.hasSubmenu) {
        toggleMenu(item.id)
      } else {
        onMenuChange(item.name)
        if (item.route) {
          navigate(item.route)
        }
      }
    },
    [toggleMenu, onMenuChange, navigate],
  )

  const handleSubMenuClick = useCallback(
    (subItem: { id: string; name: string; route?: string }) => {
      if (subItem.route) {
        handleNavigation(subItem.route, subItem.name)
      } else {
        onMenuChange(subItem.name)
      }
    },
    [handleNavigation, onMenuChange],
  )

  const getMenuItemStyles = useMemo(
    () => (item: MenuItem) => {
      const baseStyles = "flex items-center justify-between p-3 rounded transition-all duration-200"
      const isActive = activeMenu === item.name

      if (item.disabled) {
        return `${baseStyles} text-gray-400 cursor-not-allowed opacity-50`
      }

      if (isActive) {
        return `${baseStyles} bg-gray-100 text-gray-900 cursor-pointer font-medium`
      }

      return `${baseStyles} text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer`
    },
    [activeMenu],
  )

  const getSubMenuItemStyles = useMemo(
    () => (subItem: { id: string; name: string; route?: string }) => {
      const baseStyles = "p-2 text-sm rounded transition-all duration-200"
      const isActive = activeMenu === subItem.name
      const hasRoute = Boolean(subItem.route)

      if (isActive) {
        return `${baseStyles} bg-gray-200 text-gray-900 font-medium cursor-pointer`
      }

      return `${baseStyles} text-gray-600 hover:bg-gray-100 hover:text-gray-800 cursor-pointer ${
        hasRoute ? "underline hover:no-underline" : ""
      }`
    },
    [activeMenu],
  )

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">アプリ管理画面</h1>
      </div>
      <nav className="p-4 flex-1">
        {menuItems.map((item) => (
          <div key={item.id} className="mb-2">
            <div className={getMenuItemStyles(item)} onClick={() => handleMenuClick(item)}>
              <span className="text-sm font-medium">{item.name}</span>
              {item.hasSubmenu && !item.disabled && (
                <ChevronDown className={`w-4 h-4 transition-transform ${openMenus[item.id] ? "rotate-180" : ""}`} />
              )}
            </div>
            {openMenus[item.id] && item.submenu && item.submenu.length > 0 && !item.disabled && (
              <div className="ml-4 mt-1">
                {item.submenu.map((subItem) => (
                  <div
                    key={subItem.id}
                    className={getSubMenuItemStyles(subItem)}
                    onClick={() => handleSubMenuClick(subItem)}
                  >
                    {subItem.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {showSpecsLink && (
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setShowSpecifications(true)}
            className="flex items-center gap-2 text-sm text-white hover:text-white transition-colors"
          >
            <FileText className="w-4 h-4" />
            仕様書を確認
          </button>
        </div>
      )}

      {showSpecifications && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">管理画面仕様書</h2>
              <button onClick={() => setShowSpecifications(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            <div className="space-y-6 text-sm">
              <section>
                <h3 className="font-semibold text-gray-900 mb-3 text-base">概要</h3>
                <p className="text-gray-700">
                  施設管理システムの管理画面。管理者管理、権限管理、施設管理、コンテンツ管理等の機能を提供。 Next.js App
                  Router + TypeScript + Tailwind CSS + shadcn/ui + Lucideアイコンで構築。
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-3 text-base">1. 各画面の入出力項目</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">施設情報管理画面</h4>
                    <div className="bg-gray-50 p-3 rounded space-y-2">
                      <div>
                        <strong>表示カラム:</strong>{" "}
                        施設番号、施設名、ブランド、種別、会社、組織1、組織2、組織3、ステータス、操作
                      </div>
                      <div>
                        <strong>検索条件:</strong>{" "}
                        所属組織（Autocomplete）、ID/施設名（部分一致）、所属組織なし（チェックボックス）
                      </div>
                      <div>
                        <strong>登録/編集フィールド:</strong>{" "}
                        施設ID（必須・登録時のみ）、施設名（必須）、所属組織（Autocomplete）、公開ステータス（必須）
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">管理者管理画面</h4>
                    <div className="bg-gray-50 p-3 rounded space-y-2">
                      <div>
                        <strong>表示カラム:</strong>{" "}
                        管理者ID、氏名、メールアドレス、会社、所属組織、権限、ステータス、登録日時
                      </div>
                      <div>
                        <strong>検索条件:</strong>{" "}
                        氏名（部分一致）、会社（選択）、権限（選択）、ステータス（選択）、廃止アカウントを表示しない
                      </div>
                      <div>
                        <strong>登録/編集フィールド:</strong>{" "}
                        氏名（必須）、メールアドレス（必須）、会社（必須）、所属組織（必須・Autocomplete）、利用機能（必須・複数選択）、ステータス（必須）
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">組織管理画面</h4>
                    <div className="bg-gray-50 p-3 rounded space-y-2">
                      <div>
                        <strong>表示カラム:</strong> 権限ID、権限名、説明、作成日時、更新日時
                      </div>
                      <div>
                        <strong>検索条件:</strong> 権限名（部分一致）
                      </div>
                      <div>
                        <strong>登録/編集フィールド:</strong> 権限名（必須）、説明（任意）
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-3 text-base">2. 表示・並び替えルール</h3>
                <div className="bg-gray-50 p-3 rounded space-y-2">
                  <div>
                    <strong>デフォルトソート:</strong> 登録日時の新しい順
                  </div>
                  <div>
                    <strong>ページング:</strong> 30件ごと表示（10/20/30件選択可能）
                  </div>
                  <div>
                    <strong>ソート可能項目:</strong> 登録日時（新しい順/古い順）
                  </div>
                  <div>
                    <strong>フィルタ保持:</strong> ページ遷移時も検索条件を保持
                  </div>
                  <div>
                    <strong>検索結果なし:</strong>{" "}
                    「検索条件に一致する結果は見つかりませんでした。条件を変更して再検索してください。」を表示
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-3 text-base">3. 権限管理仕様</h3>
                <div className="bg-gray-50 p-3 rounded space-y-2">
                  <div>
                    <strong>権限種類:</strong> システム管理者、施設管理者、一般ユーザー、閲覧専用
                  </div>
                  <div>
                    <strong>権限スコープ:</strong> ユーザー単位で権限を付与
                  </div>
                  <div>
                    <strong>アクセス制御:</strong> 画面・機能単位でのアクセス制限
                  </div>
                  <div>
                    <strong>編集制限:</strong> 会社が「イオンモール」の場合、メールアドレス・所属組織は編集不可
                  </div>
                  <div>
                    <strong>利用機能管理:</strong> 「全て選択」「クリア」ボタンで一括操作可能
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-3 text-base">4. CSV ダウンロード仕様</h3>
                <div className="bg-gray-50 p-3 rounded space-y-2">
                  <div>
                    <strong>対象画面:</strong> 施設情報、管理者管理、権限管理、各種一覧画面
                  </div>
                  <div>
                    <strong>出力形式:</strong> UTF-8、ヘッダーあり、LF改行
                  </div>
                  <div>
                    <strong>出力項目:</strong> 画面表示項目と同一（検索条件適用後のデータ）
                  </div>
                  <div>
                    <strong>ファイル名:</strong> [画面名]_[YYYY-MM-DD].csv
                  </div>
                  <div>
                    <strong>実装状況:</strong> ✅ 全画面で実装済み（フィルタリング済みデータの出力対応）
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-3 text-base">5. 施設管理機能</h3>
                <div className="bg-gray-50 p-3 rounded space-y-2">
                  <div>
                    <strong>新規登録:</strong> 施設ID、施設名、所属組織、公開ステータスを入力
                  </div>
                  <div>
                    <strong>編集機能:</strong> 施設ID以外の項目を編集可能
                  </div>
                  <div>
                    <strong>組織検索:</strong> Autocompleteで名前、ID、メール、説明での検索
                  </div>
                  <div>
                    <strong>バリデーション:</strong> 必須項目チェック、重複チェック（TODO: API実装）
                  </div>
                  <div>
                    <strong>権限制御:</strong> 施設管理者のみが登録・編集可能
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-3 text-base">6. サイドバー・ナビゲーション</h3>
                <div className="bg-gray-50 p-3 rounded space-y-2">
                  <div>
                    <strong>メニュー構成:</strong> 2階層（親メニュー → 子メニュー）
                  </div>
                  <div>
                    <strong>状態管理:</strong> Hover（背景色変更）、Active（グレー背景）、Disabled（グレーアウト）
                  </div>
                  <div>
                    <strong>開閉状態:</strong> 親メニューのクリックで子メニュー表示切替
                  </div>
                  <div>
                    <strong>アクティブ表示:</strong> 現在のページに対応するメニューをハイライト
                  </div>
                  <div>
                    <strong>仕様書リンク:</strong> サイドバー下部に「仕様書を確認」ボタン配置
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-3 text-base">7. レスポンシブ対応</h3>
                <div className="bg-gray-50 p-3 rounded space-y-2">
                  <div>
                    <strong>PC表示:</strong> 固定サイドバー（幅320px）、メインコンテンツ可変幅
                  </div>
                  <div>
                    <strong>タブレット:</strong> サイドバー折りたたみ可能
                  </div>
                  <div>
                    <strong>モバイル:</strong> ハンバーガーメニュー、オーバーレイ表示
                  </div>
                  <div>
                    <strong>ブレークポイント:</strong> md: 768px、lg: 1024px
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-3 text-base">8. Autocomplete 仕様</h3>
                <div className="bg-gray-50 p-3 rounded space-y-2">
                  <div>
                    <strong>検索対象:</strong> 名前、メールアドレス、ID、説明文
                  </div>
                  <div>
                    <strong>検索方式:</strong> インクリメンタルサーチ（2文字以上で開始）
                  </div>
                  <div>
                    <strong>候補表示:</strong> 最大10件、部分一致でハイライト
                  </div>
                  <div>
                    <strong>キーボード操作:</strong> ↑↓で選択、Enterで確定、Escでクリア
                  </div>
                  <div>
                    <strong>適用画面:</strong> 管理者管理、施設管理の組織選択フィールド
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-3 text-base">技術仕様</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Next.js 14+ App Router</li>
                  <li>TypeScript 5+</li>
                  <li>Tailwind CSS 4</li>
                  <li>shadcn/ui コンポーネントライブラリ</li>
                  <li>Lucide React アイコン</li>
                  <li>React Hook Form（フォーム管理）</li>
                  <li>クライアントサイドレンダリング</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-3 text-base">実装状況</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">✅ 実装済み</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 text-xs">
                      <li>施設情報管理（CRUD操作）</li>
                      <li>施設登録・編集画面</li>
                      <li>管理者管理（CRUD操作）</li>
                      <li>組織管理（基本画面）</li>
                      <li>サイドバーナビゲーション</li>
                      <li>Autocomplete検索</li>
                      <li>CSVダウンロード機能</li>
                      <li>レスポンシブ対応</li>
                      <li>フィルタリング・ソート機能</li>
                      <li>ページネーション</li>
                      <li>バリデーション機能</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-700 mb-2">🚧 未実装・TODO</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 text-xs">
                      <li>実際のAPI連携</li>
                      <li>データベース連携</li>
                      <li>認証・認可システム</li>
                      <li>会員管理機能</li>
                      <li>クーポン・キャンペーン管理</li>
                      <li>イベント予約管理</li>
                      <li>PUSH通知管理</li>
                      <li>削除機能</li>
                      <li>一括操作機能</li>
                      <li>詳細画面</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-3 text-base">データ構造（モック）</h3>
                <div className="bg-gray-50 p-3 rounded text-xs font-mono space-y-2">
                  <div>
                    <strong>Facility:</strong> id, name, brand, type, company, organization1, organization2,
                    organization3, status, registrationDate
                  </div>
                  <div>
                    <strong>User:</strong> id, name, email, company, organization, role, status, createdAt,
                    usageFunctions[]
                  </div>
                  <div>
                    <strong>Permission:</strong> id, name, description, createdAt, updatedAt
                  </div>
                  <div>
                    <strong>Company:</strong> id, name, type, restrictions[]
                  </div>
                  <div>
                    <strong>Organization:</strong> id, name, email, description, companyId, parentId
                  </div>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-gray-900 mb-3 text-base">画面遷移</h3>
                <div className="bg-gray-50 p-3 rounded text-xs space-y-2">
                  <div>
                    <strong>施設管理:</strong> 一覧 → 新規登録(/register) → 一覧 | 一覧 → 編集(/edit/[id]) → 一覧
                  </div>
                  <div>
                    <strong>管理者管理:</strong> 一覧(/user-permissions) → 新規登録(/user-permissions/register) → 一覧 |
                    一覧 → 編集(/user-permissions/edit/[id]) → 一覧
                  </div>
                  <div>
                    <strong>組織管理:</strong> 一覧(/permissions) → 新規登録 → 一覧 | 一覧 → 編集 → 一覧
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
