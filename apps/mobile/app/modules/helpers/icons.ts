import { isIOS } from 'platform';

export const backIcon = function() {
  return `ion-${isIOS ? 'ios-arrow-back' : 'android-arrow-back'}`;
};

export const moreIcon = function() {
  return `ion-${isIOS ? 'ios-more-outline' : 'android-more-vertical'}`;
};
