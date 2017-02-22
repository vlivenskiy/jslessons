function Calculator(maxLength, maxLengthExpCorrection) {
	var self = this;
	this.maxLength = maxLength;
	this.maxLengthExpCorrection = maxLengthExpCorrection;

	function clearAllVars() {
		self.operandA = '0';
		self.operandB = '';
		self.action = '';
		self.actionResult = '';
		self.memoryResult = 0;
	}

	this.clearResult = function() {
		if (this.actionResult) {
			clearAllVars();
		}
		else if (this.action && this.operandB) {
			this.operandB = '0';
		} else {
			clearAllVars();
		}
	};

	this.initCalc = function() {
		clearAllVars();
	};

	this.checkCommaInOperand = function(operand, value) {
		if (value !== '.') {
			return true;
		}
		var buf = operand + value;

		var result = !(/(\.{2})/.test(buf) || /(\..\.)/.test(buf));

		if (!result) {
			return false;
		}

		var regex = /\./gi, indices = [];

		var item;
		while ((item = regex.exec(buf))) {
			indices.push(item.index);
		}

		if (indices.length > 1) {
			result = false;
		}

		return result;
	};

	this.updateValue = function(value) {
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
	};

	this.isMaxLengthExceeded = function(value) {
		return value && value.length >= 13;
	};

	this.getCurrentValue = function() {
		if (this.actionResult) {
			return this.actionResult;
		}
		else if (this.operandB) {
			return this.operandB;
		}
		else {
			return this.operandA;
		}

	};

	this.makeAction = function() {

		var floatOperandA = parseFloat(this.operandA);
		var floatOperandB = parseFloat(this.operandB);

		switch (this.action) {
			case '+': this.actionResult = floatOperandA + floatOperandB; break;
			case '-': this.actionResult = floatOperandA - floatOperandB; break;
			case '*': this.actionResult = floatOperandA * floatOperandB; break;
			case '/': this.actionResult = floatOperandA / floatOperandB; break;
		}

		this.prepareReault();
	}

	this.prepareReault = function() {
		if (this.actionResult.toString().length >= this.maxLength) {
			this.actionResult = this.actionResult.toExponential(this.maxLength - this.maxLengthExpCorrection);
		}
	};

	this.saveAction = function(action) {
		this.action = action;
	};

	this.memoryAction = function(memoryOperation) {
		var currentValue = this.getCurrentValue();
		switch (memoryOperation) {
			case 'm-':
			case 'm+':
				if (currentValue != '0') {
					var operationCorrection = 'm-' === memoryOperation ? -1 : 1;
					this.memoryResult = parseFloat(this.memoryResult) + operationCorrection * currentValue;
				} break;
			case 'mrc': {
				this.actionResult = this.memoryResult;
				this.memoryResult = 0;
			} break;
		}
	};
}

function CalulatorCreator() {
	var calculator = new Calculator(13, 6);
	calculator.initCalc();

	return calculator;
}

$(function() {
	var calculator = CalulatorCreator();

	var currentValue = calculator.getCurrentValue();
	$('#calcScreen').text(currentValue);

	$('button').click(function (event) {
		var screenValue = $('#calcScreen').text();
		var currentButtonObject = $(event.currentTarget);
		var value = $(event.currentTarget).text();

		if (currentButtonObject.hasClass('action-button')) {
			calculator.saveAction(value);
		} else if (currentButtonObject.hasClass('result-button')) {
			calculator.makeAction();
		} else if (currentButtonObject.hasClass('clear-button')) {
			calculator.clearResult();
		} else if (currentButtonObject.hasClass('memory-button')) {
			calculator.memoryAction(value, screenValue);
		}
		else {
			calculator.updateValue(value);
		}

		$('#calcScreen').text(calculator.getCurrentValue());
	});
});