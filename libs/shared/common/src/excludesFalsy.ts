export type ExcludesFalse = <T>(x: T | false | null | undefined) => x is T;

export const ExcludeFalsy: ExcludesFalse = (Boolean as unknown) as ExcludesFalse;
