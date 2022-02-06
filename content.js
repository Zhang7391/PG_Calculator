//*****************************************************/
//                                                     /
// Copyright (c) 2021 zhang7391 All rights reserved    /
//             <zhang7391@protonmail.com>              /
//                                                     /
// License: GNU General Public License v3.0            /
// Github: https://github.com/Zhang7391/PG_Calculator  /
//                                                     /
// Please keep this information if you use this code.  /
//                                                     /
//*****************************************************/

class core
{
	calculation(formula)
	{
		if(/log\s*\(\s*\)/.test(formula)) return ["no have any value's log()"];
		else if(/ln\s*\(\s*\)/.test(formula)) return ["no have any value's ln()"];
			
		const tool = new toolbox();
		const weighting =
		{
			"(" : 0,
			"+" : 1,
			"-" : 1,
			"*" : 2,
			"/" : 2,
			"^" : 3
		};

		let isSymbol = false;
		let noMul = false, noMul2 = false;
		let needChange = false, endBracket = false;
		let numStack = [], operStack = [];

		for(let x of tool.plusSplit(tool.standardization(formula)))
		{
			if(x === " " || !/[\*\^\-\+\/\s\d\.e\(\)]|log|ln/.test(x)) continue;
			
			let nd;

			switch(x)
			{
			case "(":
				if(!endBracket) endBracket = true;
				if(needChange)
				{
					operStack.pop();
					operStack.push("(-");
				}
				else if(noMul || noMul2) operStack.push("(*");
				else operStack.push(x);
				noMul = noMul2 = needChange = isSymbol = false;
				break;
			case "e":
				numStack.push("2.71828182")
				noMul = noMul2 = needChange = isSymbol = false;
				break;
			case "^":
				noMul = noMul2 = needChange = isSymbol = false;
				operStack.push(x);
				break;
			case "*":			
			case "-":
			case "/":
			case "+":
				if(operStack.length === 0) operStack.push(x);
				else if(weighting[x] > weighting[operStack[operStack.length - 1]]) operStack.push(x);
				else
				{
					while(weighting[operStack[operStack.length - 1]] >= weighting[x] && operStack.length !== 0) 
					{
						if(operStack[operStack.length - 1] !== "/" && operStack[operStack.length - 1] !== "-" && operStack[operStack.length - 1] !== "^") numStack.push(`${numStack.pop()} ${numStack.pop()} ${operStack.pop()}`);
						else
						{
							if(operStack.length === 1 && numStack.length === 1)
							{
								switch(operStack[0])
								{
								case "-":
									operStack = new Array();
									numStack.push("-" + numStack.pop());
									break;
								case "+":
									operStack = new Array();
									break;
								default:
									nd = numStack.pop();
									numStack.push(`${numStack.pop()} ${nd} ${operStack.pop()}`);
									break;
								}
							}
							else
							{
								nd = numStack.pop();
								numStack.push(`${numStack.pop()} ${nd} ${operStack.pop()}`);
							}
						}
					}
					operStack.push(x);
				}
				if(x === "-") needChange = true;
				else needChange = false;
				noMul = noMul2 = isSymbol = false;
				break;
			case ")":
				if(endBracket) endBracket = false;
				while(!/\(/.test(operStack[operStack.length - 1]) && operStack.length !== 0)
				{
					if(operStack[operStack.length - 1] !== "/" && operStack[operStack.length - 1] !== "-") numStack.push(`${numStack.pop()} ${numStack.pop()} ${operStack.pop()}`);
					else
					{
						nd = numStack.pop();
						numStack.push(`${numStack.pop()} ${nd} ${operStack.pop()}`);
					}
				}
				if(operStack[operStack.length - 1] === "(") operStack.pop();
				else if(operStack[operStack.length - 1] === "(*")
				{
					operStack.pop();
					numStack.push(`${numStack.pop()} ${numStack.pop()} *`);
				}
				else if(operStack[operStack.length - 1] === "(-")
				{
					operStack.pop();
					if(numStack.length===1) numStack.push(`${numStack.pop()} -1 *`);
					else
					{
						nd = numStack.pop();
						numStack.push(`${numStack.pop()} ${nd} -`);
					}
				}
				noMul = needChange = isSymbol = false;
				noMul2 = true;
				break;
			default:
				if(/log/.test(x))
				{
					let data = x.slice(x.indexOf('(')+1, -1);
					
					if(data === "") return ["no have any value's log()"];
					else
					{
						data = this.calculation(data)[0];
						isSymbol = true;
					}
					
					if(data instanceof Decimal) numStack.push(data.log().toFixed(8).toString());
					else return ["Unlawful log value"];
				}
				else if(/ln/.test(x))
				{
					let data = x.slice(x.indexOf('(')+1, -1);
					
					if(data === "") return ["no have any value's ln()"];
					else
					{
						data = this.calculation(data)[0];
						isSymbol = true;
					}
					
					if(data instanceof Decimal) numStack.push(data.ln().toFixed(8).toString());
					else return ["Unlawful ln value"];
				}
				else if(isNaN(parseFloat(x))) return ["Error! Unlawful Infix Notation!"];
				
				if(noMul && 0 > x && !isSymbol)
				{
					noMul = false;
					if(operStack.length === 0) operStack.push("+");
					else if(weighting["+"] > weighting[operStack[operStack.length - 1]]) operStack.push("+");
					else
					{
						while(weighting[operStack[operStack.length - 1]] >= weighting["+"] && operStack.length !== 0)
						{
							if(operStack[operStack.length - 1] !== "/" && operStack[operStack.length - 1] !== "-" && operStack[operStack.length - 1] !== "^") numStack.push(`${numStack.pop()} ${numStack.pop()} ${operStack.pop()}`);
							else
							{
								nd = numStack.pop();
								numStack.push(`${numStack.pop()} ${nd} ${operStack.pop()}`);
							}
						}
						operStack.push("+");
					}
				}
				if(noMul) return ["A space between two numbers"];	//Reject a space between two numbers.
				else if(noMul2) 
				{
					if(x >= 0) numStack.push(`${numStack.pop()} ${x} *`);
					else numStack.push(`${numStack.pop()} ${-x} -`);
				}
				else if(!isSymbol) numStack.push(x.toString());
				noMul = true;
				noMul2 = needChange = isSymbol = false;
				break;
			}
		}
		while(!!operStack.length) 
		{
			let nd;
			if(endBracket)
			{
				while(!/\(/.test(operStack[operStack.length - 1]) && operStack.length !== 0)
				{
					if(operStack[operStack.length - 1] !== "/" && operStack[operStack.length - 1] !== "-" && operStack[operStack.length - 1] !== "^") numStack.push(`${numStack.pop()} ${numStack.pop()} ${operStack.pop()}`);
					else
					{
						nd = numStack.pop();
						numStack.push(`${numStack.pop()} ${nd} ${operStack.pop()}`);
					}
				}
				if(operStack[operStack.length - 1] === "(") operStack.pop();
				else if(operStack[operStack.length - 1] === "(*")
				{
					operStack.pop();
					numStack.push(`${numStack.pop()} ${numStack.pop()} *`);
				}
				else if(operStack[operStack.length - 1] === "(-")
				{
					operStack.pop();
					if(numStack.length===1) numStack.push(`${numStack.pop()} -`);
					else
					{
						nd = numStack.pop();
						numStack.push(`${numStack.pop()} ${nd} -`);
					}
				}
				endBracket = false;
			}
			else if(operStack.length === 1 && numStack.length === 1)
			{
				switch(operStack[0])
				{
				case "-":
					operStack = new Array();
					numStack.push("-" + numStack.pop());
					break;
					
				case "+":
					operStack = new Array();
					break;
				
				default:
					nd = numStack.pop();
					numStack.push(`${numStack.pop()} ${nd} ${operStack.pop()}`);
					break;
				}
			}
			else if(operStack[operStack.length - 1] !== "/" && operStack[operStack.length - 1] !== "-" && operStack[operStack.length - 1] !== "^") numStack.push(`${numStack.pop()} ${numStack.pop()} ${operStack.pop()}`);
			else
			{
				nd = numStack.pop();
				numStack.push(`${numStack.pop()} ${nd} ${operStack.pop()}`);
			}
		}		
		if(numStack.length !== 1) return numStack;
		
		let stack = [], fractional = 0;
		//let error = false, error2 = false, errorMsg = [0, ""];
		
		unlawful: for(let x of numStack[0].split(' '))
		{
			let nd;

			switch(x)
			{
			case "+":
				if(2 > stack.length) return ["Operator are too much!"];
				stack.push(stack.pop().plus(stack.pop()));
				break;
				
			case "-":
				if(stack.length === 0) return ["Operator are too much!"];
				else if(stack.length === 1) stack.push(stack.pop().times("-1"));
				else
				{
					nd = stack.pop();
					stack.push(stack.pop().minus(nd));
				}
				break;
				
			case "*":
				if(2 > stack.length) return ["Operator are too much!"];
				stack.push(stack.pop().times(stack.pop()));
				break;
				
			case "/":
				if(2 > stack.length) return ["Operator are too much!"];
				nd = stack.pop();
				if(nd.eq("0")) return ["Division by zero"];
				stack.push(stack.pop().div(nd));
				break;
				
			case "^":
				if(2 > stack.length) return ["Operator are too much!"];
				nd = stack.pop();
				stack.push(stack.pop().pow(nd));
				break;
				
			default:
				if(isNaN(parseFloat(x))) return ["Error! Unlawful Infix Notation!"];
				stack.push(new Decimal(x));
				break;
			}
		}
		
//		if(stack.length !== 1) return stack;
//		else if(stack[0].minus(stack[0].toFixed(0)).toString().length > parseInt(localStorage.ResultMaximumFractional)+2) stack[0] = stack[0].toExponential();
		return stack;
	}
	
	setResultView(result, length = 1)
	{
		let asari = new localStorageUpdate();

		switch(result)
		{
		case "A space between two numbers":
			asari.viewResultColor_Update("#ff0000");
			asari.viewResultPrint_Update("A space between two numbers");
			break;
			
		case "Division by zero":
			asari.viewResultColor_Update("#ff0000");
			asari.viewResultPrint_Update("Division by zero");
			break;
			
		case "Error! Unlawful Infix Notation!":
			asari.viewResultColor_Update("#ff0000");
			asari.viewResultPrint_Update("Error! Unlawful Infix Notation!");
			break;
			
		case "no have any value's ln()":
			asari.viewResultColor_Update("#ff0000");
			asari.viewResultPrint_Update("No have any value's ln()");
			break;
			
		case "no have any value's log()":
			asari.viewResultColor_Update("#ff0000");
			asari.viewResultPrint_Update("No have any value's log()");
			break;
			
		case "Operator are too much!":
			asari.viewResultColor_Update("#ff0000");
			asari.viewResultPrint_Update("Operator are too much!");
			break;
		
		case "Unlawful ln value":
			asari.viewResultColor_Update("#ff0000");
			asari.viewResultPrint_Update("Unlawful ln value");
			break;
			
		case "Unlawful log value":
			asari.viewResultColor_Update("#ff0000");
			asari.viewResultPrint_Update("Unlawful log value");
			break;

		default:
			switch(length)
			{
			case this.RED_WORDS:	//red words in "conversion result" block
				asari.viewResultColor_Update("#ff0000");
				asari.viewResultPrint_Update(result);
				break;
			
			case this.WHILE_WORDS:	//white words in "conversion result" block
				asari.viewResultColor_Update("#ffffff");
				asari.viewResultPrint_Update(result);
				break;
				
			case 0:
				asari.viewResultColor_Update("#ffffff");
				asari.viewResultPrint_Update("...");
				break;
				
			case 1:
				asari.viewResultColor_Update("#ffffff");
				if(result.minus(result.toFixed(0)).toString().length > parseInt(localStorage.ResultMaximumFractional)+2) result = result.toExponential();
				asari.viewResultPrint_Update(result.toString());
				break;
			
			default:
				asari.viewResultColor_Update("#ff0000");
				asari.viewResultPrint_Update("Operand are too much!");
				break;
			}
			break;
		}
	}
	
	get RED_WORDS() {return "red";}
	get WHILE_WORDS() {return "while"}
}
Decimal.set({precision: 1005, toExpNeg: -9e15, toExpPos: 9e15, rounding: Decimal.ROUND_DOWN})

class localStorageUpdate
{
	letructor() {}
	
	userInputHistory_Update(formula = "")
	{
		if(localStorage.userInputHistory !== formula)
		{
			localStorage.userInputHistory = formula.toString();

			if(formula === "") localStorage.viewResultPrint = "...";
		}
	}
	
	CalculateHistory_Update(formula, result, mod = this.SET)
	{
		if(mod === this.SET) localStorage.CalculateHistory += (',' + formula.replaceAll(',','') + " = " + result.toString());
		else if(mod === this.DEL) localStorage.CalculateHistory = "";
	}
	
	viewResultPrint_Update(result, mod = this.SET)
	{
		localStorage.viewResultPrint = result.toString();
	}
	
	viewResultColor_Update(color, mod = this.SET)
	{
		localStorage.viewResultColor = color.toString();
	}
	
	historyReview_Update(num, mod)
	{
		switch(mod)
		{
		case this.SET:
			localStorage.historyReview = num.toString();
			break;
		
		case this.MINUS:
			localStorage.historyReview = (parseInt(localStorage.historyReview) - num).toString();
			break;
		
		case this.ADD:
			localStorage.historyReview = (parseInt(localStorage.historyReview) + num).toString();
			break;
		}
	}
	
	HistoryMaximumFractional_Update(num, mod = this.SET)
	{
		localStorage.HistoryMaximumFractional = num.toString();
	}
	
	ResultMaximumFractional_Update(num, mod = this.SET)
	{
		localStorage.ResultMaximumFractional = num.toString();
	}
	
	CalculateHistoryMaximum_Update(num, mod = this.SET)
	{
		localStorage.CalculateHistoryMaximum = num.toString();
	}
	
	get SET() {return "set";}
	get ADD() {return "add";}
	get DEL() {return "delete";}
	get MINUS() {return "nimus";}
}

class toolbox
{
	standardization(userInput) 
	{
		return userInput
			.replace(/\s+/g, " ")
			.replace(/\uff10/ug, "0")
			.replace(/\uff11/ug, "1")
			.replace(/\uff12/ug, "2")
			.replace(/\uff13/ug, "3")
			.replace(/\uff14/ug, "4")
			.replace(/\uff15/ug, "5")
			.replace(/\uff16/ug, "6")
			.replace(/\uff17/ug, "7")
			.replace(/\uff18/ug, "8")
			.replace(/\uff19/ug, "9")
			.replace(/\uff0b/ug, "+")
			.replace(/\uff0d/ug, "-")
			.replace(/\ufe3f/ug, "^")
			.replace(/[\uff0f\u00f7]/ug, "/")
			.replace(/[\u00d7\uff58\uff38]/ug, "*")
			.replace(/[xX]/g, "*")
			.replace(/\uff08/ug, "(")
			.replace(/\uff09/ug, ")")
			.replace(/\uff0e/ug, ".");
	}

	*plusSplit(strArray)
	{
		//split(/(-?log\s*\(.*?\))|(-?ln\s*\(.*?\))|(-?\d+\.\d+)|(-?\d+)/)
		
		let num = 0;
		let ln_or_log = "";
		let block = false;
		
		for(let x of strArray.split(/(-?\d+\.\d+)|(-?\d+)/))
		{
			if(x === undefined || x.trim().length === 0) continue;
			
			//console.log(x);

			if(/log|ln/.test(x) && !block)
			{
				let y = x.split(/log|ln/, 1)[0];
				
				if(2 > y.length) yield y;
				else for(let z of y) yield z;
				
				x = x.replace(y, "");
				
				block = true;
				ln_or_log += x;
				try {num = x.match(/\(/g).length;}
				catch {return ["Error! Unlawful Infix Notation!"];}
				if(x.indexOf(")") !== -1) num -= x.match(/\)/g).length;
			}
			else if(block)
			{	
				if(x.indexOf("(") !== -1) num += x.match(/\(/g).length;
				if(x.indexOf(")") !== -1) num -= x.match(/\)/g).length;

				ln_or_log += x;
				
				if(num === 0)
				{
					let haveOther = false;
					let other = "", haveAnother = null;
				
					if(/log/.test(x)) haveAnother = "log";
					else if(/ln/.test(x)) haveAnother = "ln";
				
					if(haveAnother !== null)
					{
						let twoData = x.split(haveAnother, 1);
					
						x = twoData[0];
						other = haveAnother + twoData[1];
					
						haveOther = true;
					}
				
					let helf = ln_or_log.lastIndexOf(")")+1;
					
					block = haveOther;
					if(helf === ln_or_log.length) yield ln_or_log;
					else
					{
						yield ln_or_log.slice(0, helf);
						for(let y of ln_or_log.slice(helf)) yield y;
					}
					ln_or_log = other;
					
					if(other !== "")
					{
						num = other.match(/\(/g).length;
						if(other.indexOf(")") !== -1) num -= other.match(/\)/g).length;
					}
					continue;
				}
			}
			else if(isNaN(parseFloat(x))) for(let y of x) yield y;
			else yield x;
		}
		
		yield ln_or_log;
	}
	
	htmlToText(str)
	{
		return str
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;");
			//.replace(/\//g, "&frasl;");
	}
}