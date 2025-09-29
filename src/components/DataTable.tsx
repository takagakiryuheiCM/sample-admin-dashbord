"use client"

import React from "react"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, ChevronLeft, ChevronRight, Download, Plus, Upload } from "lucide-react"

interface Column<T> {
  key: keyof T
  header: string
  render?: (value: T[keyof T], item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (items: number) => void
  onCSVExport?: () => void
  onNewRecord?: () => void
  onBulkImport?: () => void
  emptyMessage?: string
  headerStyle?: React.CSSProperties
  sortBy?: string
  sortOrder?: "newest" | "oldest"
  onSortChange?: (sortBy: string, sortOrder: "newest" | "oldest") => void
  sortOptions?: { value: string; label: string }[]
  showSortControls?: boolean
  showCSVDownload?: boolean
  showBulkImport?: boolean
  showNewRecord?: boolean
}

function DataTable<T>({
  data,
  columns,
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  onCSVExport,
  onNewRecord,
  onBulkImport,
  emptyMessage = "検索条件に一致する結果は見つかりませんでした。条件を変更して再検索してください。",
  headerStyle = { backgroundColor: "#F3E8FF" },
  sortBy = "",
  sortOrder = "newest",
  onSortChange,
  sortOptions = [],
  showSortControls = true,
  showCSVDownload = true,
  showBulkImport = false,
  showNewRecord = true,
}: DataTableProps<T>) {
  const handleCSVExport = () => {
    if (onCSVExport) {
      onCSVExport()
    }
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600">表示</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value: string) => onItemsPerPageChange(Number(value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {showSortControls && sortOptions.length > 0 && onSortChange && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">表示順：</span>
              <Select
                value={`${sortBy}-${sortOrder}`}
                onValueChange={(value: string) => {
                  const [field, order] = value.split("-")
                  onSortChange(field, order as "newest" | "oldest")
                }}
              >
                <SelectTrigger className="w-auto">
                  <SelectValue>
                    <div className="flex items-center gap-1">
                      <ArrowUpDown className="w-4 h-4" />
                      {sortOptions.find((opt) => opt.value === sortBy)?.label || "選択してください"}（
                      {sortOrder === "newest" ? "新しい順" : "古い順"}）
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <React.Fragment key={option.value}>
                      <SelectItem value={`${option.value}-newest`}>{option.label}（新しい順）</SelectItem>
                      <SelectItem value={`${option.value}-oldest`}>{option.label}（古い順）</SelectItem>
                    </React.Fragment>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {showBulkImport && onBulkImport && (
            <Button variant="secondary" onClick={onBulkImport}>
              <Upload className="w-4 h-4 mr-1" />
              CSV一括読み込み
            </Button>
          )}
          {showCSVDownload && (
            <Button variant="secondary" onClick={handleCSVExport}>
              <Download className="w-4 h-4 mr-1" />
              CSVダウンロード
            </Button>
          )}
          {showNewRecord && onNewRecord && (
            <Button className="bg-primary hover:bg-primary/90" onClick={onNewRecord}>
              <Plus className="w-4 h-4 mr-1" />
              新規登録
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow style={headerStyle}>
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                className={`text-center font-medium text-gray-900 ${column.className || ""}`}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8 text-gray-500">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <TableCell key={String(column.key)} className={`text-center ${column.className || ""}`}>
                    {column.render ? column.render(item[column.key], item) : String(item[column.key])}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">表示</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value: string) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">
            {totalItems} / {Math.ceil(totalItems / itemsPerPage)}件
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "secondary" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DataTable
export { DataTable }
