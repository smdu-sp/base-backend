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
      login: usuario.login,
      email: usuario.email,
      permissao: usuario.permissao,
      status: usuario.status,
    };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }

  async validateUser(login: string, senha: string) {
    let usuario = await this.usuariosService.buscarPorLogin(login);
    if (usuario && usuario.status === 3)
      throw new UnauthorizedException(
        'Usuário aguardando aprovação de acesso ao sistema.',
      );
    if (usuario && usuario.status === 2)
      throw new UnauthorizedException('Usuário inativo.');
    if (process.env.ENVIRONMENT == 'local') {
      if (usuario) return usuario;
    }
    const client: Client = createClient({
      url: process.env.LDAP_SERVER,
    });
    await new Promise<void>((resolve, reject) => {
      client.bind(`${login}${process.env.LDAP_DOMAIN}`, senha, (err) => {
        if (err) {
          client.destroy();
          reject(new UnauthorizedException('Credenciais incorretas.'));
        }
        resolve();
      });
    });
    if (!usuario) {
      usuario = await new Promise<any>((resolve, reject) => {
        client.search(
          process.env.LDAP_BASE,
          {
            filter: `(&(samaccountname=${login})(company=SMUL))`,
            scope: 'sub',
            attributes: ['name', 'mail'],
          },
          (err, res) => {
            if (err) {
              client.destroy();
              reject();
            }
            res.on('searchEntry', async (entry) => {
              const nome = JSON.stringify(
                entry.pojo.attributes[0].values[0],
              ).replaceAll('"', '');
              const email = JSON.stringify(
                entry.pojo.attributes[1].values[0],
              ).replaceAll('"', '');
              const novoUsuario = await this.usuariosService.criar({
                nome,
                login,
                email,
                permissao: 'USR',
                status: 1,
              });
              client.destroy();
              if (novoUsuario)
                resolve(this.usuariosService.buscarPorLogin(novoUsuario.login));
              reject(
                new UnauthorizedException(
                  'Não foi possível fazer login no momento.',
                ),
              );
            });
          },
        );
      });
    }
    client.destroy();
    return usuario;
  }
}
