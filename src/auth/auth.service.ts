import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import * as argon from 'argon2';
import { Usuario } from '@prisma/client';
import { UsuarioPayload } from './models/UsuarioPayload';
import { JwtService } from '@nestjs/jwt';
import { UsuarioToken } from './models/UsuarioToken';

@Injectable()
export class AuthService {
    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly jwtService: JwtService,
    ) {}

    login(usuario: Usuario): UsuarioToken {
        const payload: UsuarioPayload = {
            sub: usuario.id,
            email: usuario.email,
            nome: usuario.nome
        };
        const access_token = this.jwtService.sign(payload);
        return { access_token }
    }

    async validateUser(email: string, password: string) {
        const usuario = await this.usuariosService.buscarPorEmail(email);
        if (usuario && usuario.status){
            const verificaSenha = await argon.verify(usuario.senha, password);
            if (verificaSenha) {
                return {
                    ...usuario,
                    senha: undefined
                };
            }
        }
        throw new UnauthorizedException("Credenciais incorretas!");
    }
}
