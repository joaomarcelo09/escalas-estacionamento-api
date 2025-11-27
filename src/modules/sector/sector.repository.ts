export abstract class SectorRepository {
  abstract findAll();
  abstract findOne({ where, include });
  abstract create(data);
  abstract update(id, data);
  abstract delete(id);
  abstract deletePinnedException(id);
}
