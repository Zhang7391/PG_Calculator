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

	if(!localStorage.viewResultPrint) localStorage.viewResultPrint = "...";
	document.querySelector("#resultView").value = localStorage.viewResultPrint;

	if(!localStorage.userInputHistory) localStorage.userInputHistory = "";
	document.querySelector("#enterValue").value = localStorage.userInputHistory;
	
	//Settings initialization
	if(!localStorage.ResultMaximumFractional) localStorage.ResultMaximumFractional = "1000";
	document.querySelector("#Result_Maximum_Fractional").placeholder = `${localStorage.ResultMaximumFractional} (0~1000)`;
	Decimal.set({precision: parseInt(localStorage.ResultMaximumFractional)});

	if(!localStorage.HistoryMaximumFractional) localStorage.HistoryMaximumFractional = "10";
	document.querySelector("#History_Maximum_Fractional").placeholder = `${localStorage.HistoryMaximumFractional} (0~1000)`;

	if(!localStorage.CalculateHistoryMaximum) localStorage.CalculateHistoryMaximum = "5";
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
			td.addEventListener("click", (itself) => {localStorage.userInputHistory = document.querySelector("#enterValue").value = itself.target.innerHTML.split('=')[0];document.querySelector("#infix").click();localStorage.viewResultPrint = document.querySelector("#resultView").value;document.querySelector("#enterValue").value = itself.target.innerHTML.split('=')[0];});
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
		
		let ans = PGcore.calculation(document.querySelector("#enterValue").value)
		
		document.querySelector("#resultView").value = ans;
	});
	
	document.addEventListener("keyup", (press) =>
	{
		//alert(press.keyCode);
		const PGcore = new core();
		const asari = new localStorageUpdate();
	
		asari.userInputHistory_Update(document.querySelector("#enterValue").value);
	
		switch(press.keyCode)
		{
		case 8:
		case 46:
			{
			if(document.querySelector("#resultView").value)
			break;
			}
		case 13:		//enter
			asari.historyReview_Update("-1", asari.SET)
			try
			{
				let result = new Decimal(document.querySelector("#resultView").value);
				if(result.minus(result.toFixed(0)).toString().length > parseInt(localStorage.HistoryMaximumFractional)+3) result = result.toExponential();
		
				asari.CalculateHistory_Update(document.querySelector("#enterValue").value, result);

				for(x of document.querySelectorAll(".historyViewer")) document.querySelector("#historyShow").removeChild(x);

				let calculateData = localStorage.CalculateHistory.split(','), now = 0;
				while(parseInt(localStorage.CalculateHistoryMaximum) > now && calculateData.length > now+1)
				{
					let tr = document.createElement("tr"), td = document.createElement("td");
					td.innerHTML = calculateData[calculateData.length - now - 1];
					td.addEventListener("click", (itself) => {localStorage.userInputHistory = document.querySelector("#enterValue").value = itself.target.innerHTML.split('=')[0];let PGcore = new core();document.querySelector("#resultView").value = PGcore.calculation(document.querySelector("#enterValue").value);localStorage.viewResultPrint = document.querySelector("#resultView").value;document.querySelector("#enterValue").value = itself.target.innerHTML.split('=')[0];});
					tr.appendChild(td);
					tr.className = "historyViewer";
					document.querySelector("#historyShow").appendChild(tr);
					now += 1;
				}
			}
			catch {;}
			finally {break;}
			
		case 38:		//up arrow
			{
			let calculateData = localStorage.CalculateHistory.split(',');

			if(localStorage.historyReview === "1") ;
			else if(localStorage.historyReview === "-1") asari.historyReview_Update(calculateData.length-1, asari.SET);
			else asari.historyReview_Update(1, asari.MINUS);
			
			let algorithm = calculateData[parseInt(localStorage.historyReview)].split('=')[0];
			let result = PGcore.calculation(algorithm);

			asari.userInputHistory_Update(algorithm);
			document.querySelector("#enterValue").value = algorithm;
			
			asari.viewResultPrint_Update(result);
			document.querySelector("#enterValue").value = algorithm;
			document.querySelector("#resultView").value = result;
			break;
			}
			
		case 40:		//down arrow
			{
			let calculateData = localStorage.CalculateHistory.split(',');

			if(calculateData.length-1 > parseInt(localStorage.historyReview)) asari.historyReview_Update(1, asari.ADD);

			let algorithm = calculateData[parseInt(localStorage.historyReview)].split('=')[0];
			let result = PGcore.calculation(algorithm);
			
			asari.userInputHistory_Update(algorithm);
			document.querySelector("#enterValue").value = algorithm;
			
			asari.viewResultPrint_Update(result);
			document.querySelector("#enterValue").value = algorithm;
			document.querySelector("#resultView").value = result;
			break;
			}
		}
		
		let ans = PGcore.calculation(document.querySelector("#enterValue").value);
		document.querySelector("#resultView").value = ans;
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