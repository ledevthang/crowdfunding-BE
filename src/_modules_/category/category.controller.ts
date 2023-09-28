import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Auth } from 'decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './categoty.dto';

@Controller('categories')
@ApiTags('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  find() {
    return this.categoryService.find();
  }

  @Post()
  @Auth('ADMIN')
  create(@Body() { name }: CreateCategoryDto) {
    return this.categoryService.create(name);
  }
}
