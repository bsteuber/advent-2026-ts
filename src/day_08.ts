import { open, range, reportResult } from "./util";

type Point = [number, number, number];
type Points = Point[];

function parse(file: string): Points {
    return open(file).split("\n").map((line) => {
        const [x, y, z] = line.split(",").map((s) => parseInt(s));
        if (!x || !y || !z) {
            throw new Error("x,y,z must all be defined")
        }
        return [x, y, z];
    })
}

function distanceSquared(a: Point, b: Point): number {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    const dz = a[2] - b[2];
    return dx * dx + dy * dy + dz * dz;
}

type Pair = { first: Point, second: Point, distance: number }
type Circuit = Set<Point>;
type CircuitIndices = Map<Point, number>;

function buildPairs(points: Points): Pair[] {
    const pairs: Pair[] = [];
    for (const i of range(points.length)) {
        for (const j of range(i + 1, points.length)) {
            const first = points[i]!;
            const second = points[j]!;
            const distance = distanceSquared(first, second);
            pairs.push({ first, second, distance });
        }
    }
    pairs.sort((a, b) => a.distance - b.distance);
    return pairs;
}

function buildCircuits(points: Point[], pairs: Pair[]) {
    const circuits: Circuit[] = [];
    const circuitIndices = new Map<Point, number>();
    for (const i of range(points.length)) {
        const point = points[i]!;
        const circuit = new Set<Point>([point]);
        const circuitIndex = circuits.push(circuit) - 1;
        circuitIndices.set(point, circuitIndex);
    }
    return { circuits, circuitIndices };
}

function part1(file: string, steps: number) {
    const points = parse(file);
    const pairs = buildPairs(points);
    const { circuits, circuitIndices } = buildCircuits(points, pairs);
    for (const step of range(steps)) {
        const { first, second } = pairs[step]!;
        const firstIndex = circuitIndices.get(first)!;
        const secondIndex = circuitIndices.get(second)!;
        if (firstIndex !== secondIndex) {
            // console.log(firstIndex, secondIndex, circuits[secondIndex])
            for (const point of circuits[secondIndex]!) {
                circuitIndices.set(point, firstIndex);
                circuits[firstIndex]!.add(point)
            }
            circuits[secondIndex] = new Set<Point>();
        }
    }
    circuits.sort((a, b) => b.size - a.size);
    let product = 1;
    for (const i of range(3)) {
        product *= circuits[i]!.size;
    }
    reportResult(1, file, product)
}

function part2(file: string) {
    const points = parse(file);
    const pairs = buildPairs(points);
    const { circuits, circuitIndices } = buildCircuits(points, pairs);
    for (const step of range(pairs.length)) {
        const { first, second } = pairs[step]!;
        const firstIndex = circuitIndices.get(first)!;
        const secondIndex = circuitIndices.get(second)!;
        if (firstIndex !== secondIndex) {
            for (const point of circuits[secondIndex]!) {
                circuitIndices.set(point, firstIndex);
                circuits[firstIndex]!.add(point)
            }
            if (circuits[firstIndex]!.size === points.length) {
                reportResult(2, file, first[0] * second[0]);
                return;
            }
            circuits[secondIndex] = new Set<Point>();
        }
    }
    throw new Error("Not collapsed after merging all?")
}

part1("test", 10);
part1("input", 1000);
part2("test");
part2("input");