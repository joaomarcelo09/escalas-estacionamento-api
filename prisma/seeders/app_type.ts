import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const $prisma = new PrismaClient();

const app_type = [
  {
    id: randomUUID(),
    value: 'DOCE',
    id_seeder: '1a375a2a-9820-4de4-b2ff-d476806d55c4',
  },
  {
    id: randomUUID(),
    value: 'ESTACIONAMENTO',
    id_seeder: '98bc03d9-67f3-4eb7-8f8b-44b03ff62e41',
  },
];

export async function appTypeMain(tx?) {
  const prisma = tx ?? $prisma;

  const appTypeSgbd = await prisma.appType.findMany();

  const del = appTypeSgbd.filter(
    (sgdb) => !app_type.some((prog) => sgdb.id_seeder === prog.id_seeder),
  );
  const update = app_type.filter((prog) =>
    appTypeSgbd.some((sgdb) => sgdb.id_seeder === prog.id_seeder),
  );
  const add = app_type.filter(
    (prog) => !appTypeSgbd.some((sgdb) => sgdb.id_seeder === prog.id_seeder),
  );

  let requests = [];

  if (del?.length) {
    await prisma.appType.deleteMany({
      where: {
        id: {
          in: del.map((dl) => dl.id),
        },
      },
    });
  }

  if (add?.length) requests.push(prisma.appType.createMany({ data: add }));

  if (update?.length) {
    const updateReq = update.map((up) => {
      const { id } = appTypeSgbd.find((pg) => pg.id_seeder === up.id_seeder);

      return prisma.appType.update({
        where: {
          id,
        },
        data: up,
      });
    });
    requests = [...requests, ...updateReq];
  }

  await Promise.all(requests);
  return true;
}
