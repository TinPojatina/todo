"use client"

import { useState, useEffect } from "react"
import { DndContext, type DragEndEvent, closestCorners } from "@dnd-kit/core"
import { useAuth } from "@/contexts/auth-context"
import ProtectedRoute from "@/components/protected-route"
import { TaskColumn } from "@/components/task-column"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { TaskFilters, type TaskFilters as TaskFiltersType } from "@/components/task-filters"
import type { Task, NewTask, TaskStatus } from "@/lib/types"
import { fetchTasks, createTask, updateTask, deleteTask } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function Dashboard() {
  const { token, logout, user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<TaskFiltersType>({
    search: "",
    status: "all",
    sortBy: "newest",
  })

  useEffect(() => {
    if (token) {
      loadTasks()
    }
  }, [token])

  useEffect(() => {
    // Apply filters and sorting
    let result = [...tasks]

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) || task.description.toLowerCase().includes(searchLower),
      )
    }

    // Apply status filter
    if (filters.status !== "all") {
      result = result.filter((task) => task.status === filters.status)
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "a-z":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "z-a":
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
    }

    setFilteredTasks(result)
  }, [tasks, filters])

  const loadTasks = async () => {
    if (!token) return

    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchTasks(token)
      setTasks(data)
    } catch (err) {
      setError("Failed to load tasks. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTask = async (newTask: NewTask) => {
    if (!token) return

    try {
      const createdTask = await createTask(token, newTask)
      setTasks([...tasks, createdTask])
    } catch (err) {
      setError("Failed to create task. Please try again.")
      console.error(err)
    }
  }

  const handleUpdateTask = async (id: string, updatedTask: Partial<Task>) => {
    if (!token) return

    try {
      const updated = await updateTask(token, id, updatedTask)
      setTasks(tasks.map((task) => (task.id === id ? updated : task)))
    } catch (err) {
      setError("Failed to update task. Please try again.")
      console.error(err)
    }
  }

  const handleDeleteTask = async (id: string) => {
    if (!token) return

    try {
      await deleteTask(token, id)
      setTasks(tasks.filter((task) => task.id !== id))
    } catch (err) {
      setError("Failed to delete task. Please try again.")
      console.error(err)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as TaskStatus

    const task = tasks.find((t) => t.id === taskId)

    if (task && task.status !== newStatus) {
      handleUpdateTask(taskId, { status: newStatus })
    }
  }

  const todoTasks = filteredTasks.filter((task) => task.status === "todo")
  const inProgressTasks = filteredTasks.filter((task) => task.status === "in-progress")
  const completedTasks = filteredTasks.filter((task) => task.status === "completed")

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-xl font-bold text-gray-900">Task Dashboard</h1>
            <div className="flex items-center gap-4">
              {user && <span className="text-sm text-gray-600">Welcome, {user.name}</span>}
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-medium">Your Tasks</h2>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <CreateTaskDialog onCreateTask={handleCreateTask} />
            </div>
          </div>

          <div className="mb-6">
            <TaskFilters filters={filters} onFilterChange={setFilters} />
          </div>

          {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
            </div>
          ) : (
            <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* To Do Column */}
                <TaskColumn
                  title="To Do"
                  tasks={todoTasks}
                  status="todo"
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                />

                {/* In Progress Column */}
                <TaskColumn
                  title="In Progress"
                  tasks={inProgressTasks}
                  status="in-progress"
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                />

                {/* Completed Column */}
                <TaskColumn
                  title="Completed"
                  tasks={completedTasks}
                  status="completed"
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                />
              </div>
            </DndContext>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
