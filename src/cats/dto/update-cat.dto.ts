//import { IsInt, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

import { PartialType } from "@nestjs/mapped-types";
import { CreateCatDto } from "./create-cat.dto";

export class UpdateCatDto extends PartialType(CreateCatDto) {}

/* export class UpdateCatDto {
    @IsString()
    @MinLength(2)
    @IsOptional()
    name? : string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    age? : number;

    @IsString()
    @IsOptional()
    breed?: string;
} */
