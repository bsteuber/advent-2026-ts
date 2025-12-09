import { open, range, reportResult } from "./util";

type Point = { x: number; y: number };

type Points = Point[];

function parse(file: string): Points {
    return open(file).split("\n").map((line) => {
        const [xStr, yStr] = line.split(",");
        const x = parseInt(xStr!);
        const y = parseInt(yStr!);
        return { x, y };
    });
}

function calcArea(point1: Point, point2: Point): number {
    const dx = Math.abs(point2.x - point1.x) + 1;
    const dy = Math.abs(point2.y - point1.y) + 1;
    const area = dx * dy;
    return area;
}

function part1(file: string) {
    const points = parse(file);
    let maxArea = 0;
    for (const i of range(points.length - 1)) {
        for (const j of range(i + 1, points.length)) {
            const area = calcArea(points[i]!, points[j]!);
            if (area > maxArea) {
                maxArea = area;
            }
        }
    }
    reportResult(1, file, maxArea)
}

function calcMaxColumn(points: Points): number {
    let max = 0;
    for (const { x } of points) {
        if (x > max) {
            max = x;
        }
    }
    return max;
}

type Line = { start: Point; end: Point };

type Lines = Line[];

function isHorizontal(line: Line) {
    return line.start.y === line.end.y;
}

function calcHorizontalIntersection(y: number, verticalLine: Line): number | undefined {
    if ((
        verticalLine.start.y <= y &&
        verticalLine.end.y >= y
    ) || (
            verticalLine.start.y >= y &&
            verticalLine.end.y <= y
        )) {
        return verticalLine.start.x;
    }
}

function calcVerticalIntersection(x: number, horizontalLine: Line): number | undefined {
    if ((
        horizontalLine.start.x <= x &&
        horizontalLine.end.x >= x
    ) || (
            horizontalLine.start.x >= x &&
            horizontalLine.end.x <= x
        )) {
        return horizontalLine.start.y;
    }
}

function calcHorizontalIntersections(y: number, verticalLines: Lines) {
    const res = [];
    for (const line of verticalLines) {
        const x = calcHorizontalIntersection(y, line);
        if (x) {
            res.push(x)
        }
    }
    res.sort((a, b) => a - b);
    return res;
}

function calcVerticalIntersections(x: number, horizontalLines: Lines) {
    const res = [];
    for (const line of horizontalLines) {
        const y = calcVerticalIntersection(x, line);
        if (y) {
            res.push(y)
        }
    }
    res.sort((a, b) => a - b);
    return res;
}

function isValidSide(min: number, max: number, intersections: number[]) {
    for (let i = 0; i < intersections.length; i += 2) {
        const start = intersections[i]!;
        if (min < start) {
            return false;
        }
        const end = intersections[i + 1]!;
        if (min > end) {
            continue;
        }
        if (max > end) {
            return false; // maybe handle +1 case?
        }
        return true;
    }
    return false;
}

function isValidRectangle(point1: Point, point2: Point, horizontalLines: Lines, verticalLines: Lines) {
    const debug = point1.x == 11 && point1.y == 1 && point2.x == 7 && point2.y == 3;
    const minX = (point1.x < point2.x ? point1.x : point2.x) + 0.5;
    const maxX = (point1.x > point2.x ? point1.x : point2.x) - 0.5;
    const minY = (point1.y < point2.y ? point1.y : point2.y) + 0.5;
    const maxY = (point1.y > point2.y ? point1.y : point2.y) - 0.5;
    if (debug) {
        console.log({ minX, maxX, minY, maxY })
    }
    return (
        isValidSide(minX, maxX, calcHorizontalIntersections(minY, verticalLines), debug) &&
        isValidSide(minX, maxX, calcHorizontalIntersections(maxY, verticalLines), debug) &&
        isValidSide(minY, maxY, calcVerticalIntersections(minX, horizontalLines), debug) &&
        isValidSide(minY, maxY, calcVerticalIntersections(maxX, horizontalLines), debug)
    );
}

function part2(file: string) {
    const points = parse(file);
    const evenLines: Lines = [];
    const oddLines: Lines = [];
    points.map((start, index) => {
        const nextIndex = (index + 1) % points.length;
        const end = points[nextIndex]!;
        const line = { start, end };
        if (index % 2 == 0) {
            evenLines.push(line);
        } else {
            oddLines.push(line);
        }
    });
    const [horizontalLines, verticalLines] = isHorizontal(evenLines[0]!) ? [evenLines, oddLines] : [oddLines, evenLines];
    let maxArea = 0;
    for (const i of range(points.length - 1)) {
        for (const j of range(i + 1, points.length)) {
            const point1 = points[i]!;
            const point2 = points[j]!;
            const area = calcArea(point1, point2);
            if (area > maxArea && isValidRectangle(point1, point2, horizontalLines, verticalLines)) {
                maxArea = area;
            }
        }
    }
    reportResult(2, file, maxArea)
}

part1("test")
part1("input")
part2("test")
part2("input")