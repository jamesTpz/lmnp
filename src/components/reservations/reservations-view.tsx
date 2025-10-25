"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockReservations, mockTenants, mockMobileHomes } from "@/lib/mock-data";
import { ReservationStatus, Platform } from "@/types";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, User, MapPin, Euro, ExternalLink } from "lucide-react";

const statusColors = {
  [ReservationStatus.PENDING]: "outline",
  [ReservationStatus.CONFIRMED]: "success",
  [ReservationStatus.CHECKED_IN]: "default",
  [ReservationStatus.CHECKED_OUT]: "secondary",
  [ReservationStatus.CANCELLED]: "destructive",
} as const;

const statusLabels = {
  [ReservationStatus.PENDING]: "En attente",
  [ReservationStatus.CONFIRMED]: "Confirmée",
  [ReservationStatus.CHECKED_IN]: "En cours",
  [ReservationStatus.CHECKED_OUT]: "Terminée",
  [ReservationStatus.CANCELLED]: "Annulée",
};

const platformLabels = {
  [Platform.DIRECT]: "Direct",
  [Platform.AIRBNB]: "Airbnb",
  [Platform.BOOKING]: "Booking.com",
  [Platform.VRBO]: "Vrbo",
  [Platform.OTHER]: "Autre",
};

export function ReservationsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Réservations</h2>
          <p className="text-sm text-muted-foreground">
            Gérez vos réservations et communications avec les locataires
          </p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Nouvelle Réservation
        </Button>
      </div>

      <div className="grid gap-4">
        {mockReservations
          .sort(
            (a, b) =>
              new Date(a.checkInDate).getTime() -
              new Date(b.checkInDate).getTime()
          )
          .map((reservation) => {
            const tenant = mockTenants.find((t) => t.id === reservation.tenantId);
            const mobileHome = mockMobileHomes.find(
              (m) => m.id === reservation.mobileHomeId
            );
            const nights = differenceInDays(
              reservation.checkOutDate,
              reservation.checkInDate
            );

            return (
              <Card key={reservation.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        {tenant?.firstName} {tenant?.lastName}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {mobileHome?.name}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={statusColors[reservation.status]}>
                        {statusLabels[reservation.status]}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {platformLabels[reservation.platform]}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <div>
                          <p className="font-medium">Dates de séjour</p>
                          <p className="text-muted-foreground">
                            {format(reservation.checkInDate, "dd MMM yyyy", {
                              locale: fr,
                            })}{" "}
                            →{" "}
                            {format(reservation.checkOutDate, "dd MMM yyyy", {
                              locale: fr,
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {nights} nuit{nights > 1 ? "s" : ""} •{" "}
                            {reservation.numberOfGuests} voyageur
                            {reservation.numberOfGuests > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-slate-500" />
                        <div>
                          <p className="font-medium">Contact</p>
                          <p className="text-muted-foreground">{tenant?.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {tenant?.phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-2 text-sm">
                        <Euro className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="font-medium">Finances</p>
                          <div className="mt-1 space-y-1">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Prix total
                              </span>
                              <span className="font-semibold">
                                {reservation.totalPrice} €
                              </span>
                            </div>
                            {reservation.platformFee && reservation.platformFee > 0 && (
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">
                                  Commission
                                </span>
                                <span className="text-red-600">
                                  -{reservation.platformFee} €
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between border-t pt-1">
                              <span className="font-medium">Revenu net</span>
                              <span className="font-bold text-green-600">
                                {reservation.netRevenue} €
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 border-t pt-4">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-2 h-3 w-3" />
                      Voir Détails
                    </Button>
                    {!reservation.confirmationSent && (
                      <Button variant="default" size="sm">
                        Envoyer Confirmation
                      </Button>
                    )}
                    {reservation.status === ReservationStatus.CONFIRMED &&
                      !reservation.arrivalInstructionsSent && (
                        <Button variant="outline" size="sm">
                          Instructions d&apos;Arrivée
                        </Button>
                      )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
