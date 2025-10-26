"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockInventoryItems } from "@/lib/mock-data";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Package, CheckCircle, FileText, Plus } from "lucide-react";

export function InventoryView() {
  const categories = Array.from(
    new Set(mockInventoryItems.map((item) => item.category))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inventaire & État des Lieux</h2>
          <p className="text-sm text-muted-foreground">
            Gestion digitalisée de l&apos;inventaire et des états des lieux
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Nouvel État des Lieux
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter Article
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockInventoryItems.reduce((sum, item) => sum + item.quantity, 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Catégories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {categories.length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Dernière Vérif.
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-semibold text-purple-600">
              {format(new Date("2025-06-01"), "dd MMM yyyy", { locale: fr })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory by Category */}
      {categories.map((category) => {
        const categoryItems = mockInventoryItems.filter(
          (item) => item.category === category
        );

        return (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                {category}
                <Badge variant="outline" className="ml-auto">
                  {categoryItems.length} article
                  {categoryItems.length > 1 ? "s" : ""}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.condition && (
                          <p className="text-sm text-muted-foreground">
                            État: {item.condition}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          Quantité: {item.quantity}
                        </p>
                        {item.lastChecked && (
                          <p className="text-xs text-muted-foreground">
                            Vérifié:{" "}
                            {format(item.lastChecked, "dd/MM/yyyy", {
                              locale: fr,
                            })}
                          </p>
                        )}
                      </div>
                      <Button size="sm" variant="default">
                        Modifier
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Digital Checklist Feature */}
      <Card className="border-2 border-black bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-">
            <FileText className="h-5 w-5" />
            États des Lieux Digitalisés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-foreground">
            Créez des formulaires d&apos;état des lieux numériques pour simplifier
            les check-in et check-out. Signature électronique disponible.
          </p>
          <div className="grid gap-2 md:grid-cols-2">
            <Button className="bg-black hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              État des Lieux d&apos;Entrée
            </Button>
            <Button variant="outline" className="border-blue-300">
              <Plus className="mr-2 h-4 w-4" />
              État des Lieux de Sortie
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
