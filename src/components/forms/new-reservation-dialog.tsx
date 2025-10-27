"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Platform, ReservationStatus, DepositStatus } from "@/types";
import { Calendar, Loader2, AlertCircle } from "lucide-react";
import { useReservations, useTenants, useMobileHomes } from "@/hooks/useData";

export function NewReservationDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const { createReservation } = useReservations();
  const { tenants, loading: loadingTenants } = useTenants();
  const { mobileHomes, loading: loadingMobileHomes } = useMobileHomes();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    tenantId: "",
    mobileHomeId: "",
    checkInDate: "",
    checkOutDate: "",
    numberOfGuests: 2,
    platform: Platform.DIRECT,
    totalPrice: 0,
    platformFee: 0,
    depositAmount: 500,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // Calculate net revenue
      const netRevenue = formData.totalPrice - (formData.platformFee || 0);

      await createReservation({
        tenantId: formData.tenantId,
        mobileHomeId: formData.mobileHomeId,
        checkInDate: new Date(formData.checkInDate).toISOString(),
        checkOutDate: new Date(formData.checkOutDate).toISOString(),
        numberOfGuests: formData.numberOfGuests,
        totalPrice: formData.totalPrice,
        platformFee: formData.platformFee || 0,
        netRevenue,
        status: ReservationStatus.CONFIRMED,
        platform: formData.platform,
        depositAmount: formData.depositAmount,
        depositStatus: DepositStatus.AWAITING,
      });

      // Reset form
      setFormData({
        tenantId: "",
        mobileHomeId: "",
        checkInDate: "",
        checkOutDate: "",
        numberOfGuests: 2,
        platform: Platform.DIRECT,
        totalPrice: 0,
        platformFee: 0,
        depositAmount: 500,
      });

      setOpen(false);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création de la réservation");
    } finally {
      setSubmitting(false);
    }
  };

  const loading = loadingTenants || loadingMobileHomes;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Nouvelle Réservation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nouvelle Réservation</DialogTitle>
            <DialogDescription>
              Créez une nouvelle réservation pour votre mobile home
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20 flex items-center gap-2 my-4">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tenantId">Locataire *</Label>
              <Select
                value={formData.tenantId}
                onValueChange={(value) => setFormData({ ...formData, tenantId: value })}
                disabled={loading || submitting}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un locataire" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.firstName} {tenant.lastName} - {tenant.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="mobileHomeId">Mobile Home *</Label>
              <Select
                value={formData.mobileHomeId}
                onValueChange={(value) => setFormData({ ...formData, mobileHomeId: value })}
                disabled={loading || submitting}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un mobile home" />
                </SelectTrigger>
                <SelectContent>
                  {mobileHomes.map((mh) => (
                    <SelectItem key={mh.id} value={mh.id}>
                      {mh.name} - {mh.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="checkInDate">Date d'arrivée *</Label>
                <Input
                  id="checkInDate"
                  type="date"
                  value={formData.checkInDate}
                  onChange={(e) =>
                    setFormData({ ...formData, checkInDate: e.target.value })
                  }
                  required
                  disabled={submitting}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="checkOutDate">Date de départ *</Label>
                <Input
                  id="checkOutDate"
                  type="date"
                  value={formData.checkOutDate}
                  onChange={(e) =>
                    setFormData({ ...formData, checkOutDate: e.target.value })
                  }
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="numberOfGuests">Nombre de voyageurs *</Label>
              <Input
                id="numberOfGuests"
                type="number"
                min="1"
                value={formData.numberOfGuests}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numberOfGuests: parseInt(e.target.value),
                  })
                }
                required
                disabled={submitting}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="platform">Plateforme *</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) =>
                  setFormData({ ...formData, platform: value as Platform })
                }
                disabled={submitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une plateforme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Platform.DIRECT}>Réservation Directe</SelectItem>
                  <SelectItem value={Platform.AIRBNB}>Airbnb</SelectItem>
                  <SelectItem value={Platform.BOOKING}>Booking.com</SelectItem>
                  <SelectItem value={Platform.VRBO}>Vrbo</SelectItem>
                  <SelectItem value={Platform.OTHER}>Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="totalPrice">Prix total (€) *</Label>
                <Input
                  id="totalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.totalPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalPrice: parseFloat(e.target.value),
                    })
                  }
                  required
                  disabled={submitting}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="platformFee">Commission plateforme (€)</Label>
                <Input
                  id="platformFee"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.platformFee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      platformFee: parseFloat(e.target.value),
                    })
                  }
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="depositAmount">Caution (€) *</Label>
              <Input
                id="depositAmount"
                type="number"
                step="0.01"
                min="0"
                value={formData.depositAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    depositAmount: parseFloat(e.target.value),
                  })
                }
                required
                disabled={submitting}
              />
            </div>

            {tenants.length === 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
                Aucun locataire trouvé. Créez d'abord un locataire dans l'onglet "Locataires".
              </div>
            )}

            {mobileHomes.length === 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
                Aucun mobile home trouvé. Créez d'abord un mobile home dans l'onglet "Mobile Homes".
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={submitting || tenants.length === 0 || mobileHomes.length === 0}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer la réservation"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
