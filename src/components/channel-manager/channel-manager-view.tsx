"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Platform } from "@/types";
import { channelManager, SyncResult } from "@/lib/channel-manager";
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  Globe,
  Zap,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function ChannelManagerView() {
  const [syncing, setSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<SyncResult[]>([]);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const platforms = [
    { platform: Platform.AIRBNB, name: "Airbnb", color: "bg-red-500" },
    { platform: Platform.BOOKING, name: "Booking.com", color: "bg-blue-600" },
    { platform: Platform.VRBO, name: "Vrbo", color: "bg-blue-800" },
  ];

  const handleSync = async () => {
    setSyncing(true);
    setSyncResults([]);

    try {
      // Simulate calendar data for next 90 days
      const calendars = [];
      const today = new Date();
      for (let i = 0; i < 90; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        calendars.push({
          date,
          available: Math.random() > 0.3, // 70% available
          price: 120,
          minimumStay: 3,
        });
      }

      const results = await channelManager.syncAllPlatforms("mh-1", calendars);
      setSyncResults(results);
      setLastSync(new Date());
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Channel Manager</h2>
          <p className="text-sm text-muted-foreground">
            Synchronisation omnicanal avec les plateformes de réservation
          </p>
        </div>
        <Button
          onClick={handleSync}
          disabled={syncing}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {syncing ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Synchronisation...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Synchroniser
            </>
          )}
        </Button>
      </div>

      {/* Info Banner */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-blue-600 p-3">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">
                Évitez les Doubles Réservations
              </h3>
              <p className="mt-1 text-sm text-blue-700">
                Le Channel Manager synchronise automatiquement vos disponibilités
                et tarifs sur toutes les plateformes en temps réel. Plus de risque
                de surboking!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Sync Info */}
      {lastSync && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Dernière synchronisation</p>
                  <p className="text-sm text-muted-foreground">
                    {format(lastSync, "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
                  </p>
                </div>
              </div>
              <Badge variant="success">Actif</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platform Status */}
      <div className="grid gap-4 md:grid-cols-3">
        {platforms.map(({ platform, name, color }) => (
          <Card key={platform} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${color}`} />
                  <CardTitle className="text-base">{name}</CardTitle>
                </div>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Connexion</span>
                  <Badge variant="success" className="text-xs">
                    Connecté
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sync auto</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sync Results */}
      {syncResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Résultats de la Synchronisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {syncResults.map((result) => (
                <div
                  key={result.platform}
                  className={`flex items-center justify-between rounded-lg border p-4 ${
                    result.success
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <p
                        className={`font-medium ${
                          result.success ? "text-green-900" : "text-red-900"
                        }`}
                      >
                        {result.message}
                      </p>
                      <p
                        className={`text-sm ${
                          result.success ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {result.syncedDates} dates synchronisées
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={result.success ? "success" : "destructive"}
                    className="text-xs"
                  >
                    {result.success ? "Succès" : "Échec"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
              Synchronisation du Calendrier
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Vos disponibilités sont automatiquement mises à jour sur toutes les
              plateformes lorsqu&apos;une réservation est effectuée.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Blocage automatique des dates réservées</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Détection des conflits de réservation</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Synchronisation bidirectionnelle</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
              Gestion des Tarifs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Définissez vos tarifs une seule fois et ils sont automatiquement
              appliqués sur toutes les plateformes.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Tarifs saisonniers automatisés</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Durée minimum de séjour</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Mise à jour instantanée</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button variant="outline" className="justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Bloquer des Dates
            </Button>
            <Button variant="outline" className="justify-start">
              <DollarSign className="mr-2 h-4 w-4" />
              Modifier les Prix
            </Button>
            <Button variant="outline" className="justify-start">
              <RefreshCw className="mr-2 h-4 w-4" />
              Importer Réservations
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
