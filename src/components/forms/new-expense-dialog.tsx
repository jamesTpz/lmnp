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
import { ExpenseCategory } from "@/types";
import { Plus } from "lucide-react";

export function NewExpenseDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: ExpenseCategory.OTHER,
    date: new Date().toISOString().split("T")[0],
    taxDeductible: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simuler l'ajout de la dépense
    console.log("Nouvelle dépense:", formData);

    // Réinitialiser le formulaire
    setFormData({
      description: "",
      amount: "",
      category: ExpenseCategory.OTHER,
      date: new Date().toISOString().split("T")[0],
      taxDeductible: true,
    });

    setOpen(false);
    onSuccess?.();

    // Afficher un message de confirmation
    alert(`Charge de ${formData.amount}€ enregistrée avec succès!`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Charge
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nouvelle Charge Déductible</DialogTitle>
            <DialogDescription>
              Enregistrez une nouvelle dépense pour votre déclaration fiscale LMNP
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Ex: Entretien climatisation"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Montant (€) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="120.00"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Catégorie *</Label>
              <select
                id="category"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as ExpenseCategory,
                  })
                }
                required
              >
                <option value={ExpenseCategory.PARCEL_RENT}>Loyer Parcelle</option>
                <option value={ExpenseCategory.INSURANCE}>Assurance</option>
                <option value={ExpenseCategory.MANAGEMENT_FEES}>
                  Frais de Gestion
                </option>
                <option value={ExpenseCategory.MAINTENANCE}>Entretien</option>
                <option value={ExpenseCategory.UTILITIES}>Services Publics</option>
                <option value={ExpenseCategory.CLEANING}>Ménage</option>
                <option value={ExpenseCategory.SUPPLIES}>Fournitures</option>
                <option value={ExpenseCategory.MARKETING}>Marketing</option>
                <option value={ExpenseCategory.OTHER}>Autres</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="taxDeductible"
                type="checkbox"
                checked={formData.taxDeductible}
                onChange={(e) =>
                  setFormData({ ...formData, taxDeductible: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="taxDeductible" className="cursor-pointer">
                Déductible fiscalement (BIC)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer la charge</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
