import { NextResponse } from "next/server"
import type { Task } from "@/lib/types"

// Reference to the mock database from the parent route
// In a real app, you would use a proper database
declare global {
  var tasks: Task[]
}

// Middleware to check authentication
function isAuthenticated(request: Request) {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false
  }

  // In a real app, you would verify the token
  return true
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = params.id
  const body = await request.json()

  // Find the task
  const taskIndex = global.tasks.findIndex((t) => t.id === id)

  if (taskIndex === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  // Update the task
  const updatedTask = {
    ...global.tasks[taskIndex],
    ...body,
    updatedAt: new Date().toISOString(),
  }

  global.tasks[taskIndex] = updatedTask

  return NextResponse.json(updatedTask)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = params.id

  // Find the task
  const taskIndex = global.tasks.findIndex((t) => t.id === id)

  if (taskIndex === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 })
  }

  // Remove the task
  global.tasks.splice(taskIndex, 1)

  return NextResponse.json({ success: true })
}
