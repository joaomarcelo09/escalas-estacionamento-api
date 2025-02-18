import { sectorMain } from './seeders/sector';

async function main() {
  console.log('iniciar seeder');

  sectorMain();

  console.log('finalizar seeder');
}

main();
