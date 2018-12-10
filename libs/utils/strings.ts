export function capitalize(string): string {
  // being defensize here since some edge cases have arised around it's usage
  if (string) {
    const firstChar = string.charAt(0);
    if (firstChar) {
      return firstChar.toUpperCase() + string.slice(1);
    } else {
      return string;
    }
  }
  return '';
}

export function safeSplit(text: string, splitBy: any) {
  if (text) {
    try {
      if (typeof text === 'string') {
        return text.split(splitBy);
      }
    } catch (err) {
      return ['']; // if for some reason gets here, return empty string split
    }
  }
  // text is null or undefined, just pass back empty array
  return [];
}

export function fileNameFromPath(filePath: string) {
  let filename = '';
  if (filePath) {
    const fileParts = safeSplit(filePath, '/');
    if (fileParts && fileParts.length) {
      filename = fileParts[fileParts.length - 1];
    }
  }
  return filename;
}

export function argbFromRgbOrRgba(value: string): number {
  const toLower = value.toLowerCase();
  const parts = toLower
    .replace('rgba(', '')
    .replace('rgb(', '')
    .replace(')', '')
    .trim()
    .split(',');

  let r = 255,
    g = 255,
    b = 255,
    a = 255;

  if (parts[0]) {
    r = parseInt(parts[0].trim(), 10);
  }

  if (parts[1]) {
    g = parseInt(parts[1].trim(), 10);
  }

  if (parts[2]) {
    b = parseInt(parts[2].trim(), 10);
  }

  if (parts.length > 2 && parts[3]) {
    a = Math.round(parseFloat(parts[3].trim()) * 255);
  }

  // Format is ARGB, so alpha takes the first 8 bits, red the next, green the next and the last 8 bits are for the blue component
  return (a << 24) | (r << 16) | (g << 8) | b;
}
