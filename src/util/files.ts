import { readFileSync } from "fs";

function open(day: number, filename: string): string {
    const dayStr = day.toString().padStart(2, "0");
    return readFileSync(`inputs/day_${dayStr}/${filename}.txt`, "utf-8");
}

export { open };
