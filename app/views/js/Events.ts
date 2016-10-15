import {Converter} from "./Converter";

(() => {
    const inputToConvert = <HTMLInputElement>document.getElementById("from-number"),
        inputConverted = <HTMLInputElement>document.getElementById("to-number"),
        selectFromBase = <HTMLSelectElement> document.getElementById("from-base"),
        selectToBase = <HTMLSelectElement> document.getElementById("to-base");

    function isCorrectHexChar(key: string, base: number): boolean {
        const keyNumber = parseInt(key, 16);
        return !(isNaN(keyNumber) || (keyNumber >= base));
    }

    function convert(): void {
        let convertedValue = Converter.convert(inputToConvert.value,parseInt(selectFromBase.value,10),parseInt(selectToBase.value,10));
        inputConverted.value = convertedValue === null ? "Number too big" : convertedValue;
    }

    inputToConvert.addEventListener("keypress", (e) => {
        const floatingChars = [",", "."];

        const input: HTMLInputElement = <HTMLInputElement>e.target;
        const key = e.key.toUpperCase();

        if (input.value.length > 0 && ~floatingChars.indexOf(key)) {
            for (let i = 0; i < floatingChars.length; i++) {
                if (~input.value.indexOf(floatingChars[i])) {
                    e.preventDefault();
                    break;
                }
            }
        } else {
            !isCorrectHexChar(key, parseInt(selectFromBase.value, 10)) && e.preventDefault(); 
        }
    });

    inputToConvert.addEventListener("paste", (e: ClipboardEvent) => {
        const base = parseInt(selectFromBase.value, 10);

        if (!Converter.isCorrectNumber(e.clipboardData.getData("text/plain"), base)) {
            e.preventDefault();
        }
    });


    selectFromBase.addEventListener("change", (e) => {
        const base = parseInt((<HTMLSelectElement>e.target).value, 10);

        if (!Converter.isCorrectNumber(inputToConvert.value, base)) {
            inputToConvert.value = "";
        }
        convert();
    });

    selectToBase.addEventListener("change", convert);

    inputToConvert.addEventListener("keyup", convert);
})();