export const wordFormByNumber = (
  singular: string,
  plural: string,
  count: number
) => (count > 1 ? plural : singular);
