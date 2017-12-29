export function flatten<T>(list: Array<Array<T>>): Array<T> {
  return list.reduce((
    a,
    b,
  ) => a.concat(Array.isArray(b) ? flatten(<any>b) : b), []);
}

export function findAndUpdate(
  collection: Array<any>,
  value: any,
  addIfNotFound?: boolean,
) {
  if ( Array.isArray(collection) ) {
    let found = false;
    for ( let i = 0; i < collection.length; i++ ) {
      if ( value.id === collection[i].id ) {
        collection[i] = value;
        found = true;
        break;
      }
    }
    if ( !found && addIfNotFound ) {
      collection.push(value);
    }
  }
}

export function removeItem(
  collection: Array<any>,
  value: any,
) {
  if ( Array.isArray(collection) ) {
    let index = -1;
    for ( let i = 0; i < collection.length; i++ ) {
      if ( value.id === collection[i].id ) {
        index = i;
        break;
      }
    }
    if ( index > -1 ) {
      collection.splice(index, 1);
    }
  }
}

export function sortByDate(
  collection: Array<any>,
  fieldName: string = 'updatedAt',
): Array<any> {
  collection.sort(function (
    a,
    b,
  ) {
    return new Date(a[fieldName]).getTime() - new Date(b[fieldName]).getTime();
  });
  return collection;
}

/**
 * Move elements around in an array (this mutates the array passed in)
 * @param collection array to operate on
 * @param oldIndex index of element you want to move
 * @param newIndex index of where you want to move the element to
 */
export function moveItemTo(collection: Array<any>, oldIndex: number, newIndex: number) {
  if (newIndex >= collection.length) {
      var k = newIndex - collection.length;
      while ((k--) + 1) {
        collection.push(undefined);
      }
  }
  collection.splice(newIndex, 0, collection.splice(oldIndex, 1)[0]);
};
