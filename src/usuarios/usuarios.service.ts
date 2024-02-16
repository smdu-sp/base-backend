import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { $Enums, Usuario } from '@prisma/client';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async retornaPermissao(id: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    return usuario.permissao;
  }

  validaPermissaoCriador(
    permissao: $Enums.Permissao,
    permissaoCriador: $Enums.Permissao,
  ) {
    console.log({ permissao, permissaoCriador });
    if (
      permissao === $Enums.Permissao.DEV &&
      permissaoCriador === $Enums.Permissao.SUP
    )
      permissao = $Enums.Permissao.SUP;
    if (
      (permissao === $Enums.Permissao.DEV ||
        permissao === $Enums.Permissao.SUP) &&
      permissaoCriador === $Enums.Permissao.ADM
    )
      permissao = $Enums.Permissao.ADM;
    return permissao;
  }

  async criar(createUsuarioDto: CreateUsuarioDto, criador?: Usuario) {
    const loguser = await this.buscarPorLogin(createUsuarioDto.login);
    if (loguser) throw new ForbiddenException('Login já cadastrado.');
    const emailuser = await this.buscarPorEmail(createUsuarioDto.email);
    if (emailuser) throw new ForbiddenException('Email já cadastrado.');
    if (!criador) createUsuarioDto.permissao = 'USR';
    if (criador) {
      const permissaoCriador = await this.retornaPermissao(criador.id);
      if (permissaoCriador !== $Enums.Permissao.DEV)
        createUsuarioDto.permissao = this.validaPermissaoCriador(
          createUsuarioDto.permissao,
          permissaoCriador,
        );
    }
    const usuario = await this.prisma.usuario.create({
      data: createUsuarioDto,
    });
    if (!usuario)
      throw new InternalServerErrorException(
        'Não foi possível criar o usuário, tente novamente.',
      );
    return usuario;
  }

  async buscarTudo() {
    const usuarios = await this.prisma.usuario.findMany();
    return usuarios;
  }

  async buscarPorId(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
    });
    return usuario;
  }

  async buscarPorEmail(email: string) {
    return await this.prisma.usuario.findUnique({ where: { email } });
  }

  async buscarPorLogin(login: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { login },
    });
    return usuario;
  }

  async atualizar(
    usuario: Usuario,
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ) {
    if (updateUsuarioDto.login) {
      const usuario = await this.buscarPorLogin(updateUsuarioDto.login);
      if (usuario && usuario.id !== id)
        throw new ForbiddenException('Login já cadastrado.');
    }
    if (updateUsuarioDto.permissao)
      updateUsuarioDto.permissao = this.validaPermissaoCriador(
        usuario.permissao,
        updateUsuarioDto.permissao,
      );
    const usuarioAtualizado = await this.prisma.usuario.update({
      data: updateUsuarioDto,
      where: { id },
    });
    return usuarioAtualizado;
  }

  async excluir(id: string) {
    await this.prisma.usuario.delete({
      where: { id },
    });
    return {
      mensagem: 'Usuário removido com sucesso!',
    };
  }
}
