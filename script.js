let expression = "";

let angleMode = "DEG";

const expressionDisplay =
    document.getElementById("expression");

const resultDisplay =
    document.getElementById("result");

const historyDisplay =
    document.getElementById("historyDisplay");

const angleButton =
    document.getElementById("angleMode");


/* Display */

function updateDisplay() {

    expressionDisplay.textContent =
        expression || "0";
}


/* Insert value */

function insertValue(value) {

    expression += value;

    updateDisplay();
}


/* Clear */

function clearCalculator() {

    expression = "";

    expressionDisplay.textContent = "0";

    resultDisplay.textContent = "";

    historyDisplay.textContent = "";
}


/* Delete */

function deleteLast() {

    expression =
        expression.slice(0, -1);

    updateDisplay();
}


/* Angle mode */

function toggleAngleMode() {

    if (angleMode === "DEG") {

        angleMode = "RAD";

    } else {

        angleMode = "DEG";
    }

    angleButton.textContent =
        angleMode;
}


/* Convert degrees to radians */

function toRadians(value) {

    return value * Math.PI / 180;
}


/* Factorial */

function factorial(number) {

    if (number < 0) {
        throw new Error("Invalid factorial");
    }

    if (number === 0 || number === 1) {
        return 1;
    }

    let answer = 1;

    for (let i = 2; i <= number; i++) {

        answer *= i;
    }

    return answer;
}


/* Scientific functions */

function scientific(type) {

    try {

        let value = evaluateExpression();

        let answer;


        switch (type) {

            case "sin":

                answer =
                    Math.sin(
                        angleMode === "DEG"
                            ? toRadians(value)
                            : value
                    );

                break;


            case "cos":

                answer =
                    Math.cos(
                        angleMode === "DEG"
                            ? toRadians(value)
                            : value
                    );

                break;


            case "tan":

                answer =
                    Math.tan(
                        angleMode === "DEG"
                            ? toRadians(value)
                            : value
                    );

                break;


            case "asin":

                answer = Math.asin(value);

                if (angleMode === "DEG") {
                    answer =
                        answer * 180 / Math.PI;
                }

                break;


            case "acos":

                answer = Math.acos(value);

                if (angleMode === "DEG") {
                    answer =
                        answer * 180 / Math.PI;
                }

                break;


            case "log":

                answer = Math.log10(value);

                break;


            case "ln":

                answer = Math.log(value);

                break;


            case "sqrt":

                answer = Math.sqrt(value);

                break;


            case "factorial":

                answer = factorial(value);

                break;
        }


        showResult(answer);

    } catch {

        showError();
    }
}


/* Square */

function square() {

    try {

        const value =
            evaluateExpression();

        showResult(value * value);

    } catch {

        showError();
    }
}


/* Power */

function power() {

    expression += "^";

    updateDisplay();
}


/* Change sign */

function toggleSign() {

    if (!expression) return;

    expression =
        `(-${expression})`;

    updateDisplay();
}


/* Evaluate */

function evaluateExpression() {

    let exp = expression;


    /* Constants */

    exp = exp.replace(/π/g, "Math.PI");

    exp = exp.replace(/\be\b/g, "Math.E");


    /* Operators */

    exp = exp.replace(/×/g, "*");

    exp = exp.replace(/÷/g, "/");

    exp = exp.replace(/\^/g, "**");


    /* Percentage */

    exp = exp.replace(
        /(\d+(?:\.\d+)?)%/g,
        "($1/100)"
    );


    /* Security */

    if (!/^[0-9+\-*/().%\sA-Za-z_]*$/.test(exp)) {

        throw new Error("Invalid expression");
    }


    /*
       Only Math functions/constants
       are allowed here.
    */

    const allowed =
        new Function(
            `"use strict";
             return (${exp})`
        );


    const answer = allowed();


    if (!Number.isFinite(answer)) {

        throw new Error("Invalid result");
    }


    return answer;
}


/* Calculate */

function calculate() {

    try {

        const answer =
            evaluateExpression();


        historyDisplay.textContent =
            expression + " =";


        showResult(answer);


        expression =
            formatNumber(answer);

    } catch {

        showError();
    }
}


/* Show result */

function showResult(answer) {

    resultDisplay.textContent =
        formatNumber(answer);
}


/* Format numbers */

function formatNumber(number) {

    if (Math.abs(number) < 1e-12) {

        number = 0;
    }


    if (Number.isInteger(number)) {

        return number.toString();
    }


    return Number(
        number.toPrecision(12)
    ).toString();
}


/* Error */

function showError() {

    resultDisplay.textContent =
        "Error";
}


/* Keyboard support */

document.addEventListener(
    "keydown",
    function(event) {

        const key = event.key;


        if (
            /[0-9]/.test(key) ||
            ["+", "-", "*", "/", ".", "(", ")"].includes(key)
        ) {

            let value = key;

            if (key === "*") {
                value = "×";
            }

            if (key === "/") {
                value = "÷";
            }

            insertValue(value);

            return;
        }


        if (key === "Enter" || key === "=") {

            calculate();

            return;
        }


        if (key === "Backspace") {

            deleteLast();

            return;
        }


        if (key === "Escape") {

            clearCalculator();

            return;
        }


        if (key === "%") {

            insertValue("%");

            return;
        }
    }
);


/* Initial display */

updateDisplay();