import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const root = await prisma.usuario.upsert({
    where: { login: 'seu_login' },
    create: {
      login: 'seu_login',
      nome: 'seu_nome',
      email: 'seu_email',
      status: 1,
      permissao: 'DEV',
    },
    update: {
      login: 'seu_login',
      nome: 'seu_nome',
      email: 'seu_email',
      status: 1,
      permissao: 'DEV',
    },
  });
  console.log(root);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
