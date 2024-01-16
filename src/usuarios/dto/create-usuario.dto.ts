import { $Enums } from "@prisma/client"
import { IsBoolean, IsEmail, IsEnum, IsString, Length, Matches, MinLength } from "class-validator"

export class CreateUsuarioDto {
    @MinLength(10, { message: "Nome tem de ter ao menos 10 caracteres."})
    @IsString({ message: "Tem de ser texto."})
    nome: string

    @IsString({ message: "Login inválido!"})
    @MinLength(7, { message: "Login tem de ter ao menos 7 caracteres."})
    login: string

    @IsEnum($Enums.Permissao, { message: "Escolha uma permissão válida."})
    permissao?: $Enums.Permissao

    @IsEnum($Enums.Status, { message: "Escolha um status válido."})
    status?: $Enums.Status
}
