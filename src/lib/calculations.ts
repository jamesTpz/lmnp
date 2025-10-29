import { Reservation, Expense, DashboardStats, ReservationStatus } from "@/types";
import { differenceInDays, isWithinInterval, startOfMonth, endOfMonth } from "date-fns";

// Coerce runtime values to Date (API JSON renvoie des chaînes ISO)
function toDate(value: any): Date {
  return value instanceof Date ? value : new Date(value);
}

/**
 * Calculates dashboard statistics from reservations and expenses
 */
export function calculateDashboardStats(
  reservations: Reservation[],
  expenses: Expense[],
  mobileHomeId?: string
): DashboardStats {
  // Filter by mobile home if specified
  const filteredReservations = mobileHomeId
    ? reservations.filter((r) => r.mobileHomeId === mobileHomeId)
    : reservations;

  const filteredExpenses = mobileHomeId
    ? expenses.filter((e) => e.mobileHomeId === mobileHomeId)
    : expenses;

  // Calculate total revenue (only confirmed and completed reservations)
  const totalRevenue = filteredReservations
    .filter(
      (r) =>
        r.status === ReservationStatus.CONFIRMED ||
        r.status === ReservationStatus.CHECKED_IN ||
        r.status === ReservationStatus.CHECKED_OUT
    )
    .reduce((sum, r) => sum + r.netRevenue, 0);

  // Total number of reservations
  const totalReservations = filteredReservations.filter(
    (r) => r.status !== ReservationStatus.CANCELLED
  ).length;

  // Calculate occupancy rate (simplified - based on current year)
  const occupancyRate = calculateOccupancyRate(filteredReservations);

  // Calculate average nightly rate
  const averageNightlyRate = calculateAverageNightlyRate(filteredReservations);

  // Count upcoming check-ins (next 30 days)
  const upcomingCheckIns = countUpcomingCheckIns(filteredReservations, 30);

  // Calculate total deposits held
  const depositsHeld = filteredReservations
    .filter((r) => r.depositStatus === "HELD" || r.depositStatus === "RECEIVED")
    .reduce((sum, r) => sum + r.depositAmount, 0);

  // Calculate monthly expenses (current month)
  const monthlyExpenses = calculateMonthlyExpenses(filteredExpenses);

  return {
    totalRevenue,
    totalReservations,
    occupancyRate,
    averageNightlyRate,
    pendingTasks: 0, // Will be calculated from tasks
    upcomingCheckIns,
    depositsHeld,
    monthlyExpenses,
  };
}

/**
 * Calculates occupancy rate as percentage
 */
export function calculateOccupancyRate(reservations: Reservation[]): number {
  if (reservations.length === 0) return 0;

  const currentYear = new Date().getFullYear();
  const totalDaysInYear = 365;

  // Calculate total nights booked
  const bookedNights = reservations
    .filter(
      (r) =>
        r.status !== ReservationStatus.CANCELLED &&
        (toDate(r.checkInDate).getFullYear() === currentYear ||
          toDate(r.checkOutDate).getFullYear() === currentYear)
    )
    .reduce((sum, r) => {
      const nights = differenceInDays(toDate(r.checkOutDate), toDate(r.checkInDate));
      return sum + nights;
    }, 0);

  return Math.round((bookedNights / totalDaysInYear) * 100);
}

/**
 * Calculates average nightly rate
 */
export function calculateAverageNightlyRate(
  reservations: Reservation[]
): number {
  const validReservations = reservations.filter(
    (r) => r.status !== ReservationStatus.CANCELLED
  );

  if (validReservations.length === 0) return 0;

  const totalRevenue = validReservations.reduce((sum, r) => sum + r.totalPrice, 0);
  const totalNights = validReservations.reduce((sum, r) => {
    return sum + differenceInDays(toDate(r.checkOutDate), toDate(r.checkInDate));
  }, 0);

  return totalNights > 0 ? Math.round(totalRevenue / totalNights) : 0;
}

/**
 * Counts upcoming check-ins within specified days
 */
export function countUpcomingCheckIns(
  reservations: Reservation[],
  daysAhead: number
): number {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + daysAhead);

  return reservations.filter(
    (r) =>
      r.status === ReservationStatus.CONFIRMED &&
      toDate(r.checkInDate) >= now &&
      toDate(r.checkInDate) <= futureDate
  ).length;
}

/**
 * Calculates total expenses for current month
 */
export function calculateMonthlyExpenses(expenses: Expense[]): number {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  return expenses
    .filter((e) =>
      isWithinInterval(toDate(e.date), { start: monthStart, end: monthEnd })
    )
    .reduce((sum, e) => sum + e.amount, 0);
}

/**
 * Calculates net profit (revenue - expenses) for a period
 */
export function calculateNetProfit(
  reservations: Reservation[],
  expenses: Expense[],
  startDate?: Date,
  endDate?: Date
): number {
  let revenue = 0;
  let totalExpenses = 0;

  if (startDate && endDate) {
    revenue = reservations
      .filter(
        (r) =>
          r.status !== ReservationStatus.CANCELLED &&
          isWithinInterval(toDate(r.checkInDate), { start: startDate, end: endDate })
      )
      .reduce((sum, r) => sum + r.netRevenue, 0);

    totalExpenses = expenses
      .filter((e) => isWithinInterval(toDate(e.date), { start: startDate, end: endDate }))
      .reduce((sum, e) => sum + e.amount, 0);
  } else {
    revenue = reservations
      .filter((r) => r.status !== ReservationStatus.CANCELLED)
      .reduce((sum, r) => sum + r.netRevenue, 0);

    totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  }

  return revenue - totalExpenses;
}

/**
 * Groups expenses by category for tax reporting
 */
export function groupExpensesByCategory(
  expenses: Expense[]
): Record<string, { total: number; count: number }> {
  return expenses.reduce(
    (acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = { total: 0, count: 0 };
      }
      acc[expense.category].total += expense.amount;
      acc[expense.category].count += 1;
      return acc;
    },
    {} as Record<string, { total: number; count: number }>
  );
}
