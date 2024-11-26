import { IsMongoId } from 'class-validator';

export class FindOneProductDto {
  @IsMongoId({ message: 'The provided ID is not a valid MongoDB ObjectId' })
  id: string;
}
