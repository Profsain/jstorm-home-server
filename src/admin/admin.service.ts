import { Injectable } from '@nestjs/common';
import { PropertiesService } from '../properties/properties.service';
import { BookingsService } from '../bookings/bookings.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminService {
  constructor(
    private propertiesService: PropertiesService,
    private bookingsService: BookingsService,
    private usersService: UsersService,
  ) {}

  async getStats() {
    const [allProperties, allBookings, allUsers] = await Promise.all([
      this.propertiesService.findAll(),
      this.bookingsService.findAll(),
      this.usersService.findAll(),
    ]);

    const forSale = allProperties.filter((p) => p.type === 'sale').length;
    const shortlets = allProperties.filter((p) => p.type !== 'sale').length;
    const totalRevenue = allBookings.reduce((acc, b: any) => acc + (b.totalAmount || 0), 0);

    return {
      totalBookings: allBookings.length,
      propertiesForSale: forSale,
      shortlets: shortlets,
      monthlyRevenue: totalRevenue, // Simplification for now
      totalUsers: allUsers.length,
    };
  }
}
