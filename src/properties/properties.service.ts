import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Property } from './schemas/property.schema';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';

@Injectable()
export class PropertiesService {
  constructor(@InjectModel(Property.name) private propertyModel: Model<Property>) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    const newProperty = new this.propertyModel(createPropertyDto);
    return newProperty.save();
  }

  async findAll(type?: string): Promise<Property[]> {
    const filter = type ? { type } : {};
    return this.propertyModel.find(filter).exec();
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertyModel.findById(id).exec();
    if (!property) throw new NotFoundException('Property not found');
    return property;
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<Property> {
    const updatedProperty = await this.propertyModel
      .findByIdAndUpdate(id, updatePropertyDto, { new: true })
      .exec();
    if (!updatedProperty) throw new NotFoundException('Property not found');
    return updatedProperty;
  }

  async remove(id: string) {
    const result = await this.propertyModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Property with ID "${id}" not found`);
    }
    return result;
  }

  async addImages(id: string, imagePaths: string[]) {
    const property = await this.propertyModel.findById(id).exec();
    if (!property) {
      throw new NotFoundException(`Property with ID "${id}" not found`);
    }
    property.images = [...(property.images || []), ...imagePaths];
    return property.save();
  }
}
