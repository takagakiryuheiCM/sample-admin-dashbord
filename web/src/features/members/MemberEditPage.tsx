"use client"

import type React from "react"

import AppSidebar from "@/components/AppSidebar"
import { PageHeader } from "@/components/PageHeader"
import { Autocomplete } from "@/components/ui/autocomplete"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useMemberDetailQuery } from "./hooks/useMemberDetailQuery"
import { useMemberUpdateMutation } from "./hooks/useMemberUpdateMutation"
import { useOrganizationsQuery } from "./hooks/useOrganizationsQuery"
import { useUsageFunctionsQuery } from "./hooks/useUsageFunctionsQuery"

const getFieldRestrictions = (adminType: "AM管理者" | "外部管理者") => {
  const restrictions = {
    emailDisabled: false,
    organizationDisabled: false,
  }

  if (adminType === "外部管理者") {
    restrictions.emailDisabled = true
  }

  // AM管理者の場合、メールアドレスと所属組織を変更不可
  if (adminType === "AM管理者") {
    restrictions.emailDisabled = true
    restrictions.organizationDisabled = true
  }

  return restrictions
}

export const MemberEditPage = () => {
  const router = useNavigate()
  const params = useParams()
  const userId = params.id as string

  // Fetch data using custom hooks
  const { data: member } = useMemberDetailQuery(userId)
  const { data: organizations } = useOrganizationsQuery()
  const { data: usageFunctions } = useUsageFunctionsQuery()
  const { updateMember } = useMemberUpdateMutation()

  // Derived state from member data
  const userCompany = member.company
  const adminType = userCompany === "イオンモール" ? "AM管理者" : "外部管理者"
  const fieldRestrictions = getFieldRestrictions(adminType)

  // フォーム状態
  const [formData, setFormData] = useState({
    name: member.name,
    email: member.email,
    organization: member.organization1,
    isValid: member.status === "有効",
    usageFunctions: member.usageFunctions,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // エラーをクリア
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleUsageFunctionToggle = (func: string) => {
    const updatedFunctions = formData.usageFunctions.includes(func)
      ? formData.usageFunctions.filter((f) => f !== func)
      : [...formData.usageFunctions, func]
    handleInputChange("usageFunctions", updatedFunctions)
  }

  const handleSelectAllFunctions = () => {
    if (usageFunctions) {
      handleInputChange("usageFunctions", [...usageFunctions])
    }
  }

  const handleClearAllFunctions = () => {
    handleInputChange("usageFunctions", [])
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) newErrors.name = "名前は必須です"
    if (!formData.email.trim()) newErrors.email = "メールアドレスは必須です"
    if (!formData.organization.trim()) newErrors.organization = "所属組織は必須です"
    if (formData.usageFunctions.length === 0) newErrors.usageFunctions = "利用機能を1つ以上選択してください"

    // メールアドレス形式チェック
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "正しいメールアドレス形式で入力してください"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await updateMember(userId, formData)

      alert("管理者情報を更新しました。")
      router("/")
    } catch (error) {
      console.error("更新エラー:", error)
      alert("更新に失敗しました。もう一度お試しください。")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* サイドバー */}
      <AppSidebar activeMenu={"管理者管理"} />

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col">
        {/* ヘッダー */}
        <PageHeader title="管理者編集" userInfo="イオンモール/北海道支社｜田中一郎" showBackButton={true} />

        {/* フォームエリア */}
        <div className="flex-1 bg-white px-6 py-6">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  基本情報
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      adminType === "AM管理者" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {adminType}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    {/* 名前 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                        名前 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="名前を入力"
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* メールアドレス */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                        メールアドレス <span className="text-red-500">*</span>
                        {fieldRestrictions.emailDisabled && (
                          <span className="text-sm text-gray-500 ml-2">(変更不可)</span>
                        )}
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="example@company.com"
                        className={`${errors.email ? "border-red-500" : ""} ${
                          fieldRestrictions.emailDisabled ? "bg-gray-50 text-gray-700" : ""
                        }`}
                        disabled={fieldRestrictions.emailDisabled}
                        readOnly={fieldRestrictions.emailDisabled}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      {fieldRestrictions.emailDisabled && (
                        <p className="text-gray-500 text-sm mt-1">
                          {userCompany === "イオンモール"
                            ? `${userCompany}の管理者はメールアドレスを変更できません。`
                            : "外部管理者はメールアドレスを変更できません。"}
                        </p>
                      )}
                    </div>

                    {/* 所属組織 */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                        {adminType === "AM管理者" ? "AM管理者所属組織" : "外部管理者所属組織"}{" "}
                        <span className="text-red-500">*</span>
                        {fieldRestrictions.organizationDisabled && (
                          <span className="text-sm text-gray-500 ml-2">(変更不可)</span>
                        )}
                      </label>
                      {fieldRestrictions.organizationDisabled ? (
                        <Input value={formData.organization} className="bg-gray-50 text-gray-700" disabled readOnly />
                      ) : (
                        <Autocomplete
                          options={organizations.filter((organization) => organization.id !== "all")}
                          value={formData.organization}
                          onValueChange={(value) => handleInputChange("organization", value)}
                          placeholder="組織を選択または検索..."
                          searchPlaceholder="組織名、ID、メールアドレスで検索..."
                          emptyMessage="該当する組織が見つかりません。"
                        />
                      )}
                      {errors.organization && <p className="text-red-500 text-sm mt-1">{errors.organization}</p>}
                      {fieldRestrictions.organizationDisabled && (
                        <p className="text-gray-500 text-sm mt-1">{userCompany}の利用者は所属組織を変更できません。</p>
                      )}
                    </div>
                  </div>

                  {/* 有効フラグ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      有効フラグ <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="valid-flag"
                        checked={formData.isValid}
                        onCheckedChange={(checked) => handleInputChange("isValid", checked as boolean)}
                      />
                      <label htmlFor="valid-flag" className="text-sm text-gray-700">
                        有効
                      </label>
                    </div>
                  </div>

                  {/* 利用機能 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      利用機能 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2 mb-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAllFunctions}
                        className="text-xs bg-transparent"
                      >
                        全て選択
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleClearAllFunctions}
                        className="text-xs bg-transparent"
                      >
                        クリア
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {usageFunctions?.map((func) => (
                        <div key={func} className="flex items-center space-x-2">
                          <Checkbox
                            id={`function-${func}`}
                            checked={formData.usageFunctions.includes(func)}
                            onCheckedChange={() => handleUsageFunctionToggle(func)}
                          />
                          <label htmlFor={`function-${func}`} className="text-sm text-gray-700">
                            {func}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.usageFunctions && <p className="text-red-500 text-sm mt-1">{errors.usageFunctions}</p>}
                  </div>

                  {/* 送信ボタン */}
                  <div className="flex justify-end gap-4 pt-6">
                    <Button type="button" variant="outline" onClick={() => router("/")}>
                      キャンセル
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                      {isSubmitting ? "更新中..." : "更新"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
