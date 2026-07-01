import { appTypeMain } from './seeders/app_type';
import { sectorMain } from './seeders/sector';

async function main() {
  console.log('iniciar seeder');

  sectorMain();
  appTypeMain();

  console.log('finalizar seeder');
}

main();
