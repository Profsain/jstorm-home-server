import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('testimonials')
@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new testimonial' })
  @ApiResponse({ status: 201, description: 'The testimonial has been successfully created.' })
  create(@Body() createTestimonialDto: CreateTestimonialDto) {
    return this.testimonialsService.create(createTestimonialDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all testimonials' })
  @ApiResponse({ status: 200, description: 'Return all testimonials.' })
  findAll() {
    return this.testimonialsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a testimonial by id' })
  @ApiResponse({ status: 200, description: 'Return the testimonial.' })
  @ApiResponse({ status: 404, description: 'Testimonial not found.' })
  findOne(@Param('id') id: string) {
    return this.testimonialsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a testimonial' })
  @ApiResponse({ status: 200, description: 'The testimonial has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Testimonial not found.' })
  update(@Param('id') id: string, @Body() updateTestimonialDto: UpdateTestimonialDto) {
    return this.testimonialsService.update(id, updateTestimonialDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a testimonial' })
  @ApiResponse({ status: 200, description: 'The testimonial has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Testimonial not found.' })
  remove(@Param('id') id: string) {
    return this.testimonialsService.remove(id);
  }
}
