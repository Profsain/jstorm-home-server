import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PropertyType } from '../schemas/property.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Beachfront Villa', description: 'The name of the property' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: PropertyType, description: 'Type of property' })
  @IsEnum(PropertyType)
  type: PropertyType;

  @ApiProperty({ example: 'Lagos, Nigeria', description: 'Location of the property' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 500000, description: 'Price of the property' })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'per night', description: 'Label for price', required: false })
  @IsString()
  @IsOptional()
  priceLabel?: string;

  @ApiProperty({ example: 3, description: 'Number of bedrooms', required: false })
  @IsNumber()
  @IsOptional()
  bedrooms?: number;

  @ApiProperty({ example: 2, description: 'Number of bathrooms', required: false })
  @IsNumber()
  @IsOptional()
  bathrooms?: number;

  @ApiProperty({ example: 6, description: 'Maximum guests allowed', required: false })
  @IsNumber()
  @IsOptional()
  guests?: number;

  @ApiProperty({ example: 4.5, description: 'Rating of the property', required: false })
  @IsNumber()
  @IsOptional()
  rating?: number;

  @ApiProperty({ example: 120, description: 'Number of reviews', required: false })
  @IsNumber()
  @IsOptional()
  reviews?: number;

  @ApiProperty({ example: 'Detailed description of the property', description: 'Description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Short description of the property', description: 'Short description' })
  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @ApiProperty({ example: ['WiFi', 'Pool'], description: 'List of amenities', required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @ApiProperty({ example: ['Garage', 'Garden'], description: 'List of features', required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @ApiProperty({ example: 1500, description: 'Square footage', required: false })
  @IsNumber()
  @IsOptional()
  sqft?: number;

  @ApiProperty({ example: ['url1', 'url2'], description: 'Property images', required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({ example: true, description: 'Availability status', required: false })
  @IsBoolean()
  @IsOptional()
  available?: boolean;
}
