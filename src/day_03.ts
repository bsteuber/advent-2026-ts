import { getCombinedNodeFlags } from "typescript";
import { open, report } from "./util";

type Bank = number[];

type Input = Bank[];

function parse(file: string): Input {
    const content = open(file);
    return content.split("\n").filter((line) => line.length > 0).map((line) => line.split("").map((c) => parseInt(c)));
}

function findLargest(batteries: Bank) {
    let largest = -1;
    let index = -1;
    batteries.forEach((x, i) => {
        if (x > largest) {
            largest = x;
            index = i;
        }
    });
    return { largest, index };
}

function findJoltage(bank: Bank, digits: number) {
    let currentBank = bank;
    let combined = "";
    let position = 0;
    for (let digit = 0; digit < digits; digit++) {
        const { largest, index } = findLargest(bank.slice(position, bank.length - digits + digit + 1))
        combined += largest;
        position += index + 1;
    }
    return parseInt(combined);
}

function part1(file: string) {
    const input = parse(file);
    let totalJoltage = 0;
    input.forEach((bank) => {
        totalJoltage += findJoltage(bank, 2);
    });
    report(1, file, totalJoltage);
}


function part2(file: string) {
    const input = parse(file);
    let totalJoltage = 0;
    input.forEach((bank) => {
        // console.log(bank, findJoltage(bank, 12))
        totalJoltage += findJoltage(bank, 12);
    });
    report(2, file, totalJoltage);

}

part1("test")
part1("input")
part2("test")
part2("input")