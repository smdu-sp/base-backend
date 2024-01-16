<p align="center">
  <a href="https://www.prefeitura.sp.gov.br/cidade/secretarias/licenciamento/" target="blank"><img src="https://www.prefeitura.sp.gov.br/cidade/secretarias/upload/chamadas/URBANISMO_E_LICENCIAMENTO_HORIZONTAL_FUNDO_CLARO_1665756993.png" width="200" alt="SMUL Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Base de desenvolvimento Backend - SMUL/ATIC</p>

## Descrição

Base de desenvolvimento backend de SMUL/ATIC:

- NESTJS: https://docs.nestjs.com/
- PRISMAIO: https://www.prisma.io/docs/getting-started

## Instalação

```bash
$ npm install
```

## Configurando o banco de dados

O arquivo example.env detalha as variáveis de ambiente necessárias pra rodar a aplicação, a partir dela é necessário criar um arquivo .env com as informações corretas (URL do banco de dados, etc).

<b>NUNCA ENVIE O ARQUIVO .env PARA O REPOSITÓRIO.</b>

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

```bash
# cria arquivo .env com base no exemplo
$ copy example.env .env
```

## Rodando a aplicação

Por padrão, a aplicação rodará na porta 3000.

```bash
# atualiza a cada mudança nos arquivos
$ npm run dev
```
```bash
# modo de desenvolvimento
$ npm run start
```
```bash
# modo de produção
$ npm run prod
```
