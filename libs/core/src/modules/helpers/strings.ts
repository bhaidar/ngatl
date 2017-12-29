export function capitalize(string): string {
  // being defensize here since some edge cases have arised around it's usage
  if ( string ) {
    const firstChar = string.charAt(0);
    if ( firstChar ) {
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
  if ( filePath ) {
    const fileParts = safeSplit(filePath, '/');
    if ( fileParts && fileParts.length ) {
      filename = fileParts[fileParts.length - 1];
    }
  }
  return filename;
}

export function decodeToken(token: string) {
  let parts = safeSplit(token, '.');

  if ( parts.length !== 3 ) {
    throw new Error('token must have 3 parts');
  }

  let decoded = urlBase64Decode(parts[1]);
  if ( !decoded ) {
    throw new Error('Cannot decode the token');
  }

  return JSON.parse(decoded);
}

export function urlBase64Decode(str: string): string {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch ( output.length % 4 ) {
    case 0: { break; }
    case 2: {
      output += '==';
      break;
    }
    case 3: {
      output += '=';
      break;
    }
    default: {
      throw 'Illegal base64url string!';
    }
  }
  return b64DecodeUnicode(output);
}

export function b64decode(str: string): string {
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output: string = '';

  str = String(str).replace(/=+$/, '');

  if ( str.length % 4 == 1 ) {
    throw new Error('"atob" failed: The string to be decoded is not correctly encoded.');
  }

  for (
    // initialize result and counters
    let bc: number = 0, bs: any, buffer: any, idx: number = 0;
    // get next character
    buffer = str.charAt(idx++);
    // character found in table? initialize bit storage and add its ascii value;
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
      // and if not first of each 4 characters,
      // convert the first 8 bits to one ascii character
    bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    // try to find character in table (0-63, not found => -1)
    buffer = chars.indexOf(buffer);
  }
  return output;
}

export function b64DecodeUnicode(str: any) {
  return decodeURIComponent(Array.prototype.map.call(b64decode(str), (c: any) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}
