export interface UsuarioPayload {
    sub: string;
    login: string;
    nome: string;
    iat?: number;
    exp?: number;
}