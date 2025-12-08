import { gridPoints, open, range, reportResult } from "./util";

type Grid = boolean[][];

function parse(file: string): Grid {
    const contents = open(file);
    return contents.split("\n").filter((line) => line.length > 0).map((line) => line.split("").map((c) => {
        if (c === "@") {
            return true;
        } else if (c === ".") {
            return false;
        } else {
            throw new Error("Invalid char in grid");
        }
    }))
}

function isMovable(grid: Grid, x: number, y: number) {
    if (!grid[y]?.[x]) {
        return false;
    }
    let neighbourCount = -1; // adjust for the paper itself
    for (let ny = y - 1; ny <= y + 1; ny++) {
        for (let nx = x - 1; nx <= x + 1; nx++) {
            if (grid[ny]?.[nx]) {
                neighbourCount++;
            }
        }
    }
    return (neighbourCount < 4);
}

function part1(file: string) {
    const grid = parse(file);
    let movable = 0;
    for (const [x, y] of gridPoints(grid)) {
        if (isMovable(grid, x, y)) {
            movable++;
        }
    }
    reportResult(1, file, movable)

}

function part2(file: string) {
    const grid = parse(file);
    let removable = 0;
    let removedThisRun = 0;
    do {
        removable += removedThisRun;
        removedThisRun = 0;
        for (const [x, y] of gridPoints(grid)) {
            if (isMovable(grid, x, y)) {
                removedThisRun++;
                grid[y]![x] = false;
            }
        }
    } while (removedThisRun > 0);
    reportResult(2, file, removable)

}

part1("test")
part1("input")
part2("test")
part2("input")