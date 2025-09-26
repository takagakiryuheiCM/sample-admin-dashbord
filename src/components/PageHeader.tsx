"use client"

import { useNavigate } from "react-router-dom"
import { LogOut, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  userInfo?: string
  showBackButton?: boolean
}

export function PageHeader({
  title,
  userInfo = "イオンモール/北海道支社｜田中一郎",
  showBackButton = false,
}: PageHeaderProps) {
  const router = useNavigate()

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.clear()
    sessionStorage.clear()

    // Redirect to login page
    router("/login")
  }

  const handleBack = () => {
    router(-1)
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Button
              onClick={handleBack}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">{userInfo}</div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4 mr-1" />
            ログアウト
          </Button>
        </div>
      </div>
    </div>
  )
}
