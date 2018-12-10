interface ICOLORS {
  BASE: string;
  PRIMARY: string;
  WHITE: string;
  TEXT: string;
}

const PARENTS_SCHEME: ICOLORS = {
  BASE: '#e0dfdf',
  PRIMARY: '#d71925',
  WHITE: '#fff',
  TEXT: '#3a3939'
};

const KIDS_SCHEME: ICOLORS = {
  BASE: '#e0dfdf',
  PRIMARY: '#007a42',
  WHITE: '#fff',
  TEXT: '#3a3939'
};

export class ColorService {

  public static ActiveId: number = 0;
  public static Active: ICOLORS = PARENTS_SCHEME;

  public static swapScheme(themeType: number) {
    ColorService.ActiveId = themeType;

    switch (themeType) {
      case 0:
        ColorService.Active = PARENTS_SCHEME;
        break;
      case 1:
        ColorService.Active = KIDS_SCHEME;
        break;
    }
  }
}
