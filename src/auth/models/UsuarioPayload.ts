export interface UsuarioPayload {
    sub: string;
    login: string;
    nome: string;
    permissao: string;
    iat?: number;
    exp?: number;
}