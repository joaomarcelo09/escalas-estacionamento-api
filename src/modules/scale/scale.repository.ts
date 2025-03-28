export abstract class ScaleRepository {
  abstract create(data, tx);
  abstract createGroupScale(data);
  abstract createScaleSector(data, tx);
  abstract createCoopSectorScale(data, tx);
}
