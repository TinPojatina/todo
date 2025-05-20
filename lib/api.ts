"use client"

import type { Task, NewTask, UpdateTask } from "./types"

const API_URL = "https://api"

export async function fetchTasks(token: string): Promise<Task[]> {
  const response = await fetch(`${API_URL}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch tasks")
  }

  return response.json()
}

export async function createTask(token: string, task: NewTask): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  })

  if (!response.ok) {
    throw new Error("Failed to create task")
  }

  return response.json()
}

export async function updateTask(token: string, id: string, task: UpdateTask): Promise<Task> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(task),
  })

  if (!response.ok) {
    throw new Error("Failed to update task")
  }

  return response.json()
}

export async function deleteTask(token: string, id: string): Promise<void> {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to delete task")
  }
}
