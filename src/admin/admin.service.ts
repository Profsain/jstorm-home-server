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
    
    // Revenue calculation based on populated propertyId price
    const totalRevenue = allBookings.reduce((acc, b: any) => {
      const price = b.propertyId?.price || 0;
      return acc + price;
    }, 0);

    // Monthly bookings for the last 6 months
    const monthlyBookings = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      
      const count = allBookings.filter(b => {
        const bDate = new Date((b as any).createdAt);
        return bDate.getMonth() === date.getMonth() && bDate.getFullYear() === date.getFullYear();
      }).length;
      
      monthlyBookings.push({ month: `${month} ${year}`, count });
    }

    return {
      totalBookings: allBookings.length,
      propertiesForSale: forSale,
      shortlets: shortlets,
      monthlyRevenue: totalRevenue,
      totalUsers: allUsers.length,
      monthlyBookings,
    };
  }
}
