import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

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
}
