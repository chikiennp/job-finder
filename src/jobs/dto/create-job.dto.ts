import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  salary: number;

  @IsArray()
  @IsString({ each: true })
  skill: string[];

  @IsString()
  postImage: string;
}
