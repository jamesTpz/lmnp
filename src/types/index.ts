// Type definitions for LMNP-Serenity Application

export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CHECKED_IN = "CHECKED_IN",
  CHECKED_OUT = "CHECKED_OUT",
  CANCELLED = "CANCELLED",
}

export enum TaskType {
  CLEANING = "CLEANING",
  MAINTENANCE = "MAINTENANCE",
  INVENTORY_CHECK = "INVENTORY_CHECK",
  DEPOSIT_VERIFICATION = "DEPOSIT_VERIFICATION",
}

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum DepositStatus {
  AWAITING = "AWAITING",
  RECEIVED = "RECEIVED",
  HELD = "HELD",
  PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
  FULLY_REFUNDED = "FULLY_REFUNDED",
}

export enum Platform {
  DIRECT = "DIRECT",
  AIRBNB = "AIRBNB",
  BOOKING = "BOOKING",
  VRBO = "VRBO",
  OTHER = "OTHER",
}

export enum ExpenseCategory {
  PARCEL_RENT = "PARCEL_RENT",
  INSURANCE = "INSURANCE",
  MANAGEMENT_FEES = "MANAGEMENT_FEES",
  MAINTENANCE = "MAINTENANCE",
  UTILITIES = "UTILITIES",
  CLEANING = "CLEANING",
  SUPPLIES = "SUPPLIES",
  MARKETING = "MARKETING",
  OTHER = "OTHER",
}

// Core Data Models

export interface MobileHome {
  id: string;
  name: string;
  description?: string;
  location: string;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  photos: string[];
  basePrice: number; // Price per night in euros
  createdAt: Date;
  updatedAt: Date;
}

export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  identityDocument?: string; // Reference to uploaded ID
  createdAt: Date;
}

export interface Reservation {
  id: string;
  mobileHomeId: string;
  tenantId: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  totalPrice: number;
  platformFee?: number;
  netRevenue: number;
  status: ReservationStatus;
  platform: Platform;
  depositAmount: number;
  depositStatus: DepositStatus;
  depositReceivedDate?: Date;
  depositRefundedDate?: Date;
  depositDeductions?: DepositDeduction[];
  notes?: string;
  confirmationSent: boolean;
  arrivalInstructionsSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DepositDeduction {
  id: string;
  description: string;
  amount: number;
  invoiceUrl?: string;
  createdAt: Date;
}

export interface OperationalTask {
  id: string;
  mobileHomeId: string;
  reservationId?: string;
  type: TaskType;
  title: string;
  description?: string;
  assignedTo?: string; // Partner or team member
  dueDate: Date;
  status: TaskStatus;
  completedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryItem {
  id: string;
  mobileHomeId: string;
  name: string;
  category: string;
  quantity: number;
  condition?: string;
  photos?: string[];
  lastChecked?: Date;
}

export interface InventoryCheck {
  id: string;
  mobileHomeId: string;
  reservationId?: string;
  checkType: "CHECK_IN" | "CHECK_OUT";
  items: InventoryCheckItem[];
  performedBy: string;
  performedAt: Date;
  notes?: string;
  signatureUrl?: string;
}

export interface InventoryCheckItem {
  inventoryItemId: string;
  name: string;
  condition: "EXCELLENT" | "GOOD" | "FAIR" | "POOR" | "MISSING";
  notes?: string;
  photos?: string[];
}

export interface Expense {
  id: string;
  mobileHomeId?: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: Date;
  invoiceUrl?: string;
  taxDeductible: boolean;
  notes?: string;
  createdAt: Date;
}

export interface ChannelCalendar {
  mobileHomeId: string;
  date: Date;
  available: boolean;
  price: number;
  minimumStay?: number;
  syncedPlatforms: Platform[];
  lastSyncedAt: Date;
}

// Dashboard Statistics
export interface DashboardStats {
  totalRevenue: number;
  totalReservations: number;
  occupancyRate: number;
  averageNightlyRate: number;
  pendingTasks: number;
  upcomingCheckIns: number;
  depositsHeld: number;
  monthlyExpenses: number;
}
