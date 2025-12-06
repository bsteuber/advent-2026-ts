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
    return readFileSync(`inputs/day_${match[1]}/${filename}.txt`, "utf-8");
}

function report(part: number, filename: string, result: number | string) {
    console.log(`Part ${part} (${filename}.txt):`, result);
}

export { open, report };
