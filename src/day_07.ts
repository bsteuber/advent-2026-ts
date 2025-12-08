import { skipPartiallyEmittedExpressions } from "typescript";
import { gridPoints, open, reportResult } from "./util";

type Point = [number, number];
type Input = { startX: number, splitters: Point[] };

function parse(file: string): Input {
    const grid = open(file).split("\n").map((line) => line.split(""));
    let startX;
    let splitters: Point[] = [];
    for (const [x, y] of gridPoints(grid)) {
        const ch = grid[y]![x]!;
        if (ch === "S") {
            startX = x;
        } else if (ch === "^") {
            splitters.push([x, y]);
        }
    }
    if (!startX) {
        throw new Error("no start position given");
    }
    return { startX, splitters };
}

function calcSplittersByY(splitters: Point[]) {
    const splittersByY = new Map<number, Set<number>>();
    for (const [x, y] of splitters) {
        const row = splittersByY.get(y);
        if (!row) {
            splittersByY.set(y, new Set([x]));
        } else {
            row.add(x);
        }
    }
    return splittersByY;
}

function calcSplits(beams: Set<number>, splitters: Set<number>) {
    let splits = 0;
    const newBeams = new Set<number>();
    for (const beam of beams) {
        if (splitters.has(beam)) {
            splits++;
            newBeams.add(beam - 1);
            newBeams.add(beam + 1);
        } else {
            newBeams.add(beam);
        }
    }
    return {
        beams: newBeams,
        splits
    }
}

function part1(file: string) {
    const { startX, splitters } = parse(file);
    const splittersByY = calcSplittersByY(splitters);
    let totalSplits = 0;
    let currentBeams = new Set([startX]);
    for (const splitters of splittersByY.values()) {
        const { beams, splits } = calcSplits(currentBeams, splitters);
        currentBeams = beams;
        totalSplits += splits;
    }
    reportResult(1, file, totalSplits)
}

function addToMultiset(multiset: Map<number, number>, x: number, count: number) {
    const current = multiset.get(x) || 0;
    multiset.set(x, count + current);
}

function calcTimeSplits(timelines: Map<number, number>, splitters: Set<number>) {
    const newTimelines = new Map<number, number>();
    for (const [beam, count] of timelines) {
        if (splitters.has(beam)) {
            addToMultiset(newTimelines, beam - 1, count);
            addToMultiset(newTimelines, beam + 1, count);
        } else {
            addToMultiset(newTimelines, beam, count);
        }
    }
    return newTimelines
}

function part2(file: string) {
    const { startX, splitters } = parse(file);
    const splittersByY = calcSplittersByY(splitters);
    let currentTimelines = new Map<number, number>();
    currentTimelines.set(startX, 1);
    for (const splitters of splittersByY.values()) {
        currentTimelines = calcTimeSplits(currentTimelines, splitters);
    }
    const totalTimelines = currentTimelines.values().reduce((x, y) => x + y)

    reportResult(2, file, totalTimelines)
}

part1("test")
part1("input")
part2("test")
part2("input")