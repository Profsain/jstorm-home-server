import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('properties')
@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PROPERTIES_MANAGER)
  @ApiOperation({ summary: 'Create a new property' })
  @ApiResponse({ status: 201, description: 'The property has been successfully created.' })
  create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(createPropertyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all properties' })
  @ApiResponse({ status: 200, description: 'Return all properties.' })
  findAll(@Query('type') type?: string) {
    return this.propertiesService.findAll(type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a property by id' })
  @ApiResponse({ status: 200, description: 'Return the property.' })
  @ApiResponse({ status: 404, description: 'Property not found.' })
  findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PROPERTIES_MANAGER)
  @ApiOperation({ summary: 'Update a property by id' })
  @ApiResponse({ status: 200, description: 'The property has been successfully updated.' })
  update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto) {
    return this.propertiesService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PROPERTIES_MANAGER)
  @ApiOperation({ summary: 'Delete a property by id' })
  @ApiResponse({ status: 200, description: 'The property has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.propertiesService.remove(id);
  }

  @Post(':id/upload-images')
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PROPERTIES_MANAGER)
  @UseInterceptors(FilesInterceptor('images', 20)) // Increased limit to 20
  @ApiOperation({ summary: 'Upload images for a property' })
  @ApiResponse({ status: 200, description: 'Images uploaded successfully.' })
  async uploadImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log(`Starting image upload for property ID: ${id}`);
    console.log(`Number of files received: ${files?.length || 0}`);
    
    if (!files || files.length === 0) {
      console.warn('No files were uploaded');
      return this.propertiesService.findOne(id);
    }

    try {
      // Upload files to Cloudinary in parallel
      const uploadPromises = files.map(file => this.cloudinaryService.uploadFile(file));
      const uploadResults = await Promise.all(uploadPromises);
      
      // Extract the secure URLs from Cloudinary results
      const filePaths = uploadResults.map((result: any) => result.secure_url);

      const updatedProperty = await this.propertiesService.addImages(id, filePaths);
      console.log(`Successfully updated property ${id} with ${filePaths.length} new images on Cloudinary`);
      return updatedProperty;
    } catch (error) {
      console.error(`Error adding images to property ${id}:`, error.message);
      throw error;
    }
  }
}
