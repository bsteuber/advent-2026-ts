import { open, reportResult } from './util';

type Rotation = {
    direction: "L" | "R";
    steps: number
};

type Input = Rotation[];

function parseRotation(s: string): Rotation {
    const direction = s[0];
    if (direction !== "L" && direction !== "R") {
        throw new Error("Direction must be L or R");
    }
    const steps = parseInt(s.substring(1), 10);
    return { direction, steps }
}

function parse(file: string): Input {
    const contents = open(file);
    return contents.split("\n").filter((s) => s.length > 0).map((s) => parseRotation(s));
}

function part1(file: string) {
    const input = parse(file);
    let curr = 50;
    let zeroCount = 0;
    input.forEach(({ direction, steps }) => {
        if (direction === 'R') {
            curr += steps;
        } else {
            curr += 100 - steps;
        }
        curr %= 100;
        if (curr === 0) {
            zeroCount++;
        }
    })
    reportResult(1, file, zeroCount);
}

function part2(file: string) {
    const input = parse(file);
    let curr = 50;
    let zeroCount = 0;
    input.forEach(({ direction, steps }) => {
        // console.log(curr, direction, steps);
        if (direction == 'R') {
            curr += steps;
            while (curr >= 100) {
                zeroCount++;
                curr -= 100;
            }
        } else {
            if (curr === 0) {
                zeroCount--;
            }
            curr -= steps;
            while (curr < 0) {
                zeroCount++;
                curr += 100;
            }
            if (curr === 0) {
                zeroCount++;
            }
        }
        // console.log("next:", curr, "zeros:", zeroCount);
    })
    reportResult(2, file, zeroCount);
}

part1("test")
part1("input")
part2("test")
part2("input")

