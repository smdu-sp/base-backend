import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { Permissoes } from 'src/auth/decorators/permissoes.decorator';
import { UsuarioAtual } from 'src/auth/decorators/usuario-atual.decorator';
import { Usuario } from '@prisma/client';

@Controller('usuarios') //localhost:3000/usuarios
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Permissoes('SUP', 'ADM')
  @Post('criar') //localhost:3000/usuarios/criar
  criar(@UsuarioAtual() usuario: Usuario, @Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.criar(usuario, createUsuarioDto);
  }

  @Permissoes('SUP', 'ADM')
  @Get('buscar-tudo') //localhost:3000/usuarios/buscar-tudo
  buscarTudo() {
    return this.usuariosService.buscarTudo();
  }
  
  @Permissoes('SUP', 'ADM')
  @Get('buscar-por-id/:id') //localhost:3000/usuarios/buscar-por-id/id
  buscarPorId(@Param('id') id: string) {
    return this.usuariosService.buscarPorId(id);
  }

  @Permissoes('SUP', 'ADM')
  @Patch('atualizar/:id') //localhost:3000/usuarios/atualizar/id
  atualizar(@UsuarioAtual() usuario: Usuario, @Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.atualizar(usuario, id, updateUsuarioDto);
  }

  @Permissoes('SUP')
  @Delete('excluir/:id') //localhost:3000/usuarios/excluir/id
  excluir(@Param('id') id: string) {
    return this.usuariosService.excluir(id);
  }
}
