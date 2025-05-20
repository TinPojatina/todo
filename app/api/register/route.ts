import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

// Mock user database (in a real app, this would be a database)
// This is just for demo purposes
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
  const { name, email, password } = await request.json()

  // Check if required fields are provided
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Check if email is already in use
  if (global.users.some((user) => user.email === email)) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 })
  }

  // Create a new user
  const newUser = {
    id: uuidv4(),
    name,
    email,
    password, // In a real app, this would be hashed
  }

  // Add the user to the database
  global.users.push(newUser)

  // Generate a token (in a real app, use a proper JWT library)
  const token = Buffer.from(`${newUser.id}:${Date.now()}`).toString("base64")

  // Return the user and token (excluding the password)
  const { password: _, ...userWithoutPassword } = newUser

  return NextResponse.json({
    user: userWithoutPassword,
    token,
  })
}
