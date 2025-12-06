import { open, report } from './util';

type Range = { min: number, max: number };
type Input = Range[];

function parse(file: string): Input {
    const contents = open(file);
    const ranges = contents.split(",");
    return ranges.map((range) => {
        const [minStr, maxStr] = range.split("-");
        if (!minStr || !maxStr) {
            throw "Range must have two numbers";
        }
        const min = parseInt(minStr);
        const max = parseInt(maxStr);
        return {
            min,
            max
        };
    });
}

function firstHalf(x: number, position: 'min' | 'max') {
    const s = x.toString();
    const halfLen = s.length / 2;
    if (Number.isInteger(halfLen)) {
        return parseInt(s.substring(0, halfLen));
    }
    if (position == 'min') {
        const len = (s.length + 1) / 2;
        return parseInt('1'.padEnd(len, '0'));

    } else {
        const len = (s.length - 1) / 2;
        return parseInt(''.padEnd(len, '9'));
    }
}

function part1(file: string) {
    const input = parse(file);
    const invalidIds: number[] = [];
    input.forEach(({ min, max }) => {
        const halfMin = firstHalf(min, 'min');
        const halfMax = firstHalf(max, 'max');
        for (let x = halfMin; x <= halfMax; x++) {
            const id = parseInt(x.toString() + x.toString());
            if (id >= min && id <= max) {
                invalidIds.push(id);
            }
        }
    });
    const res = invalidIds.reduce((x, y) => x + y);
    report(1, file, res);
}

function isInvalidWith(idStr: string, digits: number, slices: number): boolean {
    for (let slice = 1; slice < slices; slice++) {
        for (let digit = 0; digit < digits; digit++) {
            if (idStr[slice * digits + digit] != idStr[digit]) {
                return false;
            }
        }
    }
    return true;
}

function isInvalidPart2(id: number): boolean {
    const idStr = id.toString();
    for (let digits = 1; digits <= idStr.length / 2; digits++) {
        const slices = idStr.length / digits;
        if (Number.isInteger(slices) && isInvalidWith(idStr, digits, slices)) {
            return true;
        }
    }
    return false;
}

function part2(file: string) {
    const input = parse(file);
    const invalidIds: number[] = [];
    input.forEach(({ min, max }) => {
        for (let id = min; id <= max; id++) {
            if (isInvalidPart2(id)) {
                invalidIds.push(id);
            }
        }
    });
    const res = invalidIds.reduce((x, y) => x + y, 0);
    report(2, file, res);
}

part1('input');
// part2('test');
part2('input');