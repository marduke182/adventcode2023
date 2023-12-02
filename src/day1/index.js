import { open  } from 'fs/promises'

const getCalibrationValue = (line) => {
    const length = line.length;
    let left = 0;
    let right = length - 1;
    let tens = -1;
    let ones = -1;

    while (left <= length && right >= 0 && (tens === -1 || ones === -1)) {
        const leftValue = line[left];
        const rightValue = line[right];


        // Left iterator
        if (tens === -1) {
            const leftValueN = Number(leftValue);
            if (!Number.isNaN(leftValueN)) {
                tens = leftValueN * 10;
                continue;
            }
            left++;

        }

        // Right iterator
        if (ones === -1) {
            const rightValueN = Number(rightValue);
            if (!Number.isNaN(rightValueN)) {
                ones = rightValueN;
            }

            right--;
        }
    }

    if (tens === -1 && ones === -1) {
        throw new Error('Invalid line');
    }


    return tens + ones;

}

(async () => {
    const file =  await open('./input.txt');
    let acc = 0;
    for await (const line of file.readLines()) {
        acc += getCalibrationValue(line)

    }
    console.log(acc)
})()