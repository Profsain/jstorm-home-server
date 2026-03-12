import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTestimonialDto {
  @ApiProperty({ example: 'Sarah M.', description: 'The name of the guest' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 5, description: 'Rating (1-5)' })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Absolutely stunning apartment!', description: 'The testimonial text' })
  @IsString()
  @IsNotEmpty()
  text: string;
}
