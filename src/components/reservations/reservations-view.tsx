"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReservationStatus, Platform } from "@/types";
import { format, differenceInDays } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, User, MapPin, Euro, ExternalLink, Loader2, Download, FileText, ClipboardCheck } from "lucide-react";
import { NewReservationDialog } from "@/components/forms/new-reservation-dialog";
import { useReservations } from "@/hooks/useData";
import { InventoryCheckForm } from "@/components/inventory/inventory-check-form";

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
  const { reservations, loading, deleteReservation } = useReservations();

  const handleDownloadContract = (reservationId: string) => {
    window.open(`/api/pdf/contract/${reservationId}`, '_blank');
  };

  const handleDownloadInventory = (reservationId: string, type: 'CHECK_IN' | 'CHECK_OUT') => {
    window.open(`/api/pdf/inventory/${reservationId}?type=${type}`, '_blank');
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
          <h2 className="text-2xl font-bold">Réservations</h2>
          <p className="text-sm text-muted-foreground">
            Gérez vos réservations et communications avec les locataires
          </p>
        </div>
        <NewReservationDialog />
      </div>

      {reservations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune réservation</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Commencez par créer votre première réservation
            </p>
            <NewReservationDialog />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {reservations
            .sort(
              (a, b) =>
                new Date(a.checkInDate).getTime() -
                new Date(b.checkInDate).getTime()
            )
            .map((reservation) => {
              const tenant = reservation.tenant;
              const mobileHome = reservation.mobileHome;
              const nights = differenceInDays(
                new Date(reservation.checkOutDate),
                new Date(reservation.checkInDate)
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

                  <div className="mt-4 space-y-3 border-t pt-4">
                    <div className="flex flex-wrap gap-2">
                      <InventoryCheckForm
                        mobileHomeId={reservation.mobileHomeId}
                        mobileHomeName={mobileHome?.name || "Mobile Home"}
                        reservationId={reservation.id}
                        checkType="CHECK_IN"
                      />
                      <InventoryCheckForm
                        mobileHomeId={reservation.mobileHomeId}
                        mobileHomeName={mobileHome?.name || "Mobile Home"}
                        reservationId={reservation.id}
                        checkType="CHECK_OUT"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadContract(reservation.id)}
                      >
                        <Download className="mr-2 h-3 w-3" />
                        Contrat PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadInventory(reservation.id, 'CHECK_IN')}
                      >
                        <FileText className="mr-2 h-3 w-3" />
                        PDF État Entrée
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadInventory(reservation.id, 'CHECK_OUT')}
                      >
                        <FileText className="mr-2 h-3 w-3" />
                        PDF État Sortie
                      </Button>
                      {!reservation.confirmationSent && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => alert('Fonctionnalité d\'envoi d\'email à venir')}
                        >
                          Envoyer Confirmation
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
