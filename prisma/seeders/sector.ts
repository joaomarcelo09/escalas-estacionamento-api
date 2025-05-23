import { PrismaClient } from '@prisma/client';

const $prisma = new PrismaClient();

const sectors = [
  {
    id: 'e7b8a6e4-8f2b-4b8d-9f2e-1c9b8a6e4f2b',
    name: 'PP',
    quantity: 1,
    type: 'OUT',
    id_seeder: 'b5a9c1d3-8e7f-4a2b-9c0d-1e6f5d4c3b8a',
  },
  {
    id: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6',
    name: 'PP2',
    quantity: 1,
    type: 'OUT',
    id_seeder: 'f3d8c7b5-6a1e-4b2f-9c0d-7e5a3b4c2d9f',
  },
  {
    id: 'b2c3d4e5-f6a7-8b9c-0d1e-2a3b4c5d6e7f',
    name: 'PL',
    quantity: 1,
    type: 'OUT',
    id_seeder: 'c1a9d7e3-5f2b-4b6c-0d8f-9e4a3b2c5d7f',
  },
  {
    id: 'c3d4e5f6-a7b8-9c0d-1e2a-3b4c5d6e7f8a',
    name: 'EST1',
    quantity: 1,
    type: 'OUT',
    id_seeder: 'e7f6d3a5-9b2c-4b1e-0d8f-2a6c7b4d5a3f',
  },
  {
    id: 'd4e5f6a7-b8c9-0d1e-2a3b-4c5d6e7f8a9b',
    name: 'Fora 5',
    quantity: 1,
    type: 'OUT',
    id_seeder: 'a2b3c5d7-4e9f-6a1b-0d8c-7e5f3d4a6b2c',
  },
  {
    id: 'e5f6a7b8-c9d0-1e2a-3b4c-5d6e7f8a9b0c',
    name: 'Fora 6',
    quantity: 1,
    type: 'IN',
    id_seeder: 'b6c7d4e5-3f9a-1b2c-0d8f-4a7e5d3c2b6f',
  },
  {
    id: 'f6a7b8c9-d0e1-2a3b-4c5d-6e7f8a9b0c1d',
    name: 'Dentro 1',
    quantity: 1,
    type: 'IN',
    id_seeder: 'c5d4e7f6-9a3b-1b2c-0d8f-4a7e3d5c2b9f',
  },
  {
    id: 'a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d',
    name: 'Dentro 2',
    quantity: 1,
    type: 'IN',
    id_seeder: 'd3e4f7a6-9b5c-1b2c-0d8f-4a7e3d5c2b9f',
  },
  {
    id: 'b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e',
    name: 'Dentro 3',
    quantity: 1,
    type: 'IN',
    id_seeder: 'e4f5d7a6-9b3c-1b2c-0d8f-4a7e3d5c2b9f',
  },
  {
    id: 'c9d0e1f2-a3b4-5c6d-7e8f-9a0b1c2d3e4f',
    name: 'Dentro 4',
    quantity: 1,
    type: 'IN',
    id_seeder: 'f5d6e7a4-9b3c-1b2c-0d8f-4a7e3d5c2b9f',
  },
  {
    id: 'd0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a',
    name: 'Dentro 5',
    quantity: 1,
    type: 'IN',
    id_seeder: 'a6b7c8d9-5e4f-3a2b-0d8c-7e5f3d4a6b2c',
  },
  {
    id: '25a63a2a-155e-486a-8d89-8c2033f31e01',
    name: 'GA1',
    quantity: 1,
    mode: 'SITTING',
    type: 'IN',
    id_seeder: '571444d5-0406-4e6f-a359-ab4064ee4f26',
  },
];

export async function sectorMain(tx?) {
  const prisma = tx ?? $prisma;

  const secSgbd = await prisma.sector.findMany();

  const del = secSgbd.filter(
    (sgdb) => !sectors.some((prog) => sgdb.id_seeder === prog.id_seeder),
  );
  const update = sectors.filter((prog) =>
    secSgbd.some((sgdb) => sgdb.id_seeder === prog.id_seeder),
  );
  const add = sectors.filter(
    (prog) => !secSgbd.some((sgdb) => sgdb.id_seeder === prog.id_seeder),
  );

  let requests = [];

  if (del?.length) {
    await prisma.sector.deleteMany({
      where: {
        id: {
          in: del.map((dl) => dl.id),
        },
      },
    });
  }

  if (add?.length) requests.push(prisma.sector.createMany({ data: add }));

  if (update?.length) {
    const updateReq = update.map((up) => {
      const { id } = secSgbd.find((pg) => pg.id_seeder === up.id_seeder);

      return prisma.sector.update({
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
