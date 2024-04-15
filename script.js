const calculator = document.getElementById('calculator');
const displayCurrent = document.getElementById('current-operand');
const displayPrevious = document.getElementById('previous-operand');

const numberButtons = document.querySelectorAll('.number');
const operationButtons = document.querySelectorAll('.operation');

const equalButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const deleteButton = document.getElementById('delete');
const dotButton = document.getElementById('dot');

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    appendNumber(button.textContent);
    updateDisplay();
  });
});

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    chooseOperation(button.textContent);
    updateDisplay();
  });
});

clearButton.addEventListener('click', () => {
    clear();
    displayCurrent.focus(); // Set focus back to the calculator display
    updateDisplay();
});

deleteButton.addEventListener('click', () => {
    deleteNumber();
    displayCurrent.focus(); // Set focus back to the calculator display
    updateDisplay();
});

equalButton.addEventListener('click', () => {
    compute();
    updateDisplay();
});
dotButton.addEventListener('click', appendDot);

let currentOperand = '';
let previousOperand = '';
let operation = null;

function appendNumber(number) {
    if (number === '.' && currentOperand.includes('.')) 
        return;

    currentOperand = currentOperand.toString() + number.toString();
}

function chooseOperation(operator) {
    if (operator === '√' && currentOperand !== '') {
        operation = operator;
        compute();
        return;
    }

    if (currentOperand === '') 
        return;

    if (previousOperand !== '') {
        compute();
    }

    operation = operator;
    previousOperand = currentOperand;
    currentOperand = '';
    updateDisplay();
}

function compute() {
    let computation;
    const current = parseFloat(currentOperand);

    if (operation === '√') {
        if (current < 0) {
            alert("Negative numbers cannot have a real square root");
            return;
        }
        computation = Math.sqrt(current);
    } else {
        const prev = parseFloat(previousOperand);
        if (isNaN(prev) || isNaN(current)) 
            return;

        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                computation = prev / current;
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }
    }

    currentOperand = computation.toFixed(10).replace(/\.?0+$/, ''); // Convert computation to a string with limited precision
    operation = undefined;
    previousOperand = '';
    updateDisplay();
}

function updateDisplay() {
    displayCurrent.textContent = currentOperand;
    displayPrevious.textContent = previousOperand + ' ' + (operation || '');
}

function clear() {
    currentOperand = '';
    previousOperand = '';
    operation = null;
    updateDisplay();    
}

function deleteNumber() {
    currentOperand = currentOperand.toString().slice(0, -1);
    updateDisplay();
}

function appendDot() {
    if (currentOperand.includes('.')) 
        return; 

    if (currentOperand === '') {
        currentOperand = '0.'; 
    } else {
        currentOperand += '.';
    }
    updateDisplay();
}

document.addEventListener('keydown', (event) => {
    if (event.key >= '0' && event.key <= '9') {
        appendNumber(event.key);
    } else if (event.key === '.') {
        appendDot();
    } else if (event.key === 'Backspace') {
        deleteNumber();
    } else if (event.key === 'Enter' || event.key === '=') {
        compute();
        event.preventDefault(); // Prevent the default behavior of the Enter key
        displayCurrent.focus(); // Set focus back to the calculator display
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        chooseOperation(event.key);
    } else if (event.key === 'Escape') {
        clear();
    } else if (event.key === 'r' || event.key === 'R') {
        chooseOperation('√');
    }
    updateDisplay();
});

