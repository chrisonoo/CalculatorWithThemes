// *display functionality*

// ---------- JavaScript code for settings section ------------------------------

const switch1 = document.querySelector('#switch-1');
const switch2 = document.querySelector('#switch-2');
const switch3 = document.querySelector('#switch-3');
const bullet = document.querySelector('#bullet');

switch1.addEventListener('click', function () {
    bullet.style.marginRight = '0';
    document.body.classList.remove('theme2', 'theme3');
    document.body.classList.add('theme1');
});

switch2.addEventListener('click', function () {
    bullet.style.marginRight = '-45px';
    document.body.classList.remove('theme1', 'theme3');
    document.body.classList.add('theme2');
});

switch3.addEventListener('click', function () {
    bullet.style.marginRight = '-90px';
    document.body.classList.remove('theme2');
    document.body.classList.add('theme3');
});

// ---------- JavaScript code for display section ------------------------------

const display = document.querySelector('.digits');
const operatorDisplay = document.querySelector('#operator');
const signNumber = document.querySelector('#signNumber');

let digitsOnDisplay = '';
let signCurrentNumber = '';

function updateDisplay (number) {
    let floatNumber = parseFloat(number);
    let result = '';
    if (floatNumber === 0) {
        signNumber.textContent = '';
        result = '0';
    } else if (number === '0.') {
        signNumber.textContent = '';
        result = '0.';
    } else if (floatNumber * (signCurrentNumber === '-' ? -1 : 1) < 0) {
        signNumber.textContent = '-';
        result += Math.abs(floatNumber);
    } else {
        signNumber.textContent = '+';
        result += number;
    }
    display.textContent = result;
}

// ---------- JavaScript code for keys section ---------------------------------

// event listener for the numbers and comma keys
const digits = document.querySelectorAll('.digit');
digits.forEach((digit) => {
    digit.addEventListener('click', function () {
        pressKey(this.textContent);
    });
});

// pressKey function
function pressKey (key) {
    // prevent calculateAdd more than 13 characters on display
    if (digitsOnDisplay.length > 11) {
        return;
    }
    // prevents entering only zeros as a first number
    else if (display.textContent === '0' && key === '0') {
        digitsOnDisplay = '';
        return;
    }
    // prevents entering zero before number
    else if (digitsOnDisplay === '0' && display.textContent === '0' && key !== '0') {
        digitsOnDisplay = key;
    } else {
        digitsOnDisplay += key;
    }

    operatorDisplay.textContent = '';
    updateDisplay(digitsOnDisplay);
}

// event listener for the dot key
const dot = document.querySelector('#dot');
dot.addEventListener('click', function () {
    pressDot();
});

// pressDot function
function pressDot () {
    // prevent calculateAdd more than 13 characters on display
    if (digitsOnDisplay.length > 11) {
        return;
    }
    // calculateAdd 0. if dot is pressed
    else if ((digitsOnDisplay === '' || digitsOnDisplay === '0') && typeOfOperator === '') {
        digitsOnDisplay = '0.';
        updateDisplay(digitsOnDisplay);
        return;
    }
    // prevents the insertion of a period when an operator is selected
    else if ((digitsOnDisplay === '' || digitsOnDisplay === '0') && typeOfOperator !== '') {
        digitsOnDisplay = '0.';
        updateDisplay(digitsOnDisplay);
        operatorDisplay.textContent = '';
        return;
    }
    // prevent enter dwo dots (search in text need regex)
    else if (display.innerText.search(/\./) !== -1) {
        return;
    }
    digitsOnDisplay += '.';
    updateDisplay(digitsOnDisplay);
    operatorDisplay.textContent = '';
}

// event listener for the sign key
const sign = document.querySelector('#sign');
sign.addEventListener('click', function () {
    pressSign();
});

// pressDot function
function pressSign () {
    if (digitsOnDisplay === '0' || display.textContent === '0') {
        signCurrentNumber = '';
    } else if (digitsOnDisplay !== '0' && digitsOnDisplay !== '') {
        if (signCurrentNumber === '') {
            signCurrentNumber = '-';
        } else if (signCurrentNumber === '-') {
            signCurrentNumber = '+';
        } else {
            signCurrentNumber = '-';
        }
    }
    signNumber.textContent = signCurrentNumber;
}


// event listener for the operators keys
const operators = document.querySelectorAll('.operator');
operators.forEach((operator) => {
    operator.addEventListener('click', function () {
        pressOperator(this.textContent);
    });
});

// pressOperator function
function pressOperator (operator) {
    // prevent press any operators before specifying a number
    if (digitsOnDisplay === '' && calculatorCalculation === 0) {
        operatorDisplay.textContent = operator;
        typeOfOperator = operator;
        display.textContent = '0';
        return;
    } else if (digitsOnDisplay === '') {
        display.textContent = '0';
        operatorDisplay.textContent = '';
        return;
    }
    calculatorCalculation = calculate();
    digitsOnDisplay = calculatorCalculation;
    operatorDisplay.textContent = operator;
    signCurrentNumber = '';
    updateDisplay(digitsOnDisplay);
    typeOfOperator = operator;
    digitsOnDisplay = '';
}

// event listener for the del key
const delKey = document.querySelector('#del');
delKey.addEventListener('click', function () {
    pressDelete();
});

// pressDelete function
function pressDelete () {
    if (digitsOnDisplay.length > '1') {
        digitsOnDisplay = digitsOnDisplay.slice(0, -1);
        updateDisplay(digitsOnDisplay);
    } else {
        display.textContent = '0';
        digitsOnDisplay = '';
        operatorDisplay.textContent = '';
        signNumber.textContent = '';
    }
}

// event listener for the reset key
const resetKey = document.querySelector('#reset');
resetKey.addEventListener('click', function () {
    pressReset();
});

// pressReset function
function pressReset () {
    digitsOnDisplay = '';
    display.textContent = '0';
    calculatorCalculation = 0;
    operatorDisplay.textContent = '';
    signNumber.textContent = '';
    signCurrentNumber = '';
}

// event listener for the equals key
const equalsKey = document.querySelector('#equals');
equalsKey.addEventListener('click', function () {
    pressEquals();
});

// pressEquals function
function pressEquals () {
    // prevent press = before without specifying a number
    if (digitsOnDisplay === '' && calculatorCalculation === 0) {
        operatorDisplay.textContent = '=';
        return;
    } else if (digitsOnDisplay === '' && calculatorCalculation !== 0) {
        operatorDisplay.textContent = '=';
        signCurrentNumber = '';
        updateDisplay(calculatorCalculation);
        typeOfOperator = '';
        digitsOnDisplay = '';
        calculatorCalculation = 0;
        return;
    }
    calculatorCalculation = calculate();
    digitsOnDisplay = calculatorCalculation;
    operatorDisplay.textContent = '=';
    signCurrentNumber = '';
    updateDisplay(digitsOnDisplay);
    typeOfOperator = '';
    digitsOnDisplay = '';
    calculatorCalculation = 0;
}

// ---------- JavaScript code for calculator logic ------------------------------

let calculatorCalculation = 0;
let typeOfOperator = '';

function calculate () {
    switch (typeOfOperator) {
        case '+':
            return roundNumber(calculateAdd(digitsOnDisplay));
        case '-':
            return roundNumber(calculateSubtract(digitsOnDisplay));
        case 'x':
            return roundNumber(calculateMultiply(digitsOnDisplay));
        case '/':
            return roundNumber(calculateDivide(digitsOnDisplay));
        default:
            calculatorCalculation = parseFloat(digitsOnDisplay) * (signCurrentNumber === '-' ? -1 : 1);
            return calculatorCalculation;
    }
}

// math functions
function calculateAdd (number) {
    return calculatorCalculation + (parseFloat(number) * (signCurrentNumber === '-' ? -1 : 1));
}

function calculateSubtract (number) {
    return calculatorCalculation - (parseFloat(number) * (signCurrentNumber === '-' ? -1 : 1));
}

function calculateMultiply (number) {
    return calculatorCalculation * (parseFloat(number) * (signCurrentNumber === '-' ? -1 : 1));
}

function calculateDivide (number) {
    if (parseFloat(number) === 0) {
        return 'division by zero';
    }
    return calculatorCalculation / (parseFloat(number) * (signCurrentNumber === '-' ? -1 : 1));
}

function roundNumber (number) {
    if (number === 'division by zero') {
        return 'division by zero';
    }

    let convertedNumber;
    let roundedDecimal = (Math.round(parseFloat(number) * 100000000000) / 100000000000);

    if (roundedDecimal.toString().length > 12) {
        convertedNumber = roundedDecimal.toExponential(7);
    } else {
        convertedNumber = roundedDecimal;
    }
    console.log(number, roundedDecimal, roundedDecimal.toString().length, convertedNumber);
    return convertedNumber;
}


