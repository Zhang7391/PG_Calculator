// Copyright Ã‚Â© 2021 Editor.PG All rights reserved
// Unauthorized alteration, disseminate and use are prohibited.

const haveBottom = 
{
	"0" : "Infix", 
	"1" : "Prefix",
	"2" : "Postfix"
};

document.addEventListener("keyup", (press) =>
{
	localStorage.userInputHistory = document.querySelector("#enterValue").value;
	document.querySelector("#infix").click();

	if(localStorage.userInputHistory !== document.querySelector("#enterValue").value)
	{
		localStorage.userInputHistory = document.querySelector("#enterValue").value;

		for(let page of Object.keys(haveBottom))
			if(!document.querySelector(`#${haveBottom[page].toLowerCase()}`).hidden)
				document.querySelector(`#${haveBottom[page].toLowerCase()}`).click();

		if(document.querySelector("#enterValue").value === "")
		{
			localStorage.viewResultPrint =
			document.querySelector("#resultView").value = "...";
			localStorage.postfixResult = 
			document.querySelector("#postfixResultView").value = "...";
		}
	}
	
	if(press.keyCode === 13)	//enter
	{
		localStorage.historyReview = "-1";
		try
		{
			let result = new Decimal(document.querySelector("#resultView").value);
			if(result.minus(result.toFixed(0)).toString().length > parseInt(localStorage.HistoryMaximumFractional)+3) result = result.toFixed(parseInt(localStorage.HistoryMaximumFractional));
		
			localStorage.CalculateHistory += (',' + document.querySelector("#enterValue").value.replaceAll(',',' ') + " = " + result.toString());

			for(x of document.querySelectorAll(".historyViewer")) document.querySelector("#historyShow").removeChild(x);

			let calculateData = localStorage.CalculateHistory.split(',');
			calculateData.shift();

			let now = 0, num = calculateData.length - 1;
			while(parseInt(localStorage.CalculateHistoryMaximum) > now && calculateData.length > now)
			{
				let tr = document.createElement("tr"), td = document.createElement("td");
				td.innerHTML = calculateData[num - now];
				td.addEventListener("click", (itself) => {localStorage.userInputHistory = document.querySelector("#enterValue").value = itself.target.innerHTML.split('=')[0];document.querySelector("#infix").click();localStorage.viewResultPrint = document.querySelector("#resultView").value;document.querySelector("#enterValue").value = itself.target.innerHTML.split('=')[0];});
				tr.appendChild(td);
				tr.className = "historyViewer";
				document.querySelector("#historyShow").appendChild(tr);
				now += 1;
			}
		}
		catch {;}
	}
	else if(press.keyCode === 38)	//up arrow
	{
		let calculateData = localStorage.CalculateHistory.split(',');
		calculateData.shift();

		if(localStorage.historyReview === "0") ;
		else if(localStorage.historyReview === "-1") localStorage.historyReview = calculateData.length - 1;
		else localStorage.historyReview = parseInt(localStorage.historyReview) - 1;

		localStorage.userInputHistory =
		document.querySelector("#enterValue").value = calculateData[parseInt(localStorage.historyReview)].split('=')[0];
		document.querySelector("#infix").click();
		localStorage.viewResultPrint = document.querySelector("#resultView").value;
		document.querySelector("#enterValue").value = calculateData[parseInt(localStorage.historyReview)].split('=')[0];
	}
	else if(press.keyCode === 40)	//down arrow
	{
		let calculateData = localStorage.CalculateHistory.split(',');
		calculateData.shift();

		let place = parseInt(localStorage.historyReview);
		if(calculateData.length-1 > place) localStorage.historyReview = place + 1;

		localStorage.userInputHistory =
		document.querySelector("#enterValue").value = calculateData[parseInt(localStorage.historyReview)].split('=')[0];
		document.querySelector("#infix").click();
		localStorage.viewResultPrint = document.querySelector("#resultView").value;
		document.querySelector("#enterValue").value = calculateData[parseInt(localStorage.historyReview)].split('=')[0];
	}
});

window.addEventListener("load", () =>
{
	document.querySelector("#calculatorMod").addEventListener("change", () =>
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
	});

	document.querySelector("#historyInput").addEventListener("click", () =>
	{
		if(document.querySelector("#historyMod").hidden) document.querySelector("#historyMod").hidden = false;
		else document.querySelector("#historyMod").hidden = true;
	});

	document.querySelector("#trash").addEventListener("click", () =>
	{
		localStorage.CalculateHistory = "";
		for(x of document.querySelectorAll(".historyViewer")) document.querySelector("#historyShow").removeChild(x);
	});

	document.querySelector("#trash2").addEventListener("click", () =>
	{
		document.querySelector("#resultView").value =
		localStorage.viewResultPrint = "...";
		document.querySelector("#resultView").style.color =
		localStorage.viewResultColor = "#ffffff";

		localStorage.userInputHistory =
		document.querySelector("#enterValue").value = "";
	});

	document.querySelector("#gear").addEventListener("click", () =>
	{
		if(document.querySelector("#setting").hidden) document.querySelector("#setting").hidden = false;
		else document.querySelector("#setting").hidden = true;
	});

	document.querySelector("#settingButtom").addEventListener("click", () =>
	{
		let x = parseInt(document.querySelector("#History_Maximum_Fractional").value)
		if(!isNaN(x) && 1000 >= x && x >= 0) 
		{
			localStorage.HistoryMaximumFractional = x;
			document.querySelector("#History_Maximum_Fractional").placeholder = `${x} (0~1000)`;
		}
		document.querySelector("#History_Maximum_Fractional").value = "";

		x = parseInt(document.querySelector("#Result_Maximum_Fractional").value);
		if(!isNaN(x) && 1000 >= x && x >= 0)
		{
			localStorage.ResultMaximumFractional = x;
			document.querySelector("#Result_Maximum_Fractional").placeholder = `${x} (0~1000)`;
			document.querySelector("#infix").click();
		}
		document.querySelector("#Result_Maximum_Fractional").value = "";

		x = parseInt(document.querySelector("#Calculate_History_Maximum").value);
		if(!isNaN(x) && x >= 0)
		{
			localStorage.CalculateHistoryMaximum = x;
			document.querySelector("#Calculate_History_Maximum").placeholder = `${x} (â‰§0)`;

			if(document.querySelector("#historyShow").children.length > x)
			{
				let historyViewer = Array.from(document.querySelectorAll(".historyViewer"));
				while(historyViewer.length > x) document.querySelector("#historyShow").removeChild(historyViewer.pop());
			}
			else
			{
				for(x of document.querySelectorAll(".historyViewer")) document.querySelector("#historyShow").removeChild(x);

				let calculateData = localStorage.CalculateHistory.split(',');
				calculateData.shift();

				let now = 0, num = calculateData.length - 1;
				while(parseInt(localStorage.CalculateHistoryMaximum) > now && calculateData.length > now)
				{
					let tr = document.createElement("tr"), td = document.createElement("td");
					td.innerHTML = calculateData[num - now];
					td.addEventListener("click", (itself) => {localStorage.userInputHistory = document.querySelector("#enterValue").value = itself.target.innerHTML.split('=')[0];document.querySelector("#infix").click();localStorage.viewResultPrint = document.querySelector("#resultView").value;document.querySelector("#enterValue").value = itself.target.innerHTML.split('=')[0];});
					tr.appendChild(td);
					tr.className = "historyViewer";
					document.querySelector("#historyShow").appendChild(tr);
					now += 1;
				}
			}
		}
		document.querySelector("#Calculate_History_Maximum").value = "";
	});

	document.querySelector("#infix").addEventListener("click", () =>
	{
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

		unlawful: for(let x of tool.plusSplit(tool.Standardization(document.querySelector("#enterValue").value).split(/(-\d+\.\d+)|(\d+\.\d+)|(-\d+)|(\d+)/)))
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

		if(numStack[0] === undefined)
		{
			localStorage.postfixResult =
			document.querySelector("#postfixResultView").value = "...";
		}
		else
		{
			localStorage.postfixResult = 
			document.querySelector("#postfixResultView").value = numStack[0].replace(/undefined/g, "").replace(/\(\*/g, "*").replace(/\(\-/g, "-");
			document.querySelector("#enterValue").value = numStack[0].replace(/undefined|\)/g, "");
			document.querySelector("#postfix").click();
			document.querySelector("#enterValue").value = localStorage.userInputHistory;
		}
	});

	Decimal.set({precision: 1000, toExpNeg: -9e15, toExpPos: 9e15, rounding: Decimal.ROUND_DOWN})
	document.querySelector("#postfix").addEventListener("click", () =>
	{
		const tool = new toolbox();
		let stack = [], fractional = 0;
		let error = false, error2 = false, errorMsg = [0, ""];
		
			
		unlawful: for(let x of tool.plusSplit(tool.Standardization(document.querySelector("#enterValue").value).split(/(-\d+\.\d+)|(\d+\.\d+)|(-\d+)|(\d+)/)))
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

		tool.setResultView(error, error2, stack.length, stack[0], errorMsg[0], errorMsg[1], fractional)
	});

	document.querySelector("#prefix").addEventListener("click", () =>
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
	});

	if(!localStorage.nowMod) localStorage.nowMod = "0";
	for(let page of Object.keys(haveBottom))
	{
		if(page === localStorage.nowMod)
		{
			document.querySelector(`#${haveBottom[page].toLowerCase()}`).hidden = false;
			document.querySelector("#topTitle").innerHTML = `${haveBottom[page]} Notation Calculator`;
		}
		else document.querySelector(`#${haveBottom[page].toLowerCase()}`).hidden = true;
	}
	document.querySelector("#calculatorMod").value = localStorage.nowMod;

	if(!localStorage.viewResultColor) localStorage.viewResultColor = "#ffffff";
	document.querySelector("#resultView").style.color = localStorage.viewResultColor;

	if(!localStorage.viewResultPrint) localStorage.viewResultPrint = "...";
	document.querySelector("#resultView").value = localStorage.viewResultPrint;

	if(!localStorage.userInputHistory) localStorage.userInputHistory = "";
	document.querySelector("#enterValue").value = localStorage.userInputHistory;

	if(!localStorage.postfixResult) localStorage.postfixResult = "...";
	document.querySelector("#infixToPostfix").value = localStorage.postfixResult;

	if(!localStorage.postfixResultView) localStorage.postfixResultView = "false";
	document.querySelector("#infixToPostfix").hidden = (localStorage.postfixResultView === "true");

	if(!localStorage.ResultMaximumFractional) localStorage.ResultMaximumFractional = "1000";
	document.querySelector("#Result_Maximum_Fractional").placeholder = `${localStorage.ResultMaximumFractional} (0~1000)`;
	Decimal.set({precision: parseInt(localStorage.ResultMaximumFractional)});

	if(!localStorage.HistoryMaximumFractional) localStorage.HistoryMaximumFractional = "10";
	document.querySelector("#History_Maximum_Fractional").placeholder = `${localStorage.HistoryMaximumFractional} (0~1000)`;

	if(!localStorage.CalculateHistoryMaximum) localStorage.CalculateHistoryMaximum = "5";
	document.querySelector("#Calculate_History_Maximum").placeholder = `${localStorage.CalculateHistoryMaximum} (â‰§0)`;

	if(!localStorage.CalculateHistory) localStorage.CalculateHistory = "";
	if(localStorage.CalculateHistory !== "")
	{
		let calculateData = localStorage.CalculateHistory.split(',');
		calculateData.shift();

		let now = 0, num = calculateData.length - 1;
		while(parseInt(localStorage.CalculateHistoryMaximum) > now && calculateData.length > now)
		{
			let tr = document.createElement("tr"), td = document.createElement("td");
			td.innerHTML = calculateData[num - now];
			td.addEventListener("click", (itself) => {localStorage.userInputHistory = document.querySelector("#enterValue").value = itself.target.innerHTML.split('=')[0];document.querySelector("#infix").click();localStorage.viewResultPrint = document.querySelector("#resultView").value;document.querySelector("#enterValue").value = itself.target.innerHTML.split('=')[0];});
			tr.appendChild(td);
			tr.className = "historyViewer";
			document.querySelector("#historyShow").appendChild(tr);
			now += 1;
		}
	}

	if(!localStorage.historyReview) localStorage.historyReview = "-1";
});

class toolbox
{
	Standardization(userInput) 
	{
		return userInput
			.replace(/\s+/g, " ")
			.replace(/Ã¯Â¼/g, "0")
			.replace(/Ã¯Â¼â€˜/g, "1")
			.replace(/Ã¯Â¼â€™/g, "2")
			.replace(/Ã¯Â¼â€œ/g, "3")
			.replace(/Ã¯Â¼â€/g, "4")
			.replace(/Ã¯Â¼â€¢/g, "5")
			.replace(/Ã¯Â¼â€“/g, "6")
			.replace(/Ã¯Â¼â€”/g, "7")
			.replace(/Ã¯Â¼Ëœ/g, "8")
			.replace(/Ã¯Â¼â„¢/g, "9")
			.replace(/Ã¯Â¼â€¹/g, "+")
			.replace(/Ã¯Â¼/g, "-")
			.replace(/Ã¯Â¸Â¿/g, "^")
			.replace(/Ã¯Â¼Ë†/g, "(")
			.replace(/Ã¯Â¼â€°/g, ")")
			.replace(/[ÃƒÂ·Ã¯Â¼]/g, "/")
			.replace(/[xÃƒâ€”XÃ¯Â½ËœÃ¯Â¼Â¸Ã¯Â¼Å]/g, "*");
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
			document.querySelector("#postfixResultView").value = "?";
			document.querySelector("#resultView").value = "Error! Unlawful Infix Notation! (in " + errorPlace + ": \"" + errorMsg + "\" is not a operator or operand)";
			localStorage.viewResultPrint = document.querySelector("#resultView").value;
		}
		else if(error2)
		{
			viewMsg.style.color =
			localStorage.viewResultColor = "#ff0000";
			document.querySelector("#postfixResultView").value =
			localStorage.postfixResult = "?";
			document.querySelector("#resultView").value =
			localStorage.viewResultPrint = "Operator are too much!";
		}
		else if(length !== 1)
		{
			viewMsg.style.color =
			localStorage.viewResultColor = "#ff0000";
			document.querySelector("#postfixResultView").value =
			localStorage.postfixResult = "?";
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
				document.querySelector("#postfixResultView").value =
				localStorage.postfixResult = "?";
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
				if(result.minus(result.toFixed(0)).toString().length > parseInt(localStorage.ResultMaximumFractional)+3) result = result.toFixed(parseInt(localStorage.ResultMaximumFractional));
				localStorage.viewResultPrint =
				document.querySelector("#resultView").value = result.toString();
				break;
			}
		}
	}
}
