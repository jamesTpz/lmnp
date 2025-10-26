"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { ReservationsView } from "@/components/reservations/reservations-view";
import { CalendarView } from "@/components/calendar/calendar-view";
import { DepositsView } from "@/components/deposits/deposits-view";
import { TasksView } from "@/components/tasks/tasks-view";
import { InventoryView } from "@/components/inventory/inventory-view";
import { ExpensesView } from "@/components/expenses/expenses-view";
import { ChannelManagerView } from "@/components/channel-manager/channel-manager-view";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/contexts/auth-context";
import {
  Home,
  CalendarCheck,
  Calendar,
  DollarSign,
  ClipboardList,
  Package,
  Receipt,
  RefreshCw,
  LogOut,
  User,
} from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        {/* Minimal clean header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                  LMNP-Serenity
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Gestion locative professionnelle
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted/50 px-3 py-2 text-right border border-border/50 flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {user?.firstName || user?.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.role === 'ADMIN' ? 'Administrateur' : 'Propriétaire'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-8 gap-1 bg-muted/50 p-1 rounded-lg border border-border/50 bg-card">
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Tableau de bord</span>
              </TabsTrigger>
              <TabsTrigger
                value="reservations"
                className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <CalendarCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Réservations</span>
              </TabsTrigger>
              <TabsTrigger
                value="calendar"
                className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Calendrier</span>
              </TabsTrigger>
              <TabsTrigger
                value="deposits"
                className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Cautions</span>
              </TabsTrigger>
              <TabsTrigger
                value="tasks"
                className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <ClipboardList className="h-4 w-4" />
                <span className="hidden sm:inline">Tâches</span>
              </TabsTrigger>
              <TabsTrigger
                value="inventory"
                className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Inventaire</span>
              </TabsTrigger>
              <TabsTrigger
                value="expenses"
                className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <Receipt className="h-4 w-4" />
                <span className="hidden sm:inline">Charges</span>
              </TabsTrigger>
              <TabsTrigger
                value="channel-manager"
                className="flex items-center gap-2 data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Channel Mgr</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-4">
              <DashboardOverview />
            </TabsContent>

            <TabsContent value="reservations" className="space-y-4">
              <ReservationsView />
            </TabsContent>

            <TabsContent value="calendar" className="space-y-4">
              <CalendarView />
            </TabsContent>

            <TabsContent value="deposits" className="space-y-4">
              <DepositsView />
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <TasksView />
            </TabsContent>

            <TabsContent value="inventory" className="space-y-4">
              <InventoryView />
            </TabsContent>

            <TabsContent value="expenses" className="space-y-4">
              <ExpensesView />
            </TabsContent>

            <TabsContent value="channel-manager" className="space-y-4">
              <ChannelManagerView />
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="mt-12 border-t bg-white py-6">
          <div className="container mx-auto px-4 text-center text-sm text-slate-600">
            <p>
              LMNP-Serenity - Application de gestion locative pour propriétaires
              LMNP
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Version 1.0.0 - Gestion à distance, pilotage professionnel
            </p>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
}
