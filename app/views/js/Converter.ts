import {EventEmitter} from "events";

export class Converter {
    private fromBase: number;
    private toBase: number;
    private precision: number;

    private static conversionTable = {
        "10": "A",
        "11": "B",
        "12": "C",
        "13": "D",
        "14": "E",
        "15": "F"
    };

    public static isCorrectNumber(nbr: string, base: number): boolean {
        const numbers = nbr.replace(",", "").replace(".", "");
        for (let i = 0; i < numbers.length; i++) {
            const tempNbr = parseInt(numbers[i], 16);
            if (isNaN(tempNbr) || tempNbr >= base) {
                return false;
            }
        }
        return true;
    }

    private static decimalToHexChar(nbr: number): string {
        return Converter.conversionTable[nbr] || nbr;
    }

    private static toDecimal(nbr: string, fromBase: number): number {
        if (!Converter.isCorrectNumber(nbr, fromBase)) {
            return null;
        }
        const splittedNumber = nbr.split(/\.|,/g);
        const concatenedNumber = splittedNumber[1] ? (splittedNumber[0] + splittedNumber[1]) : splittedNumber[0];

        let intPart = splittedNumber[0].length - 1;
        let result = 0;
        for (let i = 0; i < concatenedNumber.length; i++) {
            result += parseInt(concatenedNumber[i], fromBase) * Math.pow(fromBase, intPart - i);
        }
        return result;
    }

    private static convertFromDecimal(fromNbr: string, toBase: number, precision: number): string {
        if (toBase === 10) {
            return fromNbr;
        }
        const decimalNbr = fromNbr.split(".");
        if (decimalNbr === null) {
            return null;
        }
        let result: string = "";

        let intNbr = parseInt(decimalNbr[0], 10);
        while (intNbr !== 0) {
            let temp = Math.floor(intNbr / toBase);
            result = Converter.decimalToHexChar(intNbr - (temp * toBase)) + result;
            intNbr = temp;
        }
        if (result === "") {
            result = "0";
        }
        if (decimalNbr[1]) {
            let floatNbr = parseInt(decimalNbr[1], 10);
            let maxNumber = Math.pow(10, decimalNbr[1].length);
            let size = 0;

            result += ".";

            while (floatNbr != 0 && size < precision) {
                size++;
                floatNbr *= toBase;

                let division = floatNbr / maxNumber;
                let int = Math.floor(floatNbr / maxNumber);

                floatNbr = (division - int) * maxNumber;

                result += int;
            }
        }
        return result;
    }

    public static convert(fromNbr: string, fromBase: number, toBase: number, precision: number = 50): string {
        if (fromBase > 16 || fromBase < 2 || toBase > 16 || toBase < 2) {
            return null;
        } else if (fromBase === toBase || fromNbr === "") {
            return fromNbr;
        } else {
            let decimalNbr = Converter.toDecimal(fromNbr, fromBase).toString();
            if (fromNbr.split(".")[0] !== Converter.convertFromDecimal(decimalNbr,fromBase,precision).split(".")[0]){
                return null
            } else {
                return Converter.convertFromDecimal(decimalNbr, toBase, precision);
            }
        }
    }

    public Constructor(fromBase: number, toBase: number, precision: number = 20) {
        if (fromBase > 16 || fromBase < 2 || toBase > 16 || toBase < 2) {
            throw new Error("Base need to be between 2 and 16");
        }

        this.fromBase = fromBase;
        this.toBase = toBase;
        this.precision = precision;
    }

    public convert(nbr: string): string {
        return Converter.convert(nbr, this.fromBase, this.toBase, this.precision);
    }
}