"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Autocomplete, type AutocompleteOption } from "@/components/ui/autocomplete"
import { Search } from "lucide-react"

interface FilterField {
  type: "text" | "select" | "autocomplete"
  key: string
  label: string
  placeholder?: string
  options?: { value: string; label: string }[] | AutocompleteOption[]
  value: any
  onChange: (value: any) => void
  colSpan?: number
  searchPlaceholder?: string
  emptyMessage?: string
}

interface SearchFiltersProps {
  fields: FilterField[]
  onSearch?: () => void
  showSearchButton?: boolean
}

export function SearchFilters({ fields, onSearch, showSearchButton = true }: SearchFiltersProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="grid grid-cols-12 gap-4">
        {fields.map((field) => (
          <div key={field.key} className={`col-span-${field.colSpan || 4}`}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>

            {field.type === "text" && (
              <Input
                placeholder={field.placeholder}
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-full"
              />
            )}

            {field.type === "select" && (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {(field.options as { value: string; label: string }[])?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {field.type === "autocomplete" && (
              <Autocomplete
                options={field.options as AutocompleteOption[]}
                value={field.value}
                onValueChange={field.onChange}
                placeholder={field.placeholder}
                searchPlaceholder={field.searchPlaceholder}
                emptyMessage={field.emptyMessage}
                className="w-full"
              />
            )}
          </div>
        ))}

        {showSearchButton && (
          <div className="col-span-1 flex items-end justify-end">
            <Button className="bg-primary hover:bg-primary/90" onClick={onSearch}>
              <Search className="w-4 h-4 mr-1" />
              検索
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
