export interface UsuarioPayload {
    sub: string;
    email: string;
    nome: string;
    iat?: number;
    exp?: number;
}