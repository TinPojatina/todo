"use client"

import { useDroppable } from "@dnd-kit/core"
import type { Task } from "@/lib/types"
import { TaskCard } from "./task-card"

interface TaskColumnProps {
  title: string
  tasks: Task[]
  status: "todo" | "in-progress" | "completed"
  onUpdateTask: (id: string, task: Partial<Task>) => void
  onDeleteTask: (id: string) => void
}

export function TaskColumn({ title, tasks, status, onUpdateTask, onDeleteTask }: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex h-full min-h-[50vh] flex-col rounded-lg border bg-white p-4 ${
        isOver ? "border-primary bg-primary/5" : ""
      }`}
    >
      <h3 className="mb-4 font-medium text-gray-700">{title}</h3>
      <div className="flex-1 space-y-4">
        {tasks.length === 0 ? (
          <p className="text-center text-sm text-gray-500">No tasks</p>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} onUpdate={onUpdateTask} onDelete={onDeleteTask} />)
        )}
      </div>
    </div>
  )
}
