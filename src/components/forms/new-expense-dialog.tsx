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
import { Checkbox } from "@/components/ui/checkbox";
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
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    category: value as ExpenseCategory,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ExpenseCategory.PARCEL_RENT}>Loyer Parcelle</SelectItem>
                  <SelectItem value={ExpenseCategory.INSURANCE}>Assurance</SelectItem>
                  <SelectItem value={ExpenseCategory.MANAGEMENT_FEES}>
                    Frais de Gestion
                  </SelectItem>
                  <SelectItem value={ExpenseCategory.MAINTENANCE}>Entretien</SelectItem>
                  <SelectItem value={ExpenseCategory.UTILITIES}>Services Publics</SelectItem>
                  <SelectItem value={ExpenseCategory.CLEANING}>Ménage</SelectItem>
                  <SelectItem value={ExpenseCategory.SUPPLIES}>Fournitures</SelectItem>
                  <SelectItem value={ExpenseCategory.MARKETING}>Marketing</SelectItem>
                  <SelectItem value={ExpenseCategory.OTHER}>Autres</SelectItem>
                </SelectContent>
              </Select>
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
              <Checkbox
                id="taxDeductible"
                checked={formData.taxDeductible}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, taxDeductible: checked === true })
                }
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
