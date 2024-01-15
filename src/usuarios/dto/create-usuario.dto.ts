import { $Enums } from "@prisma/client"
import { IsBoolean, IsEmail, IsEnum, IsString, Length, Matches, MinLength } from "class-validator"

export class CreateUsuarioDto {
    @MinLength(10, { message: "Nome tem de ter ao menos 10 caracteres."})
    @IsString({ message: "Tem de ser texto."})
    nome: string

    @IsEmail({}, { message: "E-mail inválido!"})
    email: string

    @MinLength(6, { message: "Senha tem de ter ao menos 10 caracteres."})
    @IsString({ message: "Tem de ser texto."})
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: 'Senha muito fraca.',
    })
    senha: string

    @IsEnum($Enums.Permissao, { message: "Escolha uma permissão válida."})
    permissao?: $Enums.Permissao

    @IsBoolean({ message: "Status pode ser verdadeiro ou falso."})
    status?: boolean
}
