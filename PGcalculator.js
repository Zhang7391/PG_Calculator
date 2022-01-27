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

window.addEventListener("load", () =>
{
	try {let test = !!localStorage;}
	catch {localStorage = Object.create(Object.prototype);}
	
	//Core initialization
	if(!localStorage.viewResultColor) localStorage.viewResultColor = "#ffffff";
	document.querySelector("#resultView").style.color = localStorage.viewResultColor;

	if(!localStorage.userInputHistory) localStorage.userInputHistory = "";
	document.querySelector("#enterValue").value = localStorage.userInputHistory;
	
	if(!localStorage.viewResultPrint) localStorage.viewResultPrint = "...";
	let PGcore = new core();
	let result = PGcore.calculation(localStorage.userInputHistory);
	PGcore.setResultView(result[0], result.length);
	document.querySelector("#resultView").value = localStorage.viewResultPrint;
	document.querySelector("#resultView").style.color = localStorage.viewResultColor;
	
	//Settings initialization
	if(!localStorage.ResultMaximumFractional) localStorage.ResultMaximumFractional = "1000";
	document.querySelector("#Result_Maximum_Fractional").value = localStorage.ResultMaximumFractional;
	document.querySelector("#Result_Maximum_Fractional").placeholder = `${localStorage.ResultMaximumFractional} (0~1000)`;
	Decimal.set({precision: parseInt(localStorage.ResultMaximumFractional)});

	if(!localStorage.HistoryMaximumFractional) localStorage.HistoryMaximumFractional = "10";
	document.querySelector("#History_Maximum_Fractional").value = localStorage.HistoryMaximumFractional;
	document.querySelector("#History_Maximum_Fractional").placeholder = `${localStorage.HistoryMaximumFractional} (0~1000)`;

	if(!localStorage.CalculateHistoryMaximum) localStorage.CalculateHistoryMaximum = "5";
	document.querySelector("#Calculate_History_Maximum").value = localStorage.CalculateHistoryMaximum;
	document.querySelector("#Calculate_History_Maximum").placeholder = `${localStorage.CalculateHistoryMaximum} (>=0)`;

	//History initialization
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
			td.addEventListener("click", (itself) => {localStorage.userInputHistory = itself.target.innerHTML.split('=')[0];let PGcore = new core();let result = PGcore.calculation(localStorage.userInputHistory);PGcore.setResultView(result[0], result.length);document.querySelector("#enterValue").value = localStorage.userInputHistory;document.querySelector("#resultView").value = localStorage.viewResultPrint;document.querySelector("#resultView").style.color = localStorage.viewResultColor;});
			tr.appendChild(td);
			tr.className = "historyViewer";
			document.querySelector("#historyShow").appendChild(tr);
			now += 1;
		}
	}

	if(!localStorage.historyReview) localStorage.historyReview = "-1";
	
	
	//Event Listener
	document.querySelector("#infix").addEventListener("click", () => 
	{
		const PGcore = new core();
		
		let result = PGcore.calculation(document.querySelector("#enterValue").value);
		
		PGcore.setResultView(result[0], result.length);
		document.querySelector("#resultView").value = localStorage.viewResultPrint;
		document.querySelector("#resultView").style.color = localStorage.viewResultColor;
	});
	
	document.addEventListener("keyup", (press) =>
	{
		//alert(press.keyCode);
		const PGcore = new core();
		const asari = new localStorageUpdate();
		const tool = new toolbox();
	
		asari.userInputHistory_Update(document.querySelector("#enterValue").value);
		let result = PGcore.calculation(document.querySelector("#enterValue").value);
	
		switch(press.keyCode)
		{
		case 13:		//enter
			asari.historyReview_Update("-1", asari.SET)
			try
			{
				if(result[0].minus(result[0].toFixed(0)).toString().length > parseInt(localStorage.HistoryMaximumFractional)+3) result[0] = result[0].toExponential();
		
				asari.CalculateHistory_Update(document.querySelector("#enterValue").value, result[0]);

				for(x of document.querySelectorAll(".historyViewer")) document.querySelector("#historyShow").removeChild(x);

				let calculateData = localStorage.CalculateHistory.split(','), now = 0;
				while(parseInt(localStorage.CalculateHistoryMaximum) > now && calculateData.length > now+1)
				{
					let tr = document.createElement("tr"), td = document.createElement("td");
					td.innerHTML = calculateData[calculateData.length - now - 1];
					td.addEventListener("click", (itself) => {localStorage.userInputHistory = itself.target.innerHTML.split('=')[0];let PGcore = new core();let result = PGcore.calculation(localStorage.userInputHistory);PGcore.setResultView(result[0], result.length);document.querySelector("#enterValue").value = localStorage.userInputHistory;document.querySelector("#resultView").value = localStorage.viewResultPrint;document.querySelector("#resultView").style.color = localStorage.viewResultColor;});
					tr.appendChild(td);
					tr.className = "historyViewer";
					document.querySelector("#historyShow").appendChild(tr);
					now += 1;
				}
			}
			catch {;}
			finally {break;}			
			//History's Event Listener Code. (input: itself[Object])
			/*
				localStorage.userInputHistory = itself.target.innerHTML.split('=')[0];
				let PGcore = new core();
				let result = PGcore.calculation(localStorage.userInputHistory);
				PGcore.setResultView(result[0], result.length);
				document.querySelector("#enterValue").value = localStorage.userInputHistory;
				document.querySelector("#resultView").value = localStorage.viewResultPrint;
				document.querySelector("#resultView").style.color = localStorage.viewResultColor;
			*/
			
		case 38:		//up arrow
			{
			let calculateData = localStorage.CalculateHistory.split(',');

			if(localStorage.historyReview === "1") ;
			else if(localStorage.historyReview === "-1") asari.historyReview_Update(calculateData.length-1, asari.SET);
			else asari.historyReview_Update(1, asari.MINUS);
			
			let algorithm = calculateData[parseInt(localStorage.historyReview)].split('=')[0];

			asari.userInputHistory_Update(algorithm);
			document.querySelector("#enterValue").value = algorithm;
			
			asari.viewResultPrint_Update(result);
			document.querySelector("#enterValue").value = algorithm;
			break;
			}
			
		case 40:		//down arrow
			{
			let calculateData = localStorage.CalculateHistory.split(',');

			if(calculateData.length-1 > parseInt(localStorage.historyReview)) asari.historyReview_Update(1, asari.ADD);

			let algorithm = calculateData[parseInt(localStorage.historyReview)].split('=')[0];
			
			asari.userInputHistory_Update(algorithm);
			document.querySelector("#enterValue").value = algorithm;
			
			asari.viewResultPrint_Update(result);
			document.querySelector("#enterValue").value = algorithm;
			break;
			}
		}
		
		PGcore.setResultView(result[0], result.length);
		document.querySelector("#resultView").value = localStorage.viewResultPrint;
		document.querySelector("#resultView").style.color = localStorage.viewResultColor;
	});
	
	document.querySelector("#settingButtom").addEventListener("click", () =>
	{
		let asari = new localStorageUpdate();
		
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
				let PGcore = new core();
			
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
						td.innerHTML = calculateData[num - now];
						td.addEventListener("click", (itself) => {localStorage.userInputHistory = itself.target.innerHTML.split('=')[0];let PGcore = new core();let result = PGcore.calculation(localStorage.userInputHistory);PGcore.setResultView(result[0], result.length);document.querySelector("#enterValue").value = localStorage.userInputHistory;document.querySelector("#resultView").value = localStorage.viewResultPrint;document.querySelector("#resultView").style.color = localStorage.viewResultColor;});
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
		let asari = new localStorageUpdate();
		
		asari.CalculateHistory_Update("", "", asari.DEL);
		for(x of document.querySelectorAll(".historyViewer")) document.querySelector("#historyShow").removeChild(x);
	});
	
	document.querySelector("#trash2").addEventListener("click", () =>
	{
		let asari = new localStorageUpdate();
		
		asari.viewResultPrint_Update("...");
		document.querySelector("#resultView").value = "...";
		
		asari.viewResultColor_Update("#ffffff");
		document.querySelector("#resultView").style.color = "#ffffff";

		asari.userInputHistory_Update("");
		document.querySelector("#enterValue").value = "";
	});
	
	document.querySelector("#license").addEventListener("click", () =>
	{
		const license =
		{
			"Copyright (c) 2022 zhang7391 All rights reserved(click me)": "license: GNU General Public License v3.0(click me)",
			"license: GNU General Public License v3.0(click me)": "Copyright (c) 2022 zhang7391 All rights reserved(click me)"
		}
		
		document.querySelector("#license").innerHTML = license[document.querySelector("#license").innerHTML]
	});
});

//localStorage.userInputHistory = itself.target.innerHTML.split('=')[0];let PGcore = new core();let result = PGcore.calculation(localStorage.userInputHistory);PGcore.setResultView(result[0], result.length);document.querySelector("#enterValue").value = localStorage.userInputHistory;document.querySelector("#resultView").value = localStorage.viewResultPrint;document.querySelector("#resultView").style.color = localStorage.viewResultColor;