"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReservationStatus, Platform } from "@/types";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useReservations } from "@/hooks/useData";
import { NewReservationDialog } from "@/components/forms/new-reservation-dialog";

export function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { reservations, loading } = useReservations();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get reservations for current month
  const getReservationsForDay = (date: Date) => {
    return reservations.filter((reservation) =>
      isWithinInterval(date, {
        start: new Date(reservation.checkInDate),
        end: new Date(reservation.checkOutDate),
      }) && reservation.status !== ReservationStatus.CANCELLED
    );
  };

  const previousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const nextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const platformColors: Record<Platform, string> = {
    [Platform.AIRBNB]: "bg-red-100 text-red-800 border-red-300",
    [Platform.BOOKING]: "bg-blue-100 text-blue-800 border-blue-300",
    [Platform.VRBO]: "bg-purple-100 text-purple-800 border-purple-300",
    [Platform.DIRECT]: "bg-green-100 text-green-800 border-green-300",
    [Platform.OTHER]: "bg-gray-100 text-gray-800 border-gray-300",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Calendrier des Réservations</h2>
          <p className="text-sm text-muted-foreground">
            Vue mensuelle de vos réservations et disponibilités
          </p>
        </div>
        <NewReservationDialog />
      </div>

      {/* Calendar Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-xl">
              {format(currentMonth, "MMMM yyyy", { locale: fr })}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Header - Days of week */}
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
              <div
                key={day}
                className="p-2 text-center text-sm font-semibold text-muted-foreground"
              >
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2" />
            ))}

            {/* Days of month */}
            {daysInMonth.map((day) => {
              const reservations = getReservationsForDay(day);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toString()}
                  className={`min-h-[100px] rounded-lg border p-2 ${
                    isToday ? "border-blue-500 bg-blue-50" : "border-gray-200"
                  } ${reservations.length > 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <div className={`text-sm font-semibold ${isToday ? "text-blue-600" : ""}`}>
                    {format(day, "d")}
                  </div>
                  <div className="mt-1 space-y-1">
                    {reservations.map((reservation) => {
                      const tenant = reservation.tenant;
                      const isCheckIn = isSameDay(day, new Date(reservation.checkInDate));
                      const isCheckOut = isSameDay(day, new Date(reservation.checkOutDate));

                      return (
                        <div
                          key={reservation.id}
                          className={`rounded border px-1 py-0.5 text-xs ${
                            platformColors[reservation.platform]
                          }`}
                          title={`${tenant?.firstName} ${tenant?.lastName} - ${reservation.platform}`}
                        >
                          <div className="truncate font-medium">
                            {isCheckIn && "→ "}
                            {tenant?.lastName}
                            {isCheckOut && " ←"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Légende</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded border border-red-300 bg-red-100" />
              <span className="text-sm">Airbnb</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded border border-blue-300 bg-blue-100" />
              <span className="text-sm">Booking.com</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded border border-purple-300 bg-purple-100" />
              <span className="text-sm">Vrbo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded border border-green-300 bg-green-100" />
              <span className="text-sm">Réservation Directe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded border border-blue-500 bg-blue-50" />
              <span className="text-sm">Aujourd&apos;hui</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">→</span>
              <span className="text-sm">Arrivée</span>
              <span className="mx-2 text-sm font-medium">←</span>
              <span className="text-sm">Départ</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Reservations */}
      <Card>
        <CardHeader>
          <CardTitle>Prochaines Arrivées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reservations
              .filter(
                (r) =>
                  r.status === ReservationStatus.CONFIRMED &&
                  new Date(r.checkInDate) >= new Date()
              )
              .sort((a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime())
              .slice(0, 5)
              .map((reservation) => {
                const tenant = reservation.tenant;
                return (
                  <div
                    key={reservation.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">
                        {tenant?.firstName} {tenant?.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(reservation.checkInDate), "dd MMM yyyy", { locale: fr })}
                        {" → "}
                        {format(new Date(reservation.checkOutDate), "dd MMM yyyy", { locale: fr })}
                      </p>
                    </div>
                    <Badge variant="outline">{reservation.platform}</Badge>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
