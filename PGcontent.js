//*****************************************************/
//                                                     /
// Copyright (c) 2021 zhang7391 All rights reserved    /
//             <zhang7391@protonmail.com>              /
//                                                     /
// Version: PG-1.0.6                                   /
// License: GNU General Public License v3.0            /
// Github: https://github.com/Zhang7391/PG_Calculator  /
//                                                     /
// Keep this information if you use this code, please. /
//                                                     /
//*****************************************************/


class core
{
	constructor() {;}
	
	calculation(formula)
	{
		const tool = new toolbox();
		formula = tool.standardization(formula);
		
		if(/log\s*\(\s*\)/.test(formula)) return ["no have any value's log()"];
		else if(/ln\s*\(\s*\)/.test(formula)) return ["no have any value's ln()"];
		
		if(/pi/.test(formula)) formula = formula.replace(/pi/g, this.pi.slice(0, parseInt(localStorage.MaximumFractional) + 7));

		for(let x = formula.length -1;x >= 0; x--)
		{
			if(/\d|e/.test(formula[x])) break;
			else if(/\s|\)/.test(formula[x])) continue;
			else return ["Error! Unlawful Infix Notation!"];
		}
		
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

		for(let x of tool.plusSplit(formula))
		{
			if(x === " " || !/[\*\^\-\+\/\s\d\.e\(\)]|log|ln/.test(x)) continue;
			if(x === "Error! Unlawful Infix Notation!") return ["Error! Unlawful Infix Notation!"];

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
				numStack.push(this.e.slice(0, parseInt(localStorage.MaximumFractional) + 7));
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
				if(x.startsWith("ln"))
				{
					let data = x.slice(x.indexOf('(')+1, -1);
					
					if(data === "") return ["no have any value's ln()"];
					else
					{
						data = this.calculation(data)[0];
						isSymbol = true;
					}
					
					if(data instanceof Decimal) 
					{
						if(data.isPositive()) 
						{
							let decimalPlaces = parseInt(localStorage.MaximumFractional);
							if(data.dp() > decimalPlaces) numStack.push(data.ln().toFixed(parseInt(localStorage.MaximumFractional)).toString());
							else numStack.push(data.log().toString());
						}
						else return ["ln() is imaginary number"];
					}
					else return ["Unlawful ln value"];
				}
				else if(x.startsWith("log"))
				{
					let data = x.slice(x.indexOf('(')+1, -1);
					
					if(data === "") return ["no have any value's log()"];
					else
					{
						data = this.calculation(data)[0];
						isSymbol = true;
					}
					
					if(data instanceof Decimal) 
					{
						if(data.isPositive())
						{
							let decimalPlaces = parseInt(localStorage.MaximumFractional);
							if(data.dp() > decimalPlaces) numStack.push(data.log().toFixed(decimalPlaces).toString());
							else numStack.push(data.log().toString());
						}
						else return ["log() is imaginary number"];
					}
					else return ["Unlawful log value"];
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
		
		for(let x of numStack[0].split(' '))
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
			
		case "ln() is imaginary number":
			asari.viewResultColor_Update("#ff0000");
			asari.viewResultPrint_Update("ln() is imaginary number");
			break;
			
		case "log() is imaginary number":
			asari.viewResultColor_Update("#ff0000");
			asari.viewResultPrint_Update("log() is imaginary number");
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
				if(result.dp() > parseInt(localStorage.MaximumFractional)) 
				{
					result = result.toFixed(parseInt(localStorage.MaximumFractional));
				
					if(result.endsWith("0")) result = new Decimal(result.toString());
				}
				
				asari.viewResultColor_Update("#ffffff");
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
	get WHILE_WORDS() {return "while";}
	get e() {return "2.71828182845904523536028747135266249775724709369995957496696762772407663035354759457138217852516642742746639193200305992181741359662904357290033429526059563073813232862794349076323382988075319525101901157383418793070215408914993488416750924476146066808226480016847741185374234544243710753907774499206955170276183860626133138458300075204493382656029760673711320070932870912744374704723069697720931014169283681902551510865746377211125238978442505695369677078544996996794686445490598793163688923009879312773617821542499922957635148220826989519366803318252886939849646510582093923982948879332036250944311730123819706841614039701983767932068328237646480429531180232878250981945581530175671736133206981125099618188159304169035159888851934580727386673858942287922849989208680582574927961048419844436346324496848756023362482704197862320900216099023530436994184914631409343173814364054625315209618369088870701676839642437814059271456354906130310720851038375051011574770417189861068739696552126715468895703503540212340784";}
	get pi() {return "3.14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196442881097566593344612847564823378678316527120190914564856692346034861045432664821339360726024914127372458700660631558817488152092096282925409171536436789259036001133053054882046652138414695194151160943305727036575959195309218611738193261179310511854807446237996274956735188575272489122793818301194912983367336244065664308602139494639522473719070217986094370277053921717629317675238467481846766940513200056812714526356082778577134275778960917363717872146844090122495343014654958537105079227968925892354201995611212902196086403441815981362977477130996051870721134999999837297804995105973173281609631859502445945534690830264252230825334468503526193118817101000313783875288658753320838142061717766914730359825349042875546873115956286388235378759375195778185778053217122680661300192787661119590921642019893809525720";}
}
Decimal.set({precision: 1005, toExpNeg: -9e15, toExpPos: 9e15, rounding: Decimal.ROUND_DOWN})

class localStorageUpdate
{
	constructor() {;}
	
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
	
	MaximumFractional_Update(num, mod = this.SET)
	{
		localStorage.MaximumFractional = num.toString();
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
		let key = false;
		for(let x of userInput) 
			if(/[^\*\^\-\+\/\s\d\.\(\)]/.test(x))
			{
				key = true;
				break;
			}
		
		if(key)
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
			.replace(/[\uff0b\u271a\ufe62\uff0b]/ug, "+")
			.replace(/[\ufe63\uff0d\u02cd\u2010\u23af\u2012\u2015\u2500\u2501\u2504\u2505\u2508\u2509\u254c\u254d\u2574\u2576\u2578\u257a\u257c\u257e\u2013\u2014]/ug, "-")
			.replace(/\ufe3f/ug, "^")
			.replace(/[\uff0f\u00f7]/ug, "/")
			.replace(/[\u2573\u2715\u2716\u22a0\u00d7\uff58\uff38\u2217\u066d\u204e\u2055\u20f0\u229b\u2638\u274b\u2731\u2732\u2733\u273a\u273d\u29c6\uff0a\ufe61]/ug, "*")
			.replace(/\uff08/ug, "(")
			.replace(/\uff09/ug, ")")
			.replace(/\uff0e/ug, ".")
			.replace(/\u215f/ug, "1/")
			.replace(/\u00bd/ug, "1/2")
			.replace(/\u2189/ug, "0/3")
			.replace(/\u2153/ug, "1/3")
			.replace(/\u2154/ug, "2/3")
			.replace(/\u00bc/ug, "1/4")
			.replace(/\u00be/ug, "3/4")
			.replace(/\u2155/ug, "1/5")
			.replace(/\u2156/ug, "2/5")
			.replace(/\u2157/ug, "3/5")
			.replace(/\u2158/ug, "4/5")
			.replace(/\u2159/ug, "1/6")
			.replace(/\u215a/ug, "5/6")
			.replace(/\u2150/ug, "1/7")
			.replace(/\u215b/ug, "1/8")
			.replace(/\u215c/ug, "3/8")
			.replace(/\u215d/ug, "5/8")
			.replace(/\u215e/ug, "7/8")
			.replace(/\u2151/ug, "1/9")
			.replace(/\u2152/ug, "1/10")
			.replace(/[\uff45\uff25]/ug, "e")
			.replace(/[\uff49\uff29]/ug, "i")
			.replace(/[\uff50\uff30]/ug, "p")
			.replace(/\u33d1/ug, "ln")
			.replace(/\u33d2/ug, "log")
			.replace(/[\u03c0\u03a0\ud835\udf45\ud835\udf7f\ud835\udfb9\u041f\u043f\u03d6\u213c\u5140\u3107]/ug, "pi");
		}

		return userInput.replace(/[xX]/g, "*").toLowerCase();
	}

	*plusSplit(strArray)
	{	
		let num = 0;
		let block = false;
		let ln_or_log = "";
		
		for(let x of strArray.split(/(-?\d+\.\d+)|(-?\d+)/))
		{
			if(x === undefined || x.trim().length === 0) continue;

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
			else if(isNaN(parseFloat(x))) 
			{
				if(/-\D*?[\*+\-\/]|\+\D*?[\*+\-\/]|\([\*+\-\/]/.test(x)) yield "Error! Unlawful Infix Notation!";
				for(let y of x) yield y;
			}
			else yield x;
		}
		
		if(/log\s*\(|ln\s*\(/.test(ln_or_log)) ln_or_log += ")";
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