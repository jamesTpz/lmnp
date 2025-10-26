"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Percent,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { mockReservations, mockExpenses, mockTasks } from "@/lib/mock-data";
import { calculateDashboardStats } from "@/lib/calculations";
import { TaskStatus } from "@/types";
import { NewReservationDialog } from "@/components/forms/new-reservation-dialog";
import { NewExpenseDialog } from "@/components/forms/new-expense-dialog";

export function DashboardOverview() {
  const stats = calculateDashboardStats(mockReservations, mockExpenses);
  const pendingTasks = mockTasks.filter(
    (t) => t.status === TaskStatus.PENDING
  ).length;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-lg bg-black p-6 text-white shadow-lg">
        <h2 className="text-2xl font-bold">Bienvenue sur LMNP-Serenity</h2>
        <p className="mt-2 text-blue-100">
          Pilotez votre activité de location meublée à distance en toute
          sérénité
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenu Net Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalRevenue.toLocaleString("fr-FR")} €
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {stats.totalReservations} réservations confirmées
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux d&apos;Occupation</CardTitle>
            <Percent className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Année en cours
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Prix Moyen / Nuit
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageNightlyRate} €
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Toutes plateformes
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Prochaines Arrivées
            </CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingCheckIns}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Dans les 30 prochains jours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Situation Financière
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <span className="text-sm text-muted-foreground">
                Revenus nets (année)
              </span>
              <span className="font-semibold text-green-600">
                +{stats.totalRevenue.toLocaleString("fr-FR")} €
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-sm text-muted-foreground">
                Charges (mois en cours)
              </span>
              <span className="font-semibold text-red-600">
                -{stats.monthlyExpenses.toLocaleString("fr-FR")} €
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-sm text-muted-foreground">
                Cautions détenues
              </span>
              <span className="font-semibold text-blue-600">
                {stats.depositsHeld.toLocaleString("fr-FR")} €
              </span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-medium">Bénéfice estimé (année)</span>
              <span className="text-lg font-bold text-green-700">
                +
                {(stats.totalRevenue - stats.monthlyExpenses * 12).toLocaleString(
                  "fr-FR"
                )}{" "}
                €
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Tâches & Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-orange-50 p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Tâches en attente</span>
              </div>
              <Badge variant="warning">{pendingTasks}</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Synchronisation</span>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="mt-4 rounded-lg bg-blue-50 p-3">
              <p className="text-sm font-medium text-blue-900">
                Conseil fiscal LMNP
              </p>
              <p className="mt-1 text-xs text-blue-700">
                N&apos;oubliez pas d&apos;enregistrer toutes vos charges déductibles pour
                optimiser votre déclaration au Régime Réel Simplifié.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-blue-900">Nouvelle Réservation</p>
                <p className="text-xs text-blue-700">
                  Créer une réservation directe
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-green-900">Enregistrer Charge</p>
                <p className="text-xs text-green-700">
                  Ajouter une dépense déductible
                </p>
              </div>
            </div>
            <button
              onClick={() => alert("La synchronisation sera effectuée depuis l'onglet Channel Manager")}
              className="flex items-center gap-3 rounded-lg border border-purple-200 bg-purple-50 p-4 text-left transition-colors hover:bg-purple-100"
            >
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div>
                <p className="font-medium text-purple-900">Synchroniser</p>
                <p className="text-xs text-purple-700">
                  Channel Manager - OTAs
                </p>
              </div>
            </button>
          </div>
          <div className="mt-4 flex gap-3">
            <NewReservationDialog />
            <NewExpenseDialog />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
