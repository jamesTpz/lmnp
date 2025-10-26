"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { ReservationsView } from "@/components/reservations/reservations-view";
import { CalendarView } from "@/components/calendar/calendar-view";
import { DepositsView } from "@/components/deposits/deposits-view";
import { TasksView } from "@/components/tasks/tasks-view";
import { InventoryView } from "@/components/inventory/inventory-view";
import { ExpensesView } from "@/components/expenses/expenses-view";
import { ChannelManagerView } from "@/components/channel-manager/channel-manager-view";
import {
  Home,
  CalendarCheck,
  Calendar,
  DollarSign,
  ClipboardList,
  Package,
  Receipt,
  RefreshCw,
} from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen">
      {/* Header with gradient */}
      <header className="border-b bg-gradient-to-r from-primary via-primary/95 to-accent shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                LMNP-Serenity
              </h1>
              <p className="text-sm text-white/90 font-medium mt-1">
                Gestion locative professionnelle de mobil-homes
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white/10 backdrop-blur-sm px-4 py-2 text-right border border-white/20">
                <p className="text-sm font-semibold text-white">
                  Mobil-Home Premium Vue Mer
                </p>
                <p className="text-xs text-white/80">
                  Camping Les Sables d&apos;Or
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 gap-2 bg-card p-2 shadow-md rounded-xl border">
            <TabsTrigger
              value="dashboard"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Tableau de bord</span>
            </TabsTrigger>
            <TabsTrigger
              value="reservations"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
            >
              <CalendarCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Réservations</span>
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendrier</span>
            </TabsTrigger>
            <TabsTrigger
              value="deposits"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
            >
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Cautions</span>
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
            >
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Tâches</span>
            </TabsTrigger>
            <TabsTrigger
              value="inventory"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
            >
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Inventaire</span>
            </TabsTrigger>
            <TabsTrigger
              value="expenses"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
            >
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Charges</span>
            </TabsTrigger>
            <TabsTrigger
              value="channel-manager"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md transition-all"
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
  );
}
