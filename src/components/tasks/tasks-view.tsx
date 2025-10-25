"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockTasks as initialTasks, mockMobileHomes } from "@/lib/mock-data";
import { TaskType, TaskStatus } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ClipboardList,
  Sparkles,
  Wrench,
  Package,
  DollarSign,
  CheckCircle,
  Clock,
  Play,
} from "lucide-react";

const taskTypeColors = {
  [TaskType.CLEANING]: "default",
  [TaskType.MAINTENANCE]: "outline",
  [TaskType.INVENTORY_CHECK]: "secondary",
  [TaskType.DEPOSIT_VERIFICATION]: "warning",
} as const;

const taskTypeIcons = {
  [TaskType.CLEANING]: Sparkles,
  [TaskType.MAINTENANCE]: Wrench,
  [TaskType.INVENTORY_CHECK]: Package,
  [TaskType.DEPOSIT_VERIFICATION]: DollarSign,
};

const taskTypeLabels = {
  [TaskType.CLEANING]: "Ménage",
  [TaskType.MAINTENANCE]: "Maintenance",
  [TaskType.INVENTORY_CHECK]: "Inventaire",
  [TaskType.DEPOSIT_VERIFICATION]: "Vérification caution",
};

const taskStatusColors = {
  [TaskStatus.PENDING]: "warning",
  [TaskStatus.IN_PROGRESS]: "default",
  [TaskStatus.COMPLETED]: "success",
} as const;

const taskStatusLabels = {
  [TaskStatus.PENDING]: "En attente",
  [TaskStatus.IN_PROGRESS]: "En cours",
  [TaskStatus.COMPLETED]: "Terminée",
};

const taskStatusIcons = {
  [TaskStatus.PENDING]: Clock,
  [TaskStatus.IN_PROGRESS]: Play,
  [TaskStatus.COMPLETED]: CheckCircle,
};

export function TasksView() {
  const [tasks, setTasks] = useState(initialTasks);

  const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            status: newStatus,
            completedAt: newStatus === TaskStatus.COMPLETED ? new Date() : task.completedAt
          }
        : task
    ));
    alert(`Tâche mise à jour: ${newStatus === TaskStatus.COMPLETED ? "Terminée" : newStatus === TaskStatus.IN_PROGRESS ? "En cours" : "Pending"}`);
  };

  const pendingCount = tasks.filter(
    (t) => t.status === TaskStatus.PENDING
  ).length;
  const inProgressCount = tasks.filter(
    (t) => t.status === TaskStatus.IN_PROGRESS
  ).length;
  const completedCount = tasks.filter(
    (t) => t.status === TaskStatus.COMPLETED
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tâches Opérationnelles</h2>
          <p className="text-sm text-muted-foreground">
            Planification et suivi des interventions terrain
          </p>
        </div>
        <Button onClick={() => alert("Création de nouvelle tâche: Formulaire à venir")}>
          <ClipboardList className="mr-2 h-4 w-4" />
          Nouvelle Tâche
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingCount}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En Cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {inProgressCount}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Terminées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <div className="grid gap-4">
        {tasks
          .sort((a, b) => {
            // Sort by status (pending first), then by due date
            if (a.status !== b.status) {
              const statusOrder = {
                [TaskStatus.PENDING]: 0,
                [TaskStatus.IN_PROGRESS]: 1,
                [TaskStatus.COMPLETED]: 2,
              };
              return statusOrder[a.status] - statusOrder[b.status];
            }
            return (
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            );
          })
          .map((task) => {
            const mobileHome = mockMobileHomes.find(
              (m) => m.id === task.mobileHomeId
            );
            const TypeIcon = taskTypeIcons[task.type];
            const StatusIcon = taskStatusIcons[task.status];

            return (
              <Card
                key={task.id}
                className={`hover:shadow-md transition-shadow ${
                  task.status === TaskStatus.COMPLETED ? "opacity-60" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`rounded-lg p-2 ${
                          task.status === TaskStatus.COMPLETED
                            ? "bg-green-100"
                            : task.status === TaskStatus.IN_PROGRESS
                              ? "bg-blue-100"
                              : "bg-orange-100"
                        }`}
                      >
                        <TypeIcon
                          className={`h-5 w-5 ${
                            task.status === TaskStatus.COMPLETED
                              ? "text-green-600"
                              : task.status === TaskStatus.IN_PROGRESS
                                ? "text-blue-600"
                                : "text-orange-600"
                          }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {mobileHome?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={taskStatusColors[task.status]}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {taskStatusLabels[task.status]}
                      </Badge>
                      <Badge variant={taskTypeColors[task.type]}>
                        {taskTypeLabels[task.type]}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      {task.description && (
                        <div>
                          <p className="text-sm font-medium">Description</p>
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        </div>
                      )}
                      {task.assignedTo && (
                        <div>
                          <p className="text-sm font-medium">Assigné à</p>
                          <p className="text-sm text-muted-foreground">
                            {task.assignedTo}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">
                          Date d&apos;échéance
                        </p>
                        <p
                          className={`text-sm ${
                            new Date(task.dueDate) < new Date() &&
                            task.status !== TaskStatus.COMPLETED
                              ? "font-semibold text-red-600"
                              : "text-muted-foreground"
                          }`}
                        >
                          {format(task.dueDate, "dd MMMM yyyy", { locale: fr })}
                        </p>
                      </div>
                      {task.completedAt && (
                        <div>
                          <p className="text-sm font-medium">Complétée le</p>
                          <p className="text-sm text-green-600">
                            {format(task.completedAt, "dd MMMM yyyy", {
                              locale: fr,
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {task.status !== TaskStatus.COMPLETED && (
                    <div className="mt-4 flex gap-2 border-t pt-4">
                      {task.status === TaskStatus.PENDING && (
                        <Button
                          size="sm"
                          onClick={() => updateTaskStatus(task.id, TaskStatus.IN_PROGRESS)}
                        >
                          Démarrer
                        </Button>
                      )}
                      {task.status === TaskStatus.IN_PROGRESS && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => updateTaskStatus(task.id, TaskStatus.COMPLETED)}
                        >
                          Marquer Terminée
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => alert("Modification de tâche: Fonctionnalité à venir")}
                      >
                        Modifier
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
