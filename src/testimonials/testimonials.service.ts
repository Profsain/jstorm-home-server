import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial } from './schemas/testimonial.schema';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectModel(Testimonial.name) private testimonialModel: Model<Testimonial>,
  ) {}

  async create(createTestimonialDto: CreateTestimonialDto): Promise<Testimonial> {
    const createdTestimonial = new this.testimonialModel(createTestimonialDto);
    return createdTestimonial.save();
  }

  async findAll(): Promise<Testimonial[]> {
    return this.testimonialModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Testimonial> {
    const testimonial = await this.testimonialModel.findById(id).exec();
    if (!testimonial) {
      throw new NotFoundException(`Testimonial #${id} not found`);
    }
    return testimonial;
  }

  async update(id: string, updateTestimonialDto: UpdateTestimonialDto): Promise<Testimonial> {
    const existingTestimonial = await this.testimonialModel
      .findByIdAndUpdate(id, updateTestimonialDto, { new: true })
      .exec();
    if (!existingTestimonial) {
      throw new NotFoundException(`Testimonial #${id} not found`);
    }
    return existingTestimonial;
  }

  async remove(id: string): Promise<Testimonial> {
    const deletedTestimonial = await this.testimonialModel.findByIdAndDelete(id).exec();
    if (!deletedTestimonial) {
      throw new NotFoundException(`Testimonial #${id} not found`);
    }
    return deletedTestimonial;
  }
}
