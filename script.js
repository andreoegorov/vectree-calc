const numberButtons = document.getElementsByClassName('number');
const dotButton = document.getElementById("dot");

const addButton = document.getElementById("add");
const subButton = document.getElementById("subtract");
const mulButton = document.getElementById("multiply");
const divButton = document.getElementById("divide");
const equalsButton = document.getElementById("equals");

const percentButton = document.getElementById("percent");
const sqrButton = document.getElementById("square-degree");
const sqrtButton = document.getElementById("square-root"); 
const negButton = document.getElementById("inverse-sign"); 

const backspaceButton = document.getElementById("backspace");
const clearButton = document.getElementById("clear");
const bracketOpenButton = document.getElementById("bracket-open");
const bracketCloseButton = document.getElementById("bracket-close");


const display = {
    mainString:"3-2*2+6/2", //2
    additionalString:"",
    mainStringDOMElement:null,
    additionalStringDOMElement:null,
    update(){
        display.mainStringDOMElement.innerText  = this.mainString;
        display.additionalStringDOMElement.innerText = this.additionalString;
    }

}

display.mainStringDOMElement  = document.getElementById("main-string");
display.additionalStringDOMElement = document.getElementById("additional-string");
display.update();

equalsButton.onclick = function(){
    display.additionalString = display.mainString + "=";
    display.mainString = parseString( "+" ,display.mainString);
    display.update();
}

function parseString(opr, str){
    const reg = str.match(`\\d+\\${opr}\\d+`);
    const string = str.replace(reg,parseExp(opr, reg[0]));
    return string;
}

function parseExp(opr ,str){
    const index = str.indexOf(opr);
    return operateBinary(opr, str.slice(0,index), str.slice(index+1, str.length));
}

function operateBinary(operator ,operand1 ,operand2){
    switch (operator){
      case "+": return Number(operand1) + Number(operand2);
    }
}
function operateUnary(operator ,operand1){
    switch (operator){
        case "x2": return Math.pow(operand1,2);
      }
}