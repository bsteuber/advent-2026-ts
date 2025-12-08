import { open, reportResult } from "./util";

type Range = { min: number; max: number };
type Input = {
    ranges: Range[];
    ingredients: number[];
}

function parse(file: string): Input {
    const contents = open(file);
    const [rangesStr, ingredientsStr] = contents.split("\n\n");
    const ranges = rangesStr!.split("\n").map((line): Range => {
        const [minStr, maxStr] = line.split("-");
        if (!minStr || !maxStr) {
            throw new Error("Failed to parse range");
        }
        const min = parseInt(minStr);
        const max = parseInt(maxStr);
        return { min, max };
    })


    const ingredients = ingredientsStr!.split("\n").filter((line) => line.length > 0).map((line) => parseInt(line));
    return { ranges, ingredients };
}

function isFresh(ingredient: number, ranges: Range[]) {
    for (const { min, max } of ranges) {
        if (ingredient >= min && ingredient <= max) {
            return true;
        }
    }
    return false;
}

function part1(file: string) {
    const { ranges, ingredients } = parse(file);
    let freshCount = 0;
    for (const ingredient of ingredients) {
        if (isFresh(ingredient, ranges)) {
            freshCount++;
        }
    }
    reportResult(1, file, freshCount);
}

function overlaps(smaller: Range, larger: Range) {
    return smaller.max >= larger.min;
}

function merge(smaller: Range, larger: Range): Range {
    const min = smaller.min < larger.min ? smaller.min : larger.min;
    const max = smaller.max > larger.max ? smaller.max : larger.max;
    return { min, max };
}

function part2(file: string) {
    const { ranges } = parse(file);
    ranges.sort((a, b) => a.max - b.max)
    for (let largerIndex = ranges.length - 1; largerIndex > 0; largerIndex--) {
        const smallerIndex = largerIndex - 1;
        const larger = ranges[largerIndex]!;
        const smaller = ranges[smallerIndex]!;
        // console.log("smaller:", smaller, "larger:", larger)
        if (overlaps(smaller, larger)) {
            const merged = merge(smaller, larger);
            // console.log("merged:", merged)
            ranges.splice(largerIndex, 1);
            ranges[smallerIndex] = merged;
        }
    }
    console.log(ranges);
    let validCount = 0;
    for (const { min, max } of ranges) {
        validCount += max + 1 - min
    }

    reportResult(2, file, validCount)
}

// part1("test")
// part1("input")
// part2("test")
part2("input")