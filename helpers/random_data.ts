export function generateRandomInt(min: number, max:number, toFixed = 0) {
    return +((Math.random() * max - min) + min).toFixed(toFixed);
}

export function getRandomItems<T> (arr: T[]):T[] {
    const start = generateRandomInt(1, arr.length - 1);
    const end = start + generateRandomInt(start, start + arr.length - 1);
    return arr.slice(start, end);
}

export function getRandomItem<T> (arr: T[]):T {
    return arr[generateRandomInt(0, arr.length - 1)];
}

export function getRandomFloat(min: number, max: number, toFixed: number): number {
    return +(Math.random() * (max - min) + min).toFixed(toFixed);
}
  
