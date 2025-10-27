"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExpenseCategory } from "@/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Receipt,
  Plus,
  Download,
  TrendingDown,
  FileText,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { groupExpensesByCategory } from "@/lib/calculations";
import { NewExpenseDialog } from "@/components/forms/new-expense-dialog";
import { useExpenses } from "@/hooks/useData";

const categoryLabels: Record<ExpenseCategory, string> = {
  [ExpenseCategory.PARCEL_RENT]: "Loyer Parcelle",
  [ExpenseCategory.INSURANCE]: "Assurance",
  [ExpenseCategory.MANAGEMENT_FEES]: "Frais de Gestion",
  [ExpenseCategory.MAINTENANCE]: "Entretien",
  [ExpenseCategory.UTILITIES]: "Services Publics",
  [ExpenseCategory.CLEANING]: "Ménage",
  [ExpenseCategory.SUPPLIES]: "Fournitures",
  [ExpenseCategory.MARKETING]: "Marketing",
  [ExpenseCategory.OTHER]: "Autres",
};

const categoryColors: Record<ExpenseCategory, string> = {
  [ExpenseCategory.PARCEL_RENT]: "bg-red-100 text-red-800",
  [ExpenseCategory.INSURANCE]: "bg-blue-100 text-blue-800",
  [ExpenseCategory.MANAGEMENT_FEES]: "bg-purple-100 text-purple-800",
  [ExpenseCategory.MAINTENANCE]: "bg-orange-100 text-orange-800",
  [ExpenseCategory.UTILITIES]: "bg-green-100 text-green-800",
  [ExpenseCategory.CLEANING]: "bg-yellow-100 text-yellow-800",
  [ExpenseCategory.SUPPLIES]: "bg-pink-100 text-pink-800",
  [ExpenseCategory.MARKETING]: "bg-indigo-100 text-indigo-800",
  [ExpenseCategory.OTHER]: "bg-gray-100 text-gray-800",
};

export function ExpensesView() {
  const { expenses, loading } = useExpenses();

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const deductibleExpenses = expenses
    .filter((e) => e.taxDeductible)
    .reduce((sum, e) => sum + e.amount, 0);
  const groupedExpenses = groupExpensesByCategory(expenses);

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
          <h2 className="text-2xl font-bold">Charges & Fiscalité LMNP</h2>
          <p className="text-sm text-muted-foreground">
            Suivi des charges déductibles pour votre déclaration BIC
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => alert("Export fiscal: Fonctionnalité à venir. Les données seront exportées au format Excel pour votre expert-comptable.")}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Fiscal
          </Button>
          <NewExpenseDialog />
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Charges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {totalExpenses.toLocaleString("fr-FR")} €
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {expenses.length} dépenses
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Charges Déductibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {deductibleExpenses.toLocaleString("fr-FR")} €
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Régime Réel Simplifié
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Catégories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {Object.keys(groupedExpenses).length}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Types de dépenses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Expenses by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-blue-600" />
            Répartition par Catégorie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(groupedExpenses).map(([category, data]) => (
              <div
                key={category}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`rounded-lg px-3 py-1 text-sm font-medium ${
                      categoryColors[category as ExpenseCategory]
                    }`}
                  >
                    {categoryLabels[category as ExpenseCategory]}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{data.total.toLocaleString("fr-FR")} €</p>
                  <p className="text-xs text-muted-foreground">
                    {data.count} dépense{data.count > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-blue-600" />
            Historique des Charges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockExpenses
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-slate-50"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 rounded-lg px-2 py-1 text-xs font-medium ${
                        categoryColors[expense.category]
                      }`}
                    >
                      {categoryLabels[expense.category]}
                    </div>
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(expense.date, "dd MMMM yyyy", { locale: fr })}
                      </p>
                      {expense.notes && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {expense.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {expense.amount.toLocaleString("fr-FR")} €
                      </p>
                      {expense.taxDeductible && (
                        <Badge variant="success" className="mt-1">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Déductible
                        </Badge>
                      )}
                    </div>
                    {expense.invoiceUrl && (
                      <Button size="sm" variant="outline">
                        <FileText className="mr-2 h-3 w-3" />
                        Facture
                      </Button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Tax Info Card */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <FileText className="h-5 w-5" />
            Aide à la Déclaration LMNP
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-blue-800">
            Vos charges sont automatiquement catégorisées pour faciliter votre
            déclaration au Régime Réel Simplifié (BIC). Les charges déductibles
            comprennent:
          </p>
          <ul className="ml-4 list-disc space-y-1 text-sm text-blue-700">
            <li>Loyer de parcelle et charges de copropriété</li>
            <li>Primes d&apos;assurance</li>
            <li>Frais de gestion et d&apos;entretien</li>
            <li>Travaux de réparation et d&apos;amélioration</li>
            <li>Intérêts d&apos;emprunt (si applicable)</li>
          </ul>
          <Button className="mt-3 bg-blue-600 hover:bg-blue-700">
            <Download className="mr-2 h-4 w-4" />
            Générer Rapport Fiscal 2025
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
