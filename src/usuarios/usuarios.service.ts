import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Permissao, Usuario } from '@prisma/client';

@Injectable()
export class UsuariosService {
  constructor (
    private prisma: PrismaService
  ) {}

  async retornaPermissao(id: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id }});
    return usuario.permissao;
  }

  async validaPermissaoCriador(usuario: Usuario, permissao: Permissao) {
    const permissaoCriador = await this.retornaPermissao(usuario.id);
    if (permissaoCriador == 'ADM' && (permissao == 'SUP' || permissao == 'DEV'))
      permissao = 'ADM';
    if (permissaoCriador == 'SUP' && permissao == 'DEV')
      permissao = 'SUP'
    return permissao;    
  }

  async criar(usuario: Usuario, createUsuarioDto: CreateUsuarioDto) {
    let { nome, login, permissao, status } = createUsuarioDto;
    permissao = await this.validaPermissaoCriador(usuario, permissao);
    if (await this.buscarPorLogin(login)) throw new ForbiddenException("Login já cadastrado.");
    const novoUsuario = await this.prisma.usuario.create({
      data: { nome, login, permissao, status }
    });
    return novoUsuario;
  }

  async buscarTudo() {
    const usuarios = await this.prisma.usuario.findMany();
    return usuarios;
  }

  async buscarPorId(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id }
    });
    return usuario;
  }

  async buscarPorLogin(login: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { login }
    });
    return usuario;
  }

  async atualizar (usuario: Usuario, id: string, updateUsuarioDto: UpdateUsuarioDto) {
    if (updateUsuarioDto.login) {
      const usuario = await this.buscarPorLogin(updateUsuarioDto.login);
      if (usuario && usuario.id !== id) throw new ForbiddenException("Login já cadastrado.");
    }
    if (updateUsuarioDto.permissao)
      updateUsuarioDto.permissao = await this.validaPermissaoCriador(usuario, updateUsuarioDto.permissao);
    const usuarioAtualizado = await this.prisma.usuario.update({
      data: updateUsuarioDto,
      where: { id }
    });
    return usuarioAtualizado;
  }
  
  async excluir (id: string) {
    await this.prisma.usuario.delete({
      where: { id }
    });
    return {
      "mensagem": "Usuário removido com sucesso!"
    }
  }
}
