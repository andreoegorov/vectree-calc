const numberButtons = document.getElementsByClassName('number');
const dotButton = document.getElementById("dot");
const addButton = document.getElementById("add");
const subButton = document.getElementById("subtract");
const mulButton = document.getElementById("multiply");
const divButton = document.getElementById("divide");
const equalsButton = document.getElementById("equals");
const percentButton = document.getElementById("percent");
const negButton = document.getElementById("inverse-sign");
const backspaceButton = document.getElementById("backspace");
const clearButton = document.getElementById("clear");

let expessionArray = ['0'];

const display = {
    mainString:"0",
    additionalString:"",
    mainDisplayMaxlength: 11,
    additionalDisplayMaxlength: 34,
    mainStringDOMElement:null,
    additionalStringDOMElement:null,
    sliceString(string,maxLength){
        if (string.length >= maxLength && string != 'divide by zero') 
            return '..' + string.slice(string.length - maxLength, string.length);
        else return string;
    },
    deleteAdditionalString(){
        this.additionalString = '';
    },
    update(){
        this.mainString = expessionArray.toString();
        this.mainString = this.mainString.replaceAll(',','');
        display.mainStringDOMElement.innerText  = this.sliceString(this.mainString, this.mainDisplayMaxlength);
        display.additionalStringDOMElement.innerText = this.sliceString(this.additionalString, this.additionalDisplayMaxlength);
    }
}

display.mainStringDOMElement  = document.getElementById("main-string");
display.additionalStringDOMElement = document.getElementById("additional-string");
display.update();

for (let number of numberButtons){
    number.addEventListener('click', numInput);
}
addButton.addEventListener('click', ()=>{ operateLogic('+') });
subButton.addEventListener('click', ()=>{ operateLogic('-') });
mulButton.addEventListener('click', ()=>{ operateLogic('*') });
divButton.addEventListener('click', ()=>{ operateLogic('/') });
percentButton.addEventListener('click', percentInput);
dotButton.addEventListener('click', dotInput);
negButton.addEventListener('click', invertNum);
equalsButton.addEventListener('click', calcEquals);
clearButton.addEventListener('click', clearInput);
backspaceButton.addEventListener('click', backspaceInput);

function numInput(event){
    const lastIndex = findLastIndex(expessionArray);
    if (expessionArray[lastIndex] != '%'){
        if (expessionArray[lastIndex] == '0' ) expessionArray[lastIndex] = event.target.value;
        else expessionArray[lastIndex] += event.target.value;
    }
    display.update();
}
function percentInput(){
    const lastIndex = findLastIndex(expessionArray);
    if (expessionArray[lastIndex] !== '%' && expessionArray[lastIndex] !== '' ){
        expessionArray[lastIndex] = parseFloat(expessionArray[lastIndex]);
        expessionArray.push('%');
        display.update();
    }
}
function dotInput(){
    const lastIndex = findLastIndex(expessionArray); 
    if (!expessionArray[lastIndex].toString().includes('.') && 
        expessionArray[lastIndex] !== '%' &&
        expessionArray[lastIndex] !== '') {        
        expessionArray[lastIndex] +='.';
        display.update(); 
    }
}
function calcEquals() {
    const lastIndex = findLastIndex(expessionArray);
    if (expessionArray[lastIndex] === '') {
        expessionArray.pop();
        expessionArray.pop();
    }
    if (!isNaN(expessionArray[lastIndex])) expessionArray[lastIndex] = parseFloat(expessionArray[lastIndex]);
    display.additionalString = expessionArray.toString().replaceAll(',','') + '=';
    
    
    expessionArray.forEach(element => {
        expessionArray = calcExpessionPercent(expessionArray,element);
    });
    expessionArray = calcExpession(expessionArray);
    expessionArray = checkDivideOnZero(expessionArray);
    if (expessionArray[0] != 'divide by zero') {
        expessionArray[0] = +Number(expessionArray[0]).toFixed(8);
        if (expessionArray[0].toString().length >= 11) expessionArray[0] = Number(expessionArray[0]).toExponential(4);
    }
    display.update();
}
function invertNum(){
    let lastIndex = findLastIndex(expessionArray);
    if (expessionArray[lastIndex] > 0 ) expessionArray[lastIndex] = -Math.abs(expessionArray[lastIndex]);
    else if (expessionArray[lastIndex] < 0) expessionArray[lastIndex] = Math.abs(expessionArray[lastIndex]);
    display.update();
}
function clearInput(){
    display.additionalString = '';
    expessionArray = [0];
    enableButtons();
    display.update();
}
function backspaceInput(){
    const lastIndex = findLastIndex(expessionArray);
    
    if (expessionArray[lastIndex] === ''){
        expessionArray.pop();
        expessionArray.pop();
    }else{
        let str = expessionArray[lastIndex].toString();
        
        if (str.length > 1){
            str = str.slice(0,str.length - 1);
            expessionArray[lastIndex] = str;
        }else{
            if (lastIndex) {
                if (expessionArray[lastIndex] == '%') expessionArray.pop();
                else expessionArray[lastIndex] = '';
            }  
            else expessionArray[lastIndex] = Number(0);
        }
    }
        
    display.update();
}
function operateLogic(opr){
    const lastIndex = findLastIndex(expessionArray);
    display.deleteAdditionalString();
    if (!isNaN(expessionArray[lastIndex]) && 
        expessionArray[lastIndex] !=='') expessionArray[lastIndex] = parseFloat(expessionArray[lastIndex]);
    
    if (expessionArray[lastIndex] !== ''){
        expessionArray.push(opr);
        expessionArray.push('');
        display.update();
    }else{
        expessionArray[lastIndex-1] = opr;
        display.update();
    }
}
function clearNullinArray(array){
    array = array.filter(element =>{
        return element != null;
    });
    return array;
}
function checkDivideOnZero(array){
    if (!isFinite(array[0]) || isNaN(array[0])){
        array[0] = 'divide by zero';
        disableButtons();
    }
    return array;
}
function disableButtons(){
    dotButton.disabled = true;
    addButton.disabled = true;
    subButton.disabled = true;
    mulButton.disabled = true;
    divButton.disabled = true;
    equalsButton.disabled = true;
    percentButton.disabled = true;
    negButton.disabled = true;
    backspaceButton.disabled = true;
    for (let number of numberButtons){
        number.disabled = true;
    }
}
function enableButtons(){
    dotButton.disabled = false;
    addButton.disabled = false;
    subButton.disabled = false;
    mulButton.disabled = false;
    divButton.disabled = false;
    equalsButton.disabled = false;
    percentButton.disabled = false;
    negButton.disabled = false;
    backspaceButton.disabled = false;
    for (let number of numberButtons){
        number.disabled = false;
    }
}
function calcExpession(array){
    array.forEach(element => {
        array = calcExpessionOperate(array,element,'*', '/');
    });
    
    array.forEach(element => {
        array = calcExpessionOperate(array,element,'+', '-');
    });
    return array;
}
function calcExpessionPercent(array, elem){
    if (elem == '%'){
        let index = array.indexOf(elem);
        let tempArray = array.slice(0,index-2);
        
        if (index <= 2) {
            array[index] = null;
            array[index-1] = 0;
        }else{
            tempArray = calcExpession(tempArray);
            array[index] = null;
            array[index-1] = calcOperator(elem,tempArray[0],expessionArray[index-1]);
        }
        array = clearNullinArray(array);
    }
    return array;
}
function calcExpessionOperate(array,elem, opr1, opr2){
    if(elem == opr1 || elem == opr2){
        let index = array.indexOf(elem);
        array[index] =  calcOperator(elem,array[index-1],array[index+1]);
        array[index-1] = null;
        array[index+1] = null;
        array = clearNullinArray(array);
    }
    return array;
}
function calcOperator(operator ,operand1 ,operand2){
    switch (operator){
      case "*": return operand1 * operand2;
      case "/": return operand1 / operand2;
      case "+": return operand1 + operand2;
      case "-": return operand1 - operand2;
      case "%": return ((Math.abs(operand1) * Math.abs(operand2))/100);
    }
}
function findLastIndex(array){ return array.length - 1 }

