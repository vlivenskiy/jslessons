
var calculator = {
operandA: '',
operandB: '',
action: '',
actionResult: '',
maxLength:13,


clearResult: function () {
	if (this.actionResult) {
		this.clearAllVars();
	}
	else if (this.action && this.operandB) {
		this.operandB = '0';
	} else {
		this.clearAllVars();
	}
},

clearAllVars : function(){
	this.operandA = '0';
	this.operandB = '';
	this.action = '';
	this.actionResult = '';
},

checkCommaInOperand: function (operand, value) {
	if (value !== '.') {
		return true;
	}
	var buf = operand + value;                

	var result = !(/(\.{2})/.test(buf) || /(\..\.)/.test(buf));

	if (!result)
		return false;

	var regex = /\./gi, result, indices = [];

	var indices = [];

	var item;
	while ((item = regex.exec(buf))) {
		indices.push(item.index);
	}
	
	if (indices.length > 1) {
		result = false;
	}

	return result;
},

updateValue: function (value) {
	if (this.actionResult || this.isMaxLengthExceeded(value)) {
		return;
	}

	if (this.action && !(this.operandB === '0' && value === '0')) {
		if (this.operandB === '0') {
			this.operandB = '';
		}

		if (this.checkCommaInOperand(this.operandB, value) && !this.isMaxLengthExceeded(this.operandB)) {
			this.operandB = this.operandB + value;
		}
	}
	else if (!(this.operandA === '0' && value === '0')) {
		if (this.operandA === '0') {
			this.operandA = '';
		}

		if (this.checkCommaInOperand(this.operandA, value) && !this.isMaxLengthExceeded(this.operandA)) {
			this.operandA = this.operandA + value;
		}              
	}
},

isMaxLengthExceeded: function (value) {
	debugger
	return value && value.length>= 13;
},

getCurrentValue: function () {                
	if (this.actionResult) {
		return this.actionResult;
	}
	else if (this.operandB) {
		return this.operandB;
	}
	else {
		return this.operandA;
	}

},
makeAction: function () {

	var floatOperandA = parseFloat(this.operandA);
	var floatOperandB = parseFloat(this.operandB);

	switch (this.action) {
		case '+': this.actionResult = floatOperandA + floatOperandB; break;
		case '-': this.actionResult = floatOperandA - floatOperandB; break;
		case '*': this.actionResult = floatOperandA * floatOperandB; break;
		case '/': this.actionResult = floatOperandA / floatOperandB; break;
	}
},
saveAction: function (action) {
	this.action = action;
}
};

calculator.clearAllVars();

$(function () {

$('#calcScreen').text(calculator.getCurrentValue());

$("button").click(function (event) {
  
	
	var currentButtonObject = $(event.currentTarget);
	var value = $(event.currentTarget).text();

	var actionName = ''

	if (currentButtonObject.hasClass('action-button')) {
		calculator.saveAction(value);
	}else if (currentButtonObject.hasClass('result-button')) {
		calculator.makeAction();
	} else if (currentButtonObject.hasClass('clear-button')) {
		calculator.clearResult();
	} else {
		calculator.updateValue(value);
	}

	$('#calcScreen').text(calculator.getCurrentValue());
	
});

});