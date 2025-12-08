import { readFileSync } from "fs";

function open(filename: string): string {
    const stack = new Error().stack;
    if (!stack) {
        throw new Error("Could not determine day number from call stack");
    }
    const match = stack.match(/day_(\d+)\.ts/);
    if (!match || !match[1]) {
        throw new Error("Could not extract day number from calling file");
    }
    return readFileSync(`inputs/day_${match[1]}/${filename}.txt`, "utf-8").trimEnd();
}

function reportResult(part: number, filename: string, result: number | string) {
    console.log(`Part ${part} (${filename}.txt):`, result);
}

function* range(n: number, end?: number) {
    const loopStart = end ? n : 0;
    const loopEnd = end ? end : n;
    for (let i = loopStart; i < loopEnd; i++) {
        yield i;
    }
}

function* gridPoints<T>(grid: T[][]): Generator<[number, number], void, unknown> {
    for (const [y, row] of grid.entries()) {
        for (const x of range(row.length)) {
            yield [x, y];
        }
    }
}

export { gridPoints, open, range, reportResult };
