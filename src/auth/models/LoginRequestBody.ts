import { IsEmail, IsString } from 'class-validator';

export class LoginRequestBody {
  @IsEmail({}, { message: "Email inválido." })
  email: string;

  @IsString({ message: "A senha precisa ser um texto." })
  senha: string;
}
