"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type TaskFilters = {
  search: string
  status: "all" | "todo" | "in-progress" | "completed"
  sortBy: "newest" | "oldest" | "a-z" | "z-a"
}

interface TaskFiltersProps {
  filters: TaskFilters
  onFilterChange: (filters: TaskFilters) => void
}

export function TaskFilters({ filters, onFilterChange }: TaskFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<TaskFilters>(filters)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value }
    onFilterChange(newFilters)
  }

  const handleFilterChange = (key: keyof TaskFilters, value: string) => {
    setLocalFilters({ ...localFilters, [key]: value })
  }

  const applyFilters = () => {
    onFilterChange(localFilters)
    setIsOpen(false)
  }

  const resetFilters = () => {
    const defaultFilters: TaskFilters = {
      search: "",
      status: "all",
      sortBy: "newest",
    }
    setLocalFilters(defaultFilters)
    onFilterChange(defaultFilters)
    setIsOpen(false)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Search tasks..."
          className="pl-9"
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters & Sort</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Filters</h4>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={localFilters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Sort</h4>
              <div className="space-y-2">
                <Label htmlFor="sortBy">Sort by</Label>
                <Select value={localFilters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
                  <SelectTrigger id="sortBy">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="a-z">A to Z</SelectItem>
                    <SelectItem value="z-a">Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={resetFilters} className="gap-1">
                <X className="h-4 w-4" />
                Reset
              </Button>
              <Button size="sm" onClick={applyFilters}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
