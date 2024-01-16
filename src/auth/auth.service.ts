import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { Usuario } from '@prisma/client';
import { UsuarioPayload } from './models/UsuarioPayload';
import { JwtService } from '@nestjs/jwt';
import { UsuarioToken } from './models/UsuarioToken';
import { Client, createClient } from 'ldapjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly jwtService: JwtService,
    ) {}

    login(usuario: Usuario): UsuarioToken {
        const payload: UsuarioPayload = {
            sub: usuario.id,
            nome: usuario.nome,
            login: usuario.login
        };
        const access_token = this.jwtService.sign(payload);
        return { access_token }
    }

    async validateUser(login: string, senha: string) {
        const usuario = await this.usuariosService.buscarPorLogin(login);
        if (!usuario) throw new UnauthorizedException("Credenciais incorretas!");
        const client: Client = createClient({
            url: process.env.LDAP_SERVER,
        });
        await new Promise<void>((resolve, reject) => {
            client.bind(`${login}${process.env.LDAP_DOMAIN}`, senha, (err) => {
                if (err) reject(new UnauthorizedException("Credenciais incorretas!"));
                else resolve();
            });
        });
        return usuario;
    }
}
