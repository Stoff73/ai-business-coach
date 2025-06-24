"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckSquare, Clock, Plus } from "lucide-react"

const tasks = [
  {
    id: 1,
    title: "Review Q4 marketing performance",
    priority: "High",
    dueDate: "Today",
    completed: false,
    category: "Analytics",
  },
  {
    id: 2,
    title: "Update customer onboarding flow",
    priority: "Medium",
    dueDate: "Tomorrow",
    completed: false,
    category: "Product",
  },
  {
    id: 3,
    title: "Prepare investor update",
    priority: "High",
    dueDate: "Dec 28",
    completed: true,
    category: "Finance",
  },
  {
    id: 4,
    title: "Optimize checkout conversion",
    priority: "High",
    dueDate: "Dec 30",
    completed: false,
    category: "Growth",
  },
]

export function TaskOverview() {
  const pendingTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-5 w-5 text-blue-600" />
            <CardTitle>Task Overview</CardTitle>
          </div>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{pendingTasks.length}</div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {pendingTasks.filter((t) => t.priority === "High").length}
              </div>
              <div className="text-xs text-gray-500">High Priority</div>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {tasks.slice(0, 4).map((task) => (
              <div key={task.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  checked={task.completed}
                  className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p
                      className={`text-sm font-medium ${
                        task.completed ? "line-through text-gray-500" : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        task.priority === "High"
                          ? "bg-red-100 text-red-700"
                          : task.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500">{task.category}</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{task.dueDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
