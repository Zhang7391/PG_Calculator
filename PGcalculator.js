//*****************************************************/
//                                                     /
// Copyright (c) 2021 zhang7391 All rights reserved    /
//             <zhang7391@protonmail.com>              /
//                                                     /
// License: GNU General Public License v3.0            /
// Github: https://github.com/Zhang7391/PG_Calculator  /
//                                                     / 
// Keep this information if you use this code, please. /
//                                                     /
//*****************************************************/


let translation = undefined;
window.addEventListener("load", () =>
{
	try {let test = !!localStorage;}
	catch {localStorage = Object.create(Object.prototype);}
	
	const PGcore = new core();
	const tool = new toolbox();
	const asari = new localStorageUpdate();
	
	//Core initialization
	if(!localStorage.viewResultColor) asari.viewResultColor_Update("#ffffff");
	document.querySelector("#resultView").style.color = localStorage.viewResultColor;

	if(!localStorage.userInputHistory) asari.userInputHistory_Update();
	document.querySelector("#enterValue").value = localStorage.userInputHistory;
	
	if(!localStorage.viewResultPrint) /*asari.viewResultPrint_Update("...")*/;
	let result = PGcore.calculation(localStorage.userInputHistory);
	PGcore.setResultView(result[0], result.length);
	document.querySelector("#resultView").value = localStorage.viewResultPrint;
	document.querySelector("#resultView").style.color = localStorage.viewResultColor;
	
	//Settings initialization
	if(!localStorage.ResultMaximumFractional) asari.ResultMaximumFractional_Update("1000");
	document.querySelector("#Result_Maximum_Fractional").value = localStorage.ResultMaximumFractional;
	document.querySelector("#Result_Maximum_Fractional").placeholder = `${localStorage.ResultMaximumFractional} (0~1000)`;

	if(!localStorage.HistoryMaximumFractional) asari.HistoryMaximumFractional_Update("10");
	document.querySelector("#History_Maximum_Fractional").value = localStorage.HistoryMaximumFractional;
	document.querySelector("#History_Maximum_Fractional").placeholder = `${localStorage.HistoryMaximumFractional} (0~1000)`;

	if(!localStorage.CalculateHistoryMaximum) asari.CalculateHistoryMaximum_Update("5");
	document.querySelector("#Calculate_History_Maximum").value = localStorage.CalculateHistoryMaximum;
	document.querySelector("#Calculate_History_Maximum").placeholder = `${localStorage.CalculateHistoryMaximum} (>=0)`;

	//History initialization
	if(!localStorage.CalculateHistory) asari.CalculateHistory_Update("", "", asari.DEL);
	if(localStorage.CalculateHistory !== "")
	{
		let calculateData = localStorage.CalculateHistory.split(',');
		calculateData.shift();

		let now = 0, num = calculateData.length - 1;
		while(parseInt(localStorage.CalculateHistoryMaximum) > now && calculateData.length > now)
		{
			let tr = document.createElement("tr"), td = document.createElement("td");
			td.innerText = calculateData[num - now];
			td.addEventListener("click", (itself) => {localStorage.userInputHistory = itself.target.innerText.split('=')[0];let PGcore = new core();let result = PGcore.calculation(localStorage.userInputHistory);PGcore.setResultView(result[0], result.length);document.querySelector("#enterValue").value = localStorage.userInputHistory;document.querySelector("#resultView").value = localStorage.viewResultPrint;document.querySelector("#resultView").style.color = localStorage.viewResultColor;});
			tr.appendChild(td);
			tr.className = "historyViewer";
			document.querySelector("#historyShow").appendChild(tr);
			now += 1;
		}
	}

	if(!localStorage.historyReview) asari.historyReview_Update("-1", asari.SET);
	
	//Load other language
	const language = (navigator.language || navigator.browserLanguage).toLowerCase();

    const client = new XMLHttpRequest();

    client.addEventListener("error", (error) => {console.log(error);});
    client.addEventListener("loadend", (data) => 
	{
		if(data.currentTarget.status === 200)
		{
			translation = JSON.parse(data.currentTarget.response);
			
			//translation HTML
			document.querySelector("title").innerText = translation[document.querySelector("title").innerText];
			document.querySelector("#topTitle").innerText = translation[document.querySelector("#topTitle").innerText];
			document.querySelector("#enterValue").placeholder = translation[document.querySelector("#enterValue").placeholder];
			document.querySelector("#infix").value = translation[document.querySelector("#infix").value];
			document.querySelector("#calculateHistory").innerText = translation[document.querySelector("#calculateHistory").innerText];
			document.querySelector("#userOptions").innerText = translation[document.querySelector("#userOptions").innerText];
			document.querySelector("#Result_Maximum_Fractional_Text").innerText = translation[document.querySelector("#Result_Maximum_Fractional_Text").innerText];
		}
	});

    client.open("GET", "/koyori/language/" + language + ".json");

    client.send();
	
	//Event Listener
	document.querySelector("#infix").addEventListener("click", () => 
	{
		let result = PGcore.calculation(document.querySelector("#enterValue").value);
		
		PGcore.setResultView(result[0], result.length);
		document.querySelector("#resultView").value = localStorage.viewResultPrint;
		document.querySelector("#resultView").style.color = localStorage.viewResultColor;
	});
	
	document.addEventListener("keyup", (press) =>
	{
		//alert(press.keyCode);
	
		let result = undefined;
		if(document.querySelector("#enterValue").value !== localStorage.userInputHistory)
		{
			asari.userInputHistory_Update(document.querySelector("#enterValue").value);

			result = PGcore.calculation(localStorage.userInputHistory);
			PGcore.setResultView(result[0], result.length);
			document.querySelector("#resultView").value = localStorage.viewResultPrint;
			document.querySelector("#resultView").style.color = localStorage.viewResultColor;
		}
		else
		{
			try {result = [new Decimal(localStorage.viewResultPrint)];}
			catch(error) {result = ["Error"]}
		}
	
		switch(press.keyCode)
		{
		case 13:		//enter
			{
			if(!(result[0] instanceof Decimal)) break;
				
			asari.historyReview_Update("-1", asari.SET)
			
			let formula = document.querySelector("#enterValue").value;
			let calculateData = localStorage.CalculateHistory.split(',');
			
			let zn = calculateData[calculateData.length-1].replace(/\s/g, "");
			if(zn !== "") 
			{
				if(zn.split("=")[0] === formula.replace(/\s/g, "")) break;
				else
				{
					asari.CalculateHistory_Update(tool.htmlToText(document.querySelector("#enterValue").value), result[0]);
					calculateData.push(formula.replaceAll(',','') + " = " + result.toString())
				}					
			}
			
			try
			{
				if(result[0].minus(result[0].toFixed(0)).toString().length > parseInt(localStorage.HistoryMaximumFractional)+3) result[0] = result[0].toExponential();
				
				for(x of document.querySelectorAll(".historyViewer")) document.querySelector("#historyShow").removeChild(x);
				
				let now = 0;
				while(parseInt(localStorage.CalculateHistoryMaximum) > now && calculateData.length > now+1)
				{
					let tr = document.createElement("tr"), td = document.createElement("td");
					td.innerText = calculateData[calculateData.length - now - 1];
					td.addEventListener("click", (itself) => {localStorage.userInputHistory = itself.target.innerText.split('=')[0];let PGcore = new core();let result = PGcore.calculation(localStorage.userInputHistory);PGcore.setResultView(result[0], result.length);document.querySelector("#enterValue").value = localStorage.userInputHistory;document.querySelector("#resultView").value = localStorage.viewResultPrint;document.querySelector("#resultView").style.color = localStorage.viewResultColor;});
					tr.appendChild(td);
					tr.className = "historyViewer";
					document.querySelector("#historyShow").appendChild(tr);
					now += 1;
				}
			}
			catch(error) {console.log(error);}
			finally {break;}			
			//History's Event Listener Code. (input: itself[Object])
			/*
				localStorage.userInputHistory = itself.target.innerText.split('=')[0];
				let PGcore = new core();
				let result = PGcore.calculation(localStorage.userInputHistory);
				PGcore.setResultView(result[0], result.length);
				document.querySelector("#enterValue").value = localStorage.userInputHistory;
				document.querySelector("#resultView").value = localStorage.viewResultPrint;
				document.querySelector("#resultView").style.color = localStorage.viewResultColor;
			*/
			}
		case 38:		//up arrow
			{
			let calculateData = localStorage.CalculateHistory.split(',');

			if(localStorage.historyReview === "1") ;
			else if(localStorage.historyReview === "-1") asari.historyReview_Update(calculateData.length-1, asari.SET);
			else asari.historyReview_Update(1, asari.MINUS);
			
			let algorithm = calculateData[parseInt(localStorage.historyReview)].split('=')[0];

			asari.userInputHistory_Update(algorithm);
			document.querySelector("#enterValue").value = algorithm;
			
			result = PGcore.calculation(algorithm);
			PGcore.setResultView(result[0], result.length);
			document.querySelector("#resultView").value = localStorage.viewResultPrint;
			document.querySelector("#resultView").style.color = localStorage.viewResultColor;
			break;
			}
			
		case 40:		//down arrow
			{
			let calculateData = localStorage.CalculateHistory.split(',');

			if(calculateData.length-1 > parseInt(localStorage.historyReview)) asari.historyReview_Update(1, asari.ADD);

			let algorithm = calculateData[parseInt(localStorage.historyReview)].split('=')[0];
			
			asari.userInputHistory_Update(algorithm);
			document.querySelector("#enterValue").value = algorithm;
			
			result = PGcore.calculation(algorithm);
			PGcore.setResultView(result[0], result.length);
			document.querySelector("#resultView").value = localStorage.viewResultPrint;
			document.querySelector("#resultView").style.color = localStorage.viewResultColor;
			break;
			}
		}
	});
	
	document.querySelector("#settingButtom").addEventListener("click", () =>
	{
		let x = parseInt(document.querySelector("#History_Maximum_Fractional").value);
		let old = document.querySelector("#History_Maximum_Fractional").placeholder.split(' ')[0];
		if(!isNaN(x) && 1000 >= x && x >= 0) 
		{
			if(parseInt(old) !== x)
			{
				asari.HistoryMaximumFractional_Update(x);
				document.querySelector("#History_Maximum_Fractional").value = x;
				document.querySelector("#History_Maximum_Fractional").placeholder = `${x} (0~1000)`;
			
				document.querySelector("#History_Maximum_Fractional_Error").hidden = true;
				document.querySelector("#History_Maximum_Fractional_Success").hidden = false;
			}
			else 
			{
				document.querySelector("#History_Maximum_Fractional_Error").hidden = true;
				document.querySelector("#History_Maximum_Fractional_Success").hidden = true;
			}
		}
		else
		{
			document.querySelector("#History_Maximum_Fractional").value = old;
			document.querySelector("#History_Maximum_Fractional_Error").hidden = false;
			document.querySelector("#History_Maximum_Fractional_Success").hidden = true;
		}

		x = parseInt(document.querySelector("#Result_Maximum_Fractional").value);
		old = document.querySelector("#Result_Maximum_Fractional").placeholder.split(' ')[0];
		if(!isNaN(x) && 1000 >= x && x >= 0)
		{
			if(parseInt(old) !== x)
			{
				asari.ResultMaximumFractional_Update(x);
				document.querySelector("#Result_Maximum_Fractional").value = x;
				document.querySelector("#Result_Maximum_Fractional").placeholder = `${x} (0~1000)`;
				
				document.querySelector("#Result_Maximum_Fractional_Error").hidden = true;
				document.querySelector("#Result_Maximum_Fractional_Success").hidden = false;
			
				let result = PGcore.calculation(document.querySelector("#enterValue").value);
				
				PGcore.setResultView(result[0], result.length);
				document.querySelector("#resultView").value = localStorage.viewResultPrint;
				document.querySelector("#resultView").style.color = localStorage.viewResultColor;
			}
			else
			{
				document.querySelector("#Result_Maximum_Fractional_Error").hidden = true;
				document.querySelector("#Result_Maximum_Fractional_Success").hidden = true;
			}
		}
		else
		{
			document.querySelector("#Result_Maximum_Fractional").value = old;
			document.querySelector("#Result_Maximum_Fractional_Error").hidden = false;
			document.querySelector("#Result_Maximum_Fractional_Success").hidden = true;
		}

		x = parseInt(document.querySelector("#Calculate_History_Maximum").value);
		old = document.querySelector("#Calculate_History_Maximum").placeholder.split(' ')[0];
		if(!isNaN(x) && x >= 0)
		{
			if(parseInt(old) !== x)
			{
				asari.CalculateHistoryMaximum_Update(x);
				document.querySelector("#Calculate_History_Maximum").value = x;
				document.querySelector("#Calculate_History_Maximum").placeholder = `${x} (>=0)`;
				
				document.querySelector("#Calculate_History_Maximum_Error").hidden = true;
				document.querySelector("#Calculate_History_Maximum_Success").hidden = false;

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
						td.innerText = calculateData[num - now];
						td.addEventListener("click", (itself) => {localStorage.userInputHistory = itself.target.innerText.split('=')[0];let PGcore = new core();let result = PGcore.calculation(localStorage.userInputHistory);PGcore.setResultView(result[0], result.length);document.querySelector("#enterValue").value = localStorage.userInputHistory;document.querySelector("#resultView").value = localStorage.viewResultPrint;document.querySelector("#resultView").style.color = localStorage.viewResultColor;});
						tr.appendChild(td);
						tr.className = "historyViewer";
						document.querySelector("#historyShow").appendChild(tr);
						now += 1;
					}
				}
			}
			else
			{
				document.querySelector("#Calculate_History_Maximum_Error").hidden = true;
				document.querySelector("#Calculate_History_Maximum_Success").hidden = true;
			}
		}
		else
		{
			document.querySelector("#Calculate_History_Maximum").value = old;
			document.querySelector("#Calculate_History_Maximum_Error").hidden = false;
			document.querySelector("#Calculate_History_Maximum_Success").hidden = true;
		}
	});
	
	document.querySelector("#historyInput").addEventListener("click", () => {
		document.querySelector("#historyMod").hidden = !document.querySelector("#historyMod").hidden;
	});
	
	document.querySelector("#gear").addEventListener("click", () => 
	{
		document.querySelector("#History_Maximum_Fractional").value = document.querySelector("#History_Maximum_Fractional").placeholder.split(' ')[0];
		document.querySelector("#Result_Maximum_Fractional").value = document.querySelector("#Result_Maximum_Fractional").placeholder.split(' ')[0];
		
		document.querySelector("#setting").hidden = !document.querySelector("#setting").hidden;
		document.querySelector("#Result_Maximum_Fractional_Error").hidden =
		document.querySelector("#Result_Maximum_Fractional_Success").hidden =
		document.querySelector("#History_Maximum_Fractional_Error").hidden =
		document.querySelector("#History_Maximum_Fractional_Success").hidden = 
		document.querySelector("#Calculate_History_Maximum_Error").hidden =
		document.querySelector("#Calculate_History_Maximum_Success").hidden = true;
	});
	
	document.querySelector("#trash").addEventListener("click", () =>
	{
		asari.CalculateHistory_Update("", "", asari.DEL);
		for(x of document.querySelectorAll(".historyViewer")) document.querySelector("#historyShow").removeChild(x);
	});
	
	document.querySelector("#trash2").addEventListener("click", () =>
	{
		asari.viewResultPrint_Update("...");
		document.querySelector("#resultView").value = "...";
		
		asari.viewResultColor_Update("#ffffff");
		document.querySelector("#resultView").style.color = "#ffffff";

		asari.userInputHistory_Update();
		document.querySelector("#enterValue").value = "";
	});
	
	document.querySelector("#license").addEventListener("click", () =>
	{
		const license =
		{
			"Copyright (c) 2022 zhang7391 All rights reserved(click me)": "license: GNU General Public License v3.0(click me)",
			"license: GNU General Public License v3.0(click me)": "Copyright (c) 2022 zhang7391 All rights reserved(click me)"
		}
		
		document.querySelector("#license").innerText = license[document.querySelector("#license").innerText]
	});
});
