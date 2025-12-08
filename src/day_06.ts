import { open, range, reportResult } from "./util";

type Operator = "+" | "*";

type Task = {
    operator: Operator;
    numbers: number[];
};

type Input = Task[];

function parsePart1(file: string): Input {
    const contents = open(file);
    const tokens = contents.split("\n").map((line) => line.trim().split(/ +/));
    const opTokens = tokens.pop();
    const tasks: Input = [];
    for (const col of range(tokens[0]!.length)) {
        const operator = opTokens![col]!;
        if (operator != "+" && operator != "*") {
            throw new Error("Operator must be + or *");
        }
        const numbers = [];
        for (const row of tokens) {
            numbers.push(parseInt(row[col]!));
        }
        tasks.push({
            operator,
            numbers
        });
    }
    return tasks;
}

function solve(input: Input): number {
    let sum = 0;
    for (const { operator, numbers } of input) {
        const opFn = operator === "*" ? (x: number, y: number) => x * y : (x: number, y: number) => x + y;
        const res = numbers.reduce(opFn);
        sum += res;
    }
    return sum;
}

function part1(file: string) {
    const input = parsePart1(file);
    const res = solve(input);
    reportResult(1, file, res)
}

function parsePart2(file: string): Input {
    const lines = open(file).split("\n");
    const opLine = lines.pop();
    const tasks: Input = [];
    let currentNumbers: number[] = [];
    let currentOp: Operator | undefined;
    function pushTask() {
        if (!currentOp) {
            throw new Error("Operator not defined before task end")
        }
        tasks.push({
            numbers: currentNumbers,
            operator: currentOp
        });
        currentOp = undefined;
        currentNumbers = [];
    }
    for (const col of range(lines[0]!.length)) {
        let numStr = "";
        for (const row of range(lines.length)) {
            const ch = lines[row]![col]!;
            if (ch.match(/[0-9]/)) {
                numStr += ch;
            }
        }
        let operator = opLine![col];
        if (operator === "*" || operator === "+") {
            currentOp = operator;
        }
        if (numStr.length > 0) {
            currentNumbers.push(parseInt(numStr));
        } else {
            pushTask()
        }
    }
    pushTask();
    return tasks;
}

function part2(file: string) {
    const input = parsePart2(file);
    const res = solve(input);
    reportResult(2, file, res)
}


part1("test")
part1("input")
part2("test")
part2("input")