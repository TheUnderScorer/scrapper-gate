export const hexToRgb = (hex: string) => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")

  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

  const currentHex = hex.replace(shorthandRegex, (m, r, g, b) => {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(currentHex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/*!
 * Get the contrasting color for any hex color
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 * Derived from work by Brian Suda, https://24ways.org/2010/calculating-color-contrast/
 * @param  {String} A hexcolor value
 * @return {String} The contrasting color (black or white)
 */
export const getContrast = (hex: string): string => {
  let currentHexColor = hex;

  // If a leading # is provided, remove it
  if (currentHexColor.startsWith('#')) {
    currentHexColor = currentHexColor.slice(1);
  }

  // If a three-character hexcode, make six-character
  if (currentHexColor.length === 3) {
    currentHexColor = currentHexColor
      .split('')
      .map((hexValue) => hexValue + currentHexColor)
      .join('');
  }

  // Convert to RGB value
  const r = parseInt(currentHexColor.substr(0, 2), 16);
  const g = parseInt(currentHexColor.substr(2, 2), 16);
  const b = parseInt(currentHexColor.substr(4, 2), 16);

  // Get YIQ ratio
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Check contrast
  return yiq >= 128 ? 'black' : 'white';
};

export const shadeColor = (color: string, percent: number): string => {
  let R = parseInt(color.substring(1, 3), 16);
  let G = parseInt(color.substring(3, 5), 16);
  let B = parseInt(color.substring(5, 7), 16);

  R = Math.floor((R * (100 + percent)) / 100);
  G = Math.floor((G * (100 + percent)) / 100);
  B = Math.floor((B * (100 + percent)) / 100);

  R = R < 255 ? R : 255;
  G = G < 255 ? G : 255;
  B = B < 255 ? B : 255;

  const RR =
    R.toString(16).length === 1 ? `0${R.toString(16)}` : R.toString(16);
  const GG =
    G.toString(16).length === 1 ? `0${G.toString(16)}` : G.toString(16);
  const BB =
    B.toString(16).length === 1 ? `0${B.toString(16)}` : B.toString(16);

  return `#${RR}${GG}${BB}`;
};
