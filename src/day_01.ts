import { open } from './util/files';

type Input = number[];

function parse(inputFile: string): Input {
    const contents = open(1, inputFile);
    return contents.split(" ").map((s) => parseInt(s));
}

function part1(inputFile: string) {
    const data = parse(inputFile);
    console.log("Part 1:", data.reduce((x, y) => x + y));
}

part1("test")
