import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FindOneProductDto } from './dto/find-one-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto, @Request() req) {
    return this.productsService.create(createProductDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params: FindOneProductDto) {
    return this.productsService.findOne(params.id);
  }

  @Patch(':id')
  async update(
    @Param() params: FindOneProductDto,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    console.log('🚀 ~ ProductsController ~ params:', params);
    return this.productsService.update(params.id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('Admin')
  async delete(@Param() params: FindOneProductDto) {
    return this.productsService.delete(params.id);
  }
}
