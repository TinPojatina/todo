import { NextResponse } from "next/server"

// Mock user database
declare global {
  var users: Array<{
    id: string
    name: string
    email: string
    password: string
  }>
}

// Initialize the users array if it doesn't exist
if (!global.users) {
  global.users = [
    {
      id: "1",
      name: "Demo User",
      email: "demo@example.com",
      password: "password", // In a real app, this would be hashed
    },
  ]
}

export async function POST(request: Request) {
  const { email, password } = await request.json()

  // Find the user
  const user = global.users.find((u) => u.email === email)

  // Check if user exists and password matches
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  // Generate a token (in a real app, use a proper JWT library)
  const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64")

  // Return the user and token (excluding the password)
  const { password: _, ...userWithoutPassword } = user

  return NextResponse.json({
    user: userWithoutPassword,
    token,
  })
}
