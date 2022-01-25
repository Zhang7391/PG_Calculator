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
	calculation(algorithm)
	{
		let error;
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

		let noMul = false, noMul2 = false;
		let needChange = false, endBracket = false;
		let numStack = [], operStack = [];

		unlawful: for(let x of tool.plusSplit(tool.Standardization(algorithm).split(/(-\d+\.\d+)|(\d+\.\d+)|(-\d+)|(\d+)/)))
		{
			if(x.trim().length === 0) continue;
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
				noMul = noMul2 = needChange = false;
				break;
			case "^":
				noMul = noMul2 = needChange = false;
				operStack.push(x);
				break;
			case "-":
			case "*":
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
							nd = numStack.pop();
							numStack.push(`${numStack.pop()} ${nd} ${operStack.pop()}`);
						}
					}
					operStack.push(x);
				}
				if(x === "-") needChange = true;
				else needChange = false;
				noMul = noMul2 = false;
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
				noMul = needChange = false;
				noMul2 = true;
				break;
			default:
				if(isNaN(parseFloat(x)))
				{
					error = true;
					break unlawful;
				}
				if(noMul && 0 > x)
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
				if(noMul)	//Reject a space between two numbers.
				{
					tool.setResultView(false, false, 1, "A space between two numbers", 0, 0, 0);
					return false;
				}
				else if(noMul2) 
				{
					if(x >= 0) numStack.push(`${numStack.pop()} ${x} *`);
					else numStack.push(`${numStack.pop()} ${-x} -`);
				}
				else numStack.push(x.toString());
				noMul = true;
				noMul2 = needChange = false;
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
			if(operStack[operStack.length - 1] !== "/" && operStack[operStack.length - 1] !== "-" && operStack[operStack.length - 1] !== "^") numStack.push(`${numStack.pop()} ${numStack.pop()} ${operStack.pop()}`);
			else
			{
				nd = numStack.pop();
				numStack.push(`${numStack.pop()} ${nd} ${operStack.pop()}`);
			}
		}		
		if(numStack[0] === undefined) return "...";
		
		let stack = [], fractional = 0;
		//let error = false
		let error2 = false, errorMsg = [0, ""];
		
		unlawful: for(let x of numStack[0].replace(/undefined|\)/g, "").split(' '))
		{
			if(x === " " || /[^\*\^\-\+\/\s\d\.]/.test(x)) continue;
			errorMsg[0] += 1;
			let nd;

			switch(x)
			{
			case "+":
				if(2 > stack.length)
				{
					error2 = true;
					errorMsg[1] = x;
					break unlawful;
				}	
				stack.push(stack.pop().plus(stack.pop()));
				break;
			case "-":
				if(stack.length === 0)
				{
					error2 = true;
					errorMsg[1] = x;
					break unlawful;
				}
				else if(stack.length === 1) stack.push(stack.pop().times("-1"));
				else
				{
					nd = stack.pop();
					stack.push(stack.pop().minus(nd));
				}
				break;
			case "*":
				if(2 > stack.length)
				{
					error2 = true;
					errorMsg[1] = x;
					break unlawful;
				}
				stack.push(stack.pop().times(stack.pop()));
				break;
			case "/":
				if(2 > stack.length)
				{
					error2 = true;
					errorMsg[1] = x;
					break unlawful;
				}
				nd = stack.pop();
				if(nd.eq("0"))
				{
					stack[0] = "Division by zero";
					break unlawful;
				}
				stack.push(stack.pop().div(nd));
				break;
			case "^":
				if(2 > stack.length)
				{
					error2 = true;
					errorMsg[1] = x;
					break unlawful;
				}
				nd = stack.pop();
				stack.push(stack.pop().pow(nd));
				break;
			default:
				if(isNaN(parseFloat(x)))
				{
					errorMsg[1] = x;
					error = true;
					break unlawful;
				}
				stack.push(new Decimal(x));
			}
		}
		
		if(stack[0] === undefined) return undefined;
		
		if(stack[0].minus(stack[0].toFixed(0)).toString().length > parseInt(localStorage.ResultMaximumFractional)+2) stack[0] = stack[0].toExponential();
		return stack[0];
//		tool.setResultView(error, error2, stack.length, stack[0], errorMsg[0], errorMsg[1], fractional)
	}
}
Decimal.set({precision: 1000, toExpNeg: -9e15, toExpPos: 9e15, rounding: Decimal.ROUND_DOWN})

class localStorageUpdate
{
	constructor() {}
	
	userInputHistory_Update(algorithm)
	{
		if(localStorage.userInputHistory !== algorithm)
		{
			localStorage.userInputHistory = algorithm;

			if(algorithm === "") localStorage.viewResultPrint = "...";
		}
	}
	
	CalculateHistory_Update(algorithm, result, mod = this.SET)
	{
		if(mod === this.SET) localStorage.CalculateHistory += (',' + algorithm.replaceAll(',','') + " = " + result.toString());
		else if(mod === this.DEL) localStorage.CalculateHistory = "";
	}
	
	viewResultPrint_Update(result, mod = this.SET)
	{
		localStorage.viewResultPrint = result;
	}
	
	viewResultColor_Update(color, mod = this.SET)
	{
		localStorage.viewResultColor = color;
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
	Standardization(userInput) 
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
			.replace(/\uff08/ug, "(")
			.replace(/\uff09/ug, ")")
			.replace(/[\uff0f\u00f7]/ug, "/")
			.replace(/[\u00d7\uff58\uff38]/ug, "*")
			.replace(/[xX]/g, "*");
	}

	plusSplit(strArray)
	{
		let ans = [];
		for(let x of strArray)
		{
			if(x === undefined || x.trim().length === 0) continue;

			if(isNaN(parseFloat(x))) ans.push(...x.split(""))
			else ans.push(x);
		}
		return ans;
	}

	//error1: data is neither operator nor operand.
	//error2: data have too much operator.
	//error3: data have too much operand.
	setResultView(error, error2, length, result, errorPlace, errorMsg, fractional)
	{
		let viewMsg = document.querySelector("#resultView");
		if(error) 
		{
			viewMsg.style.color = "#ff0000";
			localStorage.viewResultColor = "#ff0000";
//			document.querySelector("#postfixResultView").value = "?";
			document.querySelector("#resultView").value = "Error! Unlawful Infix Notation! (in " + errorPlace + ": \"" + errorMsg + "\" is not a operator or operand)";
			localStorage.viewResultPrint = document.querySelector("#resultView").value;
		}
		else if(error2)
		{
			viewMsg.style.color =
			localStorage.viewResultColor = "#ff0000";
//			document.querySelector("#postfixResultView").value =
//			localStorage.postfixResult = "?";
			document.querySelector("#resultView").value =
			localStorage.viewResultPrint = "Operator are too much!";
		}
		else if(length !== 1)
		{
			viewMsg.style.color =
			localStorage.viewResultColor = "#ff0000";
//			document.querySelector("#postfixResultView").value =
//			localStorage.postfixResult = "?";
			document.querySelector("#resultView").value =
			localStorage.viewResultPrint = "Operand are too much!";
		}
		else
		{
			switch(result)
			{
			case "A space between two numbers":
				document.querySelector("#resultView").style.color =
				localStorage.viewResultColor = "#ff0000";
//				document.querySelector("#postfixResultView").value =
//				localStorage.postfixResult = "?";
				document.querySelector("#resultView").value = "A space between two numbers is unlawful";
				localStorage.viewResultPrint = document.querySelector("#resultView").value;
				break;

			case "Unlawful prefix notation":
				viewMsg.style.color =
				localStorage.viewResultColor = "#ff0000";
				document.querySelector("#resultView").value =
				localStorage.viewResultPrint = "Unlawful prefix notation";
				break;

			case "Unlawful exponent":
				viewMsg.style.color =
				localStorage.viewResultColor = "#ff0000";
				document.querySelector("#resultView").value =
				localStorage.viewResultPrint = "Unlawful exponent, must be a \"INTEGER\" or \"ONE-HALF\"."
				break;

			case "Unlawful negative exponent":
				viewMsg.style.color =
				localStorage.viewResultColor = "#ff0000";
				document.querySelector("#resultView").value =
				localStorage.viewResultPrint = "Unlawful exponent, must be a \"INTEGER\" or \"ZERO\".";
				break;

			case "Division by zero":
				viewMsg.style.color =
				localStorage.viewResultColor = "#ff0000";
				document.querySelector("#resultView").value =
				localStorage.viewResultPrint = "Division by zero";
				break;

			default:
				viewMsg.style.color =
				localStorage.viewResultColor = "#ffffff";
				if(result.minus(result.toFixed(0)).toString().length > parseInt(localStorage.ResultMaximumFractional)+2) result = result.toExponential();
				localStorage.viewResultPrint =
				document.querySelector("#resultView").value = result.toString();
				break;
			}
		}
	}
}

// DEPRECATED
//window.addEventListener("load", () =>
//{
	/*document.querySelector("#calculatorMod").addEventListener("change", () =>
	{
		localStorage.nowMod = document.querySelector("#calculatorMod").value;

		for(let page of Object.keys(haveBottom))
		{
			if(page === localStorage.nowMod)
			{
				document.querySelector(`#${haveBottom[page].toLowerCase()}`).hidden = false;
				document.querySelector("#topTitle").innerHTML = `${haveBottom[page]} Notation Calculator`;
			}
			else document.querySelector(`#${haveBottom[page].toLowerCase()}`).hidden = true;
		}

		if(/Infix|Prefix/.test(haveBottom[localStorage.nowMod]))
		{
			localStorage.postfixResultView = "false";
			document.querySelector("#infixToPostfix").hidden = false;
		}
		else 
		{
			localStorage.postfixResult = "...";
			localStorage.postfixResultView = "true";
			document.querySelector("#infixToPostfix").hidden = true;
			document.querySelector("#postfixResultView").value = "...";
		}
	});*/

//	document.querySelector("#postfix").addEventListener("click", () => {});

/*	document.querySelector("#prefix").addEventListener("click", () =>
	{
		let  tool = new toolbox();
		let x = tool.plusSplit(localStorage.userInputHistory.split(/(\d+\.\d+)|(-\d+)|(\d+)/)).filter(y => /[\*\^\-\+\/\d\.]/.test(y));

		let oper = ["+", "-", "*", "/", "^"], memory = Array.from(x);
		while(x.length !== 1)
		{
			let num = 0;
			for(let y = 0;x.length > y; y++)
			{
				if(!oper.includes(x[y])) num += 1;
				else num = 0;

				if(num === 2)
				{
					num = 0;
					let postfix = `${x[y-1]} ${x[y]} ${x[y-2]}`;
					x.splice(y-2, 3, postfix);
				}
			}
			if(JSON.stringify(x) === JSON.stringify(memory) || x.some(y => /undefined/.test(y))) 
			{
				tool.setResultView(false, false, 1, "Unlawful prefix notation", 0, 0, 0);
				return false;
			}
			memory = Array.from(x);
		}

		localStorage.postfixResult =
		document.querySelector("#enterValue").value =
		document.querySelector("#postfixResultView").value = x[0];

		document.querySelector("#postfix").click();

		document.querySelector("#enterValue").value = localStorage.userInputHistory;
	});*/

//	if(!localStorage.postfixResult) localStorage.postfixResult = "...";
//	document.querySelector("#infixToPostfix").value = localStorage.postfixResult;

//	if(!localStorage.postfixResultView) localStorage.postfixResultView = "false";
//	document.querySelector("#infixToPostfix").hidden = (localStorage.postfixResultView === "true");
//});