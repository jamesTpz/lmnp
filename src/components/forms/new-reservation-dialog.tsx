"use client";

import { useState } from "react";
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
import { Platform } from "@/types";
import { Calendar } from "lucide-react";

export function NewReservationDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    guestFirstName: "",
    guestLastName: "",
    guestEmail: "",
    guestPhone: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
    platform: Platform.DIRECT,
    totalPrice: "",
    depositAmount: "500",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simuler l'ajout de la réservation
    console.log("Nouvelle réservation:", formData);

    // Réinitialiser le formulaire
    setFormData({
      guestFirstName: "",
      guestLastName: "",
      guestEmail: "",
      guestPhone: "",
      checkIn: "",
      checkOut: "",
      guests: "2",
      platform: Platform.DIRECT,
      totalPrice: "",
      depositAmount: "500",
    });

    setOpen(false);
    onSuccess?.();

    // Afficher un message de confirmation
    alert(
      `Réservation pour ${formData.guestFirstName} ${formData.guestLastName} créée avec succès!`
    );
  };

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
              Créer une réservation directe pour votre mobil-home
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="firstName">Prénom *</Label>
                <Input
                  id="firstName"
                  value={formData.guestFirstName}
                  onChange={(e) =>
                    setFormData({ ...formData, guestFirstName: e.target.value })
                  }
                  placeholder="Marie"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={formData.guestLastName}
                  onChange={(e) =>
                    setFormData({ ...formData, guestLastName: e.target.value })
                  }
                  placeholder="Dupont"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.guestEmail}
                onChange={(e) =>
                  setFormData({ ...formData, guestEmail: e.target.value })
                }
                placeholder="marie.dupont@email.fr"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.guestPhone}
                onChange={(e) =>
                  setFormData({ ...formData, guestPhone: e.target.value })
                }
                placeholder="+33 6 12 34 56 78"
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="checkIn">Date d&apos;arrivée *</Label>
                <Input
                  id="checkIn"
                  type="date"
                  value={formData.checkIn}
                  onChange={(e) =>
                    setFormData({ ...formData, checkIn: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="checkOut">Date de départ *</Label>
                <Input
                  id="checkOut"
                  type="date"
                  value={formData.checkOut}
                  onChange={(e) =>
                    setFormData({ ...formData, checkOut: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="guests">Nombre de voyageurs *</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.guests}
                  onChange={(e) =>
                    setFormData({ ...formData, guests: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="platform">Plateforme *</Label>
                <Select
                  value={formData.platform}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      platform: value as Platform,
                    })
                  }
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
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="totalPrice">Prix total (€) *</Label>
                <Input
                  id="totalPrice"
                  type="number"
                  step="0.01"
                  value={formData.totalPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, totalPrice: e.target.value })
                  }
                  placeholder="840.00"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="depositAmount">Caution (€) *</Label>
                <Input
                  id="depositAmount"
                  type="number"
                  step="0.01"
                  value={formData.depositAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, depositAmount: e.target.value })
                  }
                  placeholder="500.00"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">Créer la réservation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
