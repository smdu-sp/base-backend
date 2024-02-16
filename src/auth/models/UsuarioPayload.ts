export interface UsuarioPayload {
  sub: string;
  login: string;
  email: string;
  nome: string;
  permissao: string;
  status: number;
  iat?: number;
  exp?: number;
}
