export type TaskStatus = "todo" | "in-progress" | "completed"

export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

export type NewTask = Omit<Task, "id" | "createdAt" | "updatedAt">
export type UpdateTask = Partial<NewTask>
