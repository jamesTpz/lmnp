"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInventory, useInventoryChecks } from "@/hooks/useData";
import {
  ClipboardCheck,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface InventoryCheckFormProps {
  mobileHomeId: string;
  mobileHomeName: string;
  reservationId?: string;
  checkType: "CHECK_IN" | "CHECK_OUT";
  onSuccess?: () => void;
}

const CONDITION_OPTIONS = [
  { value: "EXCELLENT", label: "Excellent", color: "text-green-600" },
  { value: "GOOD", label: "Bon", color: "text-blue-600" },
  { value: "FAIR", label: "Acceptable", color: "text-yellow-600" },
  { value: "POOR", label: "Mauvais", color: "text-orange-600" },
  { value: "MISSING", label: "Manquant", color: "text-red-600" },
];

export function InventoryCheckForm({
  mobileHomeId,
  mobileHomeName,
  reservationId,
  checkType,
  onSuccess,
}: InventoryCheckFormProps) {
  const { inventoryItems, loading: loadingInventory } = useInventory(mobileHomeId);
  const { createInventoryCheck } = useInventoryChecks(mobileHomeId, reservationId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [performedBy, setPerformedBy] = useState("");
  const [globalNotes, setGlobalNotes] = useState("");

  // Initialize item conditions
  const [itemConditions, setItemConditions] = useState<
    Record<
      string,
      {
        condition: string;
        notes: string;
      }
    >
  >({});

  useEffect(() => {
    if (inventoryItems.length > 0) {
      const initialConditions: Record<string, { condition: string; notes: string }> = {};
      inventoryItems.forEach((item) => {
        initialConditions[item.id] = {
          condition: "GOOD",
          notes: "",
        };
      });
      setItemConditions(initialConditions);
    }
  }, [inventoryItems]);

  const handleOpenDialog = () => {
    setError(null);
    setPerformedBy("");
    setGlobalNotes("");
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!performedBy.trim()) {
      setError("Le nom de la personne effectuant le contrôle est requis");
      return;
    }

    if (inventoryItems.length === 0) {
      setError("Aucun article dans l'inventaire. Ajoutez des articles avant de créer un état des lieux.");
      return;
    }

    setSubmitting(true);

    try {
      const items = inventoryItems.map((item) => ({
        inventoryItemId: item.id,
        name: item.name,
        condition: itemConditions[item.id]?.condition || "GOOD",
        notes: itemConditions[item.id]?.notes || "",
        photos: null,
      }));

      await createInventoryCheck({
        mobileHomeId,
        reservationId: reservationId || null,
        checkType,
        performedBy: performedBy.trim(),
        notes: globalNotes.trim() || null,
        items,
      });

      handleCloseDialog();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création de l'état des lieux");
    } finally {
      setSubmitting(false);
    }
  };

  const updateItemCondition = (itemId: string, field: "condition" | "notes", value: string) => {
    setItemConditions((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  };

  const checkTypeLabel = checkType === "CHECK_IN" ? "Entrée" : "Sortie";

  if (loadingInventory) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Chargement...
      </Button>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={handleOpenDialog}
          variant={checkType === "CHECK_IN" ? "default" : "secondary"}
        >
          <ClipboardCheck className="mr-2 h-4 w-4" />
          État Lieux {checkTypeLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            État des Lieux - {checkTypeLabel}
          </DialogTitle>
          <DialogDescription>
            {mobileHomeName} - {inventoryItems.length} article{inventoryItems.length > 1 ? "s" : ""} à vérifier
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-600 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {inventoryItems.length === 0 ? (
            <div className="rounded-md bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
              <p className="font-medium mb-1">Aucun article dans l'inventaire</p>
              <p>
                Ajoutez des articles à l'inventaire du mobile home avant de créer un état des lieux.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="performedBy">Effectué par *</Label>
                <Input
                  id="performedBy"
                  value={performedBy}
                  onChange={(e) => setPerformedBy(e.target.value)}
                  required
                  placeholder="Nom de la personne"
                />
              </div>

              <div className="space-y-4">
                <Label>Vérification des articles</Label>
                <div className="space-y-3">
                  {inventoryItems.map((item) => (
                    <Card key={item.id} className="border-2">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center justify-between">
                          <span>
                            {item.name}
                            <Badge variant="outline" className="ml-2">
                              {item.category}
                            </Badge>
                          </span>
                          <Badge variant="secondary">x{item.quantity}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor={`condition-${item.id}`} className="text-xs">
                            État
                          </Label>
                          <Select
                            value={itemConditions[item.id]?.condition || "GOOD"}
                            onValueChange={(value) =>
                              updateItemCondition(item.id, "condition", value)
                            }
                          >
                            <SelectTrigger id={`condition-${item.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CONDITION_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <span className={option.color}>
                                    {option.label}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`notes-${item.id}`} className="text-xs">
                            Notes (optionnel)
                          </Label>
                          <Input
                            id={`notes-${item.id}`}
                            value={itemConditions[item.id]?.notes || ""}
                            onChange={(e) =>
                              updateItemCondition(item.id, "notes", e.target.value)
                            }
                            placeholder="Observations particulières"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="globalNotes">Notes générales (optionnel)</Label>
                <Textarea
                  id="globalNotes"
                  value={globalNotes}
                  onChange={(e) => setGlobalNotes(e.target.value)}
                  placeholder="Observations générales sur l'état des lieux"
                  rows={3}
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseDialog}
              className="flex-1"
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={submitting || inventoryItems.length === 0}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Valider État des Lieux
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
