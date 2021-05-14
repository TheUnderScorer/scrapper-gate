export enum OperatingSystem {
  Mac = 'Mac',
  Windows = 'Windows',
  Linux = 'Linux',
}

export const getOperatingSystem = (): OperatingSystem => {
  if (navigator.appVersion.indexOf('Mac') !== -1) return OperatingSystem.Mac;

  if (navigator.appVersion.indexOf('Win') !== -1)
    return OperatingSystem.Windows;

  if (navigator.appVersion.indexOf('Linux') !== -1)
    return OperatingSystem.Linux;

  return OperatingSystem.Windows;
};
