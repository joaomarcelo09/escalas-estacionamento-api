export function filterCooperatorsExceptions(cooperators, scale, sector) {
  const sectorCannotDiacun = [3, 4];

  return cooperators.filter((cooperator) => {
    // Verify if has someone pinned exception on actual scale
    const hasPinnedException = cooperator.pinned_exceptions?.some(
      (exception) =>
        exception.sector === sector || exception.period === scale.period,
    );

    // Verify if is diacun and the sector of scale is on sectors where cannot diacuns
    const hasDiacunSectorException =
      cooperator.type === 'diacun' && sectorCannotDiacun.includes(sector);

    // Verify if has someone exception on actual scale
    const hasException = cooperator.exceptions?.some(
      (exception) =>
        new Date(exception.date).getTime() === scale.date.getTime() &&
        exception.period === scale.period,
    );

    return (
      cooperator.type === 'cooperator' &&
      !hasPinnedException &&
      !hasException &&
      !hasDiacunSectorException
    );
  });
}

export function filterCooperatorsFrequency(cooperators, scale, memory) {
  return cooperators.filter((cooperator) => {
    return;
  });
}
