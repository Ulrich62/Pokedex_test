export function getIdFromUrl(url: string): number {
  const urlParts = url.split("/")
  return parseInt(urlParts[urlParts.length - 2])
}

export function isOG(url: string) {
  const id = getIdFromUrl(url)

  return id < 150
}

function arraysAreEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

export function arraysHaveSameElements<T>(arr1: T[], arr2: T[]): boolean {
  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  return arraysAreEqual(sortedArr1, sortedArr2);
}

