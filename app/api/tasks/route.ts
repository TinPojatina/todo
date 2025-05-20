import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import type { Task } from "@/lib/types"

// Mock database
declare global {
  var tasks: Task[]
}

// Initialize tasks if they don't exist
if (!global.tasks) {
  global.tasks = [
    {
      id: "1",
      title: "Complete project proposal",
      description: "Draft the initial project proposal for the client meeting",
      status: "todo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Review design mockups",
      description: "Review the design mockups from the design team",
      status: "in-progress",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Set up development environment",
      description: "Install and configure all necessary tools for development",
      status: "completed",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]
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

export async function GET(request: Request) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json(global.tasks)
}

export async function POST(request: Request) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()

  const newTask: Task = {
    id: uuidv4(),
    title: body.title,
    description: body.description,
    status: body.status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  global.tasks.push(newTask)

  return NextResponse.json(newTask)
}
