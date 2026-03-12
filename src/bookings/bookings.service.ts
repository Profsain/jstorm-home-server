import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingsService {
  constructor(@InjectModel(Booking.name) private bookingModel: Model<Booking>) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const newBooking = new this.bookingModel(createBookingDto);
    return newBooking.save();
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingModel.find().populate('propertyId').exec();
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingModel.findById(id).populate('propertyId').exec();
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const updatedBooking = await this.bookingModel
      .findByIdAndUpdate(id, updateBookingDto, { new: true })
      .exec();
    if (!updatedBooking) throw new NotFoundException('Booking not found');
    return updatedBooking;
  }

  async remove(id: string): Promise<Booking> {
    const deletedBooking = await this.bookingModel.findByIdAndDelete(id).exec();
    if (!deletedBooking) throw new NotFoundException('Booking not found');
    return deletedBooking;
  }
}
