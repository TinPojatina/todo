"use client"

import { useState } from "react"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import type { Task } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, CheckCircle, Clock, Circle, GripVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TaskCardProps {
  task: Task
  onUpdate: (id: string, task: Partial<Task>) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: {
      task,
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  const handleUpdate = () => {
    onUpdate(task.id, editedTask)
    setIsEditing(false)
  }

  const handleDelete = () => {
    onDelete(task.id)
    setIsDeleteDialogOpen(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "todo":
        return <Circle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-gray-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return ""
    }
  }

  if (isEditing) {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <Input
            value={editedTask.title}
            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
            className="font-medium"
          />
        </CardHeader>
        <CardContent>
          <Textarea
            value={editedTask.description}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
            className="mb-2"
            rows={3}
          />
          <Select
            value={editedTask.status}
            onValueChange={(value) => setEditedTask({ ...editedTask, status: value as Task["status"] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-0">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleUpdate}>
            Save
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <>
      <Card className="mb-4 cursor-grab active:cursor-grabbing" ref={setNodeRef} style={style} {...attributes}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex-1">
            <CardTitle className="text-lg">{task.title}</CardTitle>
            <Badge className={`${getStatusColor(task.status)} mt-1 flex w-fit items-center gap-1`}>
              {getStatusIcon(task.status)}
              {task.status === "in-progress"
                ? "In Progress"
                : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </Badge>
          </div>
          <div className="cursor-grab rounded p-1 hover:bg-gray-100 active:cursor-grabbing" {...listeners}>
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">{task.description}</p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-0">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="mr-1 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="mr-1 h-4 w-4" />
            Delete
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
