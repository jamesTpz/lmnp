"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DepositStatus } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DollarSign, CheckCircle, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { useReservations } from "@/hooks/useData";

const depositStatusColors = {
  [DepositStatus.AWAITING]: "warning",
  [DepositStatus.RECEIVED]: "success",
  [DepositStatus.HELD]: "default",
  [DepositStatus.PARTIALLY_REFUNDED]: "outline",
  [DepositStatus.FULLY_REFUNDED]: "secondary",
} as const;

const depositStatusLabels = {
  [DepositStatus.AWAITING]: "En attente",
  [DepositStatus.RECEIVED]: "Reçue",
  [DepositStatus.HELD]: "Détenue",
  [DepositStatus.PARTIALLY_REFUNDED]: "Part. remboursée",
  [DepositStatus.FULLY_REFUNDED]: "Remboursée",
};

const depositStatusIcons = {
  [DepositStatus.AWAITING]: Clock,
  [DepositStatus.RECEIVED]: CheckCircle,
  [DepositStatus.HELD]: DollarSign,
  [DepositStatus.PARTIALLY_REFUNDED]: AlertTriangle,
  [DepositStatus.FULLY_REFUNDED]: CheckCircle,
};

export function DepositsView() {
  const { reservations, loading } = useReservations();

  const totalDepositsHeld = reservations
    .filter(
      (r) =>
        r.depositStatus === DepositStatus.RECEIVED ||
        r.depositStatus === DepositStatus.HELD
    )
    .reduce((sum, r) => sum + r.depositAmount, 0);

  const depositsAwaiting = reservations.filter(
    (r) => r.depositStatus === DepositStatus.AWAITING
  ).length;

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
          <h2 className="text-2xl font-bold">Gestion des Cautions</h2>
          <p className="text-sm text-muted-foreground">
            Suivi des dépôts de garantie et restitutions
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Cautions Détenues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalDepositsHeld.toLocaleString("fr-FR")} €
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {depositsAwaiting}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Remboursements à Faire
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Deposits List */}
      <div className="grid gap-4">
        {reservations
          .sort(
            (a, b) =>
              new Date(b.checkInDate).getTime() -
              new Date(a.checkInDate).getTime()
          )
          .map((reservation) => {
            const tenant = reservation.tenant;
            const StatusIcon = depositStatusIcons[reservation.depositStatus];

            return (
              <Card
                key={reservation.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        {tenant?.firstName} {tenant?.lastName}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Séjour du{" "}
                        {format(new Date(reservation.checkInDate), "dd MMM yyyy", {
                          locale: fr,
                        })}{" "}
                        au{" "}
                        {format(new Date(reservation.checkOutDate), "dd MMM yyyy", {
                          locale: fr,
                        })}
                      </p>
                    </div>
                    <Badge variant={depositStatusColors[reservation.depositStatus]}>
                      <StatusIcon className="mr-1 h-3 w-3" />
                      {depositStatusLabels[reservation.depositStatus]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Montant caution
                        </span>
                        <span className="font-semibold">
                          {reservation.depositAmount} €
                        </span>
                      </div>
                      {reservation.depositReceivedDate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Date de réception
                          </span>
                          <span>
                            {format(new Date(reservation.depositReceivedDate), "dd/MM/yyyy")}
                          </span>
                        </div>
                      )}
                      {reservation.depositRefundedDate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Date remboursement
                          </span>
                          <span>
                            {format(new Date(reservation.depositRefundedDate), "dd/MM/yyyy")}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {reservation.depositDeductions &&
                        reservation.depositDeductions.length > 0 && (
                          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                            <p className="text-sm font-medium text-red-900">
                              Déductions
                            </p>
                            {reservation.depositDeductions.map((deduction) => (
                              <div
                                key={deduction.id}
                                className="mt-2 flex justify-between text-sm"
                              >
                                <span className="text-red-700">
                                  {deduction.description}
                                </span>
                                <span className="font-semibold text-red-900">
                                  -{deduction.amount} €
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 border-t pt-4">
                    {reservation.depositStatus === DepositStatus.AWAITING && (
                      <Button size="sm">Marquer comme Reçue</Button>
                    )}
                    {reservation.depositStatus === DepositStatus.RECEIVED && (
                      <Button size="sm" variant="outline">
                        Planifier Remboursement
                      </Button>
                    )}
                    {(reservation.depositStatus === DepositStatus.RECEIVED ||
                      reservation.depositStatus === DepositStatus.HELD) && (
                      <Button size="sm" variant="outline">
                        Déclarer Déduction
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
