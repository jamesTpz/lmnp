import { Platform, ChannelCalendar } from "@/types";

export interface SyncResult {
  success: boolean;
  platform: Platform;
  syncedDates: number;
  message: string;
  timestamp: Date;
}

export interface CalendarUpdate {
  date: Date;
  available: boolean;
  price: number;
  minimumStay?: number;
}

/**
 * Simulates synchronization with external booking platforms (Airbnb, Booking.com, etc.)
 * In a real implementation, this would call the actual platform APIs
 */
export class ChannelManagerService {
  /**
   * Synchronizes availability and pricing across all platforms
   */
  async syncAllPlatforms(
    mobileHomeId: string,
    calendars: CalendarUpdate[]
  ): Promise<SyncResult[]> {
    const platforms = [Platform.AIRBNB, Platform.BOOKING, Platform.VRBO];
    const results: SyncResult[] = [];

    for (const platform of platforms) {
      // Simulate API call delay
      await this.delay(500);

      const result = await this.syncPlatform(mobileHomeId, platform, calendars);
      results.push(result);
    }

    return results;
  }

  /**
   * Synchronizes with a specific platform
   */
  async syncPlatform(
    mobileHomeId: string,
    platform: Platform,
    calendars: CalendarUpdate[]
  ): Promise<SyncResult> {
    // Simulate API call
    await this.delay(300);

    // Simulate 95% success rate
    const success = Math.random() > 0.05;

    if (success) {
      return {
        success: true,
        platform,
        syncedDates: calendars.length,
        message: `Synchronisation réussie avec ${this.getPlatformName(platform)}`,
        timestamp: new Date(),
      };
    } else {
      return {
        success: false,
        platform,
        syncedDates: 0,
        message: `Échec de la synchronisation avec ${this.getPlatformName(platform)}. Réessayez.`,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Blocks dates across all platforms (for reservations)
   */
  async blockDates(
    mobileHomeId: string,
    startDate: Date,
    endDate: Date,
    platforms: Platform[]
  ): Promise<SyncResult[]> {
    const results: SyncResult[] = [];
    const dates = this.getDateRange(startDate, endDate);

    for (const platform of platforms) {
      await this.delay(300);

      results.push({
        success: true,
        platform,
        syncedDates: dates.length,
        message: `${dates.length} dates bloquées sur ${this.getPlatformName(platform)}`,
        timestamp: new Date(),
      });
    }

    return results;
  }

  /**
   * Updates pricing across all platforms
   */
  async updatePricing(
    mobileHomeId: string,
    startDate: Date,
    endDate: Date,
    newPrice: number,
    platforms: Platform[]
  ): Promise<SyncResult[]> {
    const results: SyncResult[] = [];
    const dates = this.getDateRange(startDate, endDate);

    for (const platform of platforms) {
      await this.delay(300);

      results.push({
        success: true,
        platform,
        syncedDates: dates.length,
        message: `Prix mis à jour (${newPrice}€/nuit) sur ${this.getPlatformName(platform)}`,
        timestamp: new Date(),
      });
    }

    return results;
  }

  /**
   * Pulls reservations from all platforms
   * In a real implementation, this would fetch actual bookings from each platform
   */
  async pullReservations(
    mobileHomeId: string,
    platforms: Platform[]
  ): Promise<{ platform: Platform; count: number }[]> {
    const results: { platform: Platform; count: number }[] = [];

    for (const platform of platforms) {
      await this.delay(500);

      // Simulate random number of new reservations (0-2)
      const count = Math.floor(Math.random() * 3);

      results.push({ platform, count });
    }

    return results;
  }

  /**
   * Checks for synchronization conflicts (double bookings)
   */
  async checkConflicts(
    mobileHomeId: string
  ): Promise<{ hasConflicts: boolean; conflicts: any[] }> {
    await this.delay(400);

    // Simulate - in real implementation, check for overlapping dates across platforms
    return {
      hasConflicts: false,
      conflicts: [],
    };
  }

  // Helper methods

  private getPlatformName(platform: Platform): string {
    const names: Record<Platform, string> = {
      [Platform.AIRBNB]: "Airbnb",
      [Platform.BOOKING]: "Booking.com",
      [Platform.VRBO]: "Vrbo",
      [Platform.DIRECT]: "Site Direct",
      [Platform.OTHER]: "Autre plateforme",
    };
    return names[platform];
  }

  private getDateRange(startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const channelManager = new ChannelManagerService();
