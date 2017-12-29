import { Injectable } from '@angular/core';

@Injectable()
export class FilterService {
  emojiCodes = '\ud83c[\udf00-\udfff]|\ud83d[\udc00-\ude4f]|\ud83d[\ude80-\udeff]';

  replace(
    value: string,
    regEx: string,
    toString = '',
  ): string {
    return value.replace(new RegExp(regEx, 'g'), toString);
  }
}
