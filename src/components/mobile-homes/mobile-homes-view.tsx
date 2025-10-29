"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useMobileHomes } from "@/hooks/useData";
import { Home, MapPin, Users, Bed, Bath, Euro, Plus, Loader2, Edit, Trash2, AlertCircle, Package } from "lucide-react";
import { InventoryManagement } from "@/components/inventory/inventory-management";

export function MobileHomesView() {
  const { mobileHomes, loading, createMobileHome, updateMobileHome, deleteMobileHome } = useMobileHomes();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMobileHome, setSelectedMobileHome] = useState<any>(null);
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);
  const [inventoryMobileHome, setInventoryMobileHome] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    capacity: 4,
    bedrooms: 2,
    bathrooms: 1,
    basePrice: 0,
    amenities: [] as string[],
  });
  const [amenityInput, setAmenityInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      location: "",
      capacity: 4,
      bedrooms: 2,
      bathrooms: 1,
      basePrice: 0,
      amenities: [],
    });
    setAmenityInput("");
    setError(null);
    setIsEditMode(false);
    setSelectedMobileHome(null);
  };

  const handleOpenDialog = (mobileHome?: any) => {
    if (mobileHome) {
      setIsEditMode(true);
      setSelectedMobileHome(mobileHome);
      setFormData({
        name: mobileHome.name || "",
        description: mobileHome.description || "",
        location: mobileHome.location || "",
        capacity: mobileHome.capacity || 4,
        bedrooms: mobileHome.bedrooms || 2,
        bathrooms: mobileHome.bathrooms || 1,
        basePrice: mobileHome.basePrice || 0,
        amenities: mobileHome.amenities || [],
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTimeout(resetForm, 200);
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenityInput.trim()],
      });
      setAmenityInput("");
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((a) => a !== amenity),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (isEditMode && selectedMobileHome) {
        await updateMobileHome(selectedMobileHome.id, formData);
      } else {
        await createMobileHome(formData);
      }
      handleCloseDialog();
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'opération");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${name}" ?`)) {
      try {
        await deleteMobileHome(id);
      } catch (err: any) {
        alert(err.message || "Erreur lors de la suppression");
      }
    }
  };

  const handleOpenInventory = (mobileHome: any) => {
    setInventoryMobileHome(mobileHome);
    setIsInventoryDialogOpen(true);
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
          <h2 className="text-2xl font-bold">Mobile Homes</h2>
          <p className="text-sm text-muted-foreground">
            Gérez votre parc de mobile homes
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Mobile Home
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Modifier le mobile home" : "Nouveau mobile home"}
              </DialogTitle>
              <DialogDescription>
                {isEditMode
                  ? "Modifiez les informations du mobile home"
                  : "Ajoutez un nouveau mobile home à votre parc"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Mobile Home Premium Vue Mer"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Localisation *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ex: Camping Les Sables d'Or, Emplacement A23"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez votre mobile home..."
                  rows={3}
                  disabled={submitting}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacité (pers.) *</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    required
                    disabled={submitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Chambres *</Label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                    required
                    disabled={submitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Salles de bain *</Label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="0"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="basePrice">Prix de base (€/nuit) *</Label>
                <Input
                  id="basePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="space-y-2">
                <Label>Équipements</Label>
                <div className="flex gap-2">
                  <Input
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    placeholder="Ex: WiFi, Climatisation..."
                    disabled={submitting}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddAmenity();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddAmenity}
                    disabled={submitting}
                  >
                    Ajouter
                  </Button>
                </div>
                {formData.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.amenities.map((amenity, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleRemoveAmenity(amenity)}
                      >
                        {amenity} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  disabled={submitting}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? "Modification..." : "Création..."}
                    </>
                  ) : isEditMode ? (
                    "Modifier"
                  ) : (
                    "Créer"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {mobileHomes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Home className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun mobile home</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ajoutez votre premier mobile home pour commencer
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Mobile Home
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mobileHomes.map((mobileHome) => (
            <Card key={mobileHome.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Home className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{mobileHome.name}</CardTitle>
                      <div className="flex gap-2 mt-1">
                        {mobileHome._count?.reservations > 0 && (
                          <Badge variant="outline">
                            {mobileHome._count.reservations} réservation(s)
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{mobileHome.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{mobileHome.capacity} personnes</span>
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      <span>{mobileHome.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      <span>{mobileHome.bathrooms}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <Euro className="h-4 w-4" />
                    <span>{mobileHome.basePrice} €/nuit</span>
                  </div>
                </div>

                {mobileHome.amenities && mobileHome.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {mobileHome.amenities.slice(0, 3).map((amenity: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {mobileHome.amenities.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{mobileHome.amenities.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleOpenInventory(mobileHome)}
                  >
                    <Package className="mr-2 h-3 w-3" />
                    Gérer l'Inventaire
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenDialog(mobileHome)}
                    >
                      <Edit className="mr-2 h-3 w-3" />
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(mobileHome.id, mobileHome.name)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Inventory Management Dialog */}
      <Dialog open={isInventoryDialogOpen} onOpenChange={setIsInventoryDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Gestion de l'Inventaire
            </DialogTitle>
            <DialogDescription>
              Gérez l'inventaire complet de ce mobile home pour les états des lieux
            </DialogDescription>
          </DialogHeader>
          {inventoryMobileHome && (
            <InventoryManagement
              mobileHomeId={inventoryMobileHome.id}
              mobileHomeName={inventoryMobileHome.name}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
