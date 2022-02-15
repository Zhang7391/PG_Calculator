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


(function (){
    const file = ["free.min.css",
				  "free-v4-shims.min.css", 
				  "free-v4-font-face.min.css", 
				  "free-v5-font-face.min.css"];

    for(let css of file)
    {
        let link = document.createElement("link");

        link.setAttribute("type", "text/css");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "./lib/" + css);

        document.head.appendChild(link);
    }
}());

window.addEventListener("load", () =>
{
	let translation = undefined;
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
	if(!localStorage.MaximumFractional) asari.MaximumFractional_Update("8");
	document.querySelector("#Maximum_Fractional").value = localStorage.MaximumFractional;
	document.querySelector("#Maximum_Fractional").placeholder = `${localStorage.MaximumFractional} (0~1000)`;
	
	if(!localStorage.CalculateHistoryMaximum) asari.CalculateHistoryMaximum_Update("20");

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

	fetch(location.pathname.slice(0, location.pathname.lastIndexOf("/")+1) + "language/" + language + ".json")
		.then(response => response.json())
		.then(data => 
		{
			translation = data;

			let result = PGcore.calculation(document.querySelector("#enterValue").value);
			PGcore.setResultView(result[0], result.length);
			document.querySelector("#resultView").value = localStorage.viewResultPrint;
			document.querySelector("#resultView").style.color = localStorage.viewResultColor;

			//translation HTML
			if(translation[document.querySelector("title").innerText] !== "") document.querySelector("title").innerText = translation[document.querySelector("title").innerText];
			if(translation[document.querySelector("#topTitle").innerText] !== "") document.querySelector("#topTitle").innerText = translation[document.querySelector("#topTitle").innerText];
			if(translation[document.querySelector("#enterValue").placeholder] !== "") document.querySelector("#enterValue").placeholder = translation[document.querySelector("#enterValue").placeholder];
			if(translation[document.querySelector("#infix").value] !== "") document.querySelector("#infix").value = translation[document.querySelector("#infix").value];
			if(translation[document.querySelector("#resultView").value] !== "" && translation[document.querySelector("#resultView").value] !== undefined) document.querySelector("#resultView").value = translation[document.querySelector("#resultView").value];
			if(translation[document.querySelector("#conversion_result_text").innerText] !== "") document.querySelector("#conversion_result_text").innerText = translation[document.querySelector("#conversion_result_text").innerText];
			if(translation[document.querySelector("#calculateHistory").innerText] !== "") document.querySelector("#calculateHistory").innerText = translation[document.querySelector("#calculateHistory").innerText];
			if(translation[document.querySelector("#userOptions").innerText] !== "") document.querySelector("#userOptions").innerText = translation[document.querySelector("#userOptions").innerText];
			if(translation[document.querySelector("#Maximum_Fractional_Text").innerText] !== "") document.querySelector("#Maximum_Fractional_Text").innerText = translation[document.querySelector("#Maximum_Fractional_Text").innerText];
			if(translation[document.querySelector("#settingButtom").value] !== "") document.querySelector("#settingButtom").value = translation[document.querySelector("#settingButtom").value];
			if(translation[document.querySelector("#license").innerText] !== "") document.querySelector("#license").innerText = translation[document.querySelector("#license").innerText];
			for(let x of document.querySelectorAll(".Num0to1000")) if(translation[x.innerText] !== "") x.innerText = translation[x.innerText];
			for(let x of document.querySelectorAll(".setupSuccess")) if(translation[x.innerText] !== "") x.innerText = translation[x.innerText];
		})
		.catch(error => console.log("No support for local language"));

	//Event Listener
	document.querySelector("#infix").addEventListener("click", () => 
	{
		let result = PGcore.calculation(document.querySelector("#enterValue").value);
		
		PGcore.setResultView(result[0], result.length);
		document.querySelector("#resultView").value = (translation !== undefined && translation[localStorage.viewResultPrint] !== "" && translation[localStorage.viewResultPrint] !== undefined)? translation[localStorage.viewResultPrint] : localStorage.viewResultPrint;
		document.querySelector("#resultView").style.color = localStorage.viewResultColor;
	});
	
	document.addEventListener("keyup", (press) =>
	{
		let result = undefined;
		if(document.querySelector("#enterValue").value !== localStorage.userInputHistory)
		{
			asari.userInputHistory_Update(document.querySelector("#enterValue").value);

			result = PGcore.calculation(localStorage.userInputHistory);
			PGcore.setResultView(result[0], result.length);
			document.querySelector("#resultView").value = (translation !== undefined && translation[localStorage.viewResultPrint] !== "" && translation[localStorage.viewResultPrint] !== undefined)? translation[localStorage.viewResultPrint] : localStorage.viewResultPrint;
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
			
			result = result[0];
			asari.historyReview_Update("-1", asari.SET)
			let formula = document.querySelector("#enterValue").value;
			let calculateData = localStorage.CalculateHistory.split(',');
			
			let zn = calculateData[calculateData.length-1].replace(/\s/g, "");
			if(zn === "" || (zn !== "" && zn.split("=")[0] !== formula.replace(/\s/g, ""))) 
			{
				asari.CalculateHistory_Update(tool.htmlToText(formula), result);
				calculateData.push(formula.replaceAll(',','') + " = " + result.toString());			
			}
			
			let decimalPlaces = parseInt(localStorage.MaximumFractional);
			if(result.dp() > decimalPlaces) result = result.toFixed(decimalPlaces).toString();
			else result = result.toString();
				
			for(x of document.querySelectorAll(".historyViewer")) document.querySelector("#historyShow").removeChild(x);
				
			let now = 0;
			while(parseInt(localStorage.CalculateHistoryMaximum) > now && calculateData.length > now+1)
			{
				let tr = document.createElement("tr"), td = document.createElement("td");
				td.innerText = calculateData[calculateData.length - now - 1];
				td.addEventListener("click", (itself) => {localStorage.userInputHistory = itself.target.innerText.split('=')[0];let PGcore = new core();let result = PGcore.calculation(localStorage.userInputHistory);PGcore.setResultView(result[0], result.length);document.querySelector("#enterValue").value = localStorage.userInputHistory;document.querySelector("#resultView").value = (translation !== undefined && translation[localStorage.viewResultPrint] !== "" && translation[localStorage.viewResultPrint] !== undefined)? translation[localStorage.viewResultPrint] : localStorage.viewResultPrint;document.querySelector("#resultView").style.color = localStorage.viewResultColor;});
				tr.appendChild(td);
				tr.className = "historyViewer";
				document.querySelector("#historyShow").appendChild(tr);
				now += 1;
			}
			break;
			//History's Event Listener Code. (input: itself[Object])
			/*
				localStorage.userInputHistory = itself.target.innerText.split('=')[0];
				let PGcore = new core();
				let result = PGcore.calculation(localStorage.userInputHistory);
				PGcore.setResultView(result[0], result.length);
				document.querySelector("#enterValue").value = localStorage.userInputHistory;
				document.querySelector("#resultView").value = (translation !== undefined && translation[localStorage.viewResultPrint] !== "" && translation[localStorage.viewResultPrint] !== undefined)? translation[localStorage.viewResultPrint] : localStorage.viewResultPrint;
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
			document.querySelector("#resultView").value = (translation !== undefined && translation[localStorage.viewResultPrint] !== "" && translation[localStorage.viewResultPrint] !== undefined)? translation[localStorage.viewResultPrint] : localStorage.viewResultPrint;
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
			document.querySelector("#resultView").value = (translation !== undefined && translation[localStorage.viewResultPrint] !== "" && translation[localStorage.viewResultPrint] !== undefined)? translation[localStorage.viewResultPrint] : localStorage.viewResultPrint;
			document.querySelector("#resultView").style.color = localStorage.viewResultColor;
			break;
			}
		}
	});
	
	document.querySelector("#settingButtom").addEventListener("click", () =>
	{
		let x = parseInt(document.querySelector("#Maximum_Fractional").value);
		let old = document.querySelector("#Maximum_Fractional").placeholder.split(' ')[0];
		if(!isNaN(x) && 1000 >= x && x >= 0) 
		{
			if(parseInt(old) !== x)
			{
				asari.MaximumFractional_Update(x);
				document.querySelector("#Maximum_Fractional").value = x;
				document.querySelector("#Maximum_Fractional").placeholder = `${x} (0~1000)`;
			
				document.querySelector("#Maximum_Fractional_Error").hidden = true;
				document.querySelector("#Maximum_Fractional_Success").hidden = false;

				let result = PGcore.calculation(localStorage.userInputHistory);
				PGcore.setResultView(result[0], result.length);
				document.querySelector("#resultView").value = (translation !== undefined && translation[localStorage.viewResultPrint] !== "" && translation[localStorage.viewResultPrint] !== undefined)? translation[localStorage.viewResultPrint] : localStorage.viewResultPrint;
				document.querySelector("#resultView").style.color = localStorage.viewResultColor;
			}
			else 
			{
				document.querySelector("#Maximum_Fractional_Error").hidden = true;
				document.querySelector("#Maximum_Fractional_Success").hidden = true;
			}
		}
		else
		{
			document.querySelector("#Maximum_Fractional").value = old;
			document.querySelector("#Maximum_Fractional_Error").hidden = false;
			document.querySelector("#Maximum_Fractional_Success").hidden = true;
		}
	});
	
	document.querySelector("#historyInput").addEventListener("click", () => {
		document.querySelector("#historyMod").hidden = !document.querySelector("#historyMod").hidden;});
	
	document.querySelector("#gear").addEventListener("click", () => 
	{	
		document.querySelector("#setting").hidden = !document.querySelector("#setting").hidden;
		document.querySelector("#Maximum_Fractional_Error").hidden =
		document.querySelector("#Maximum_Fractional_Success").hidden = true;
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
		const license = (translation === undefined 
							&& translation["Copyright (c) 2022 zhang7391 All rights reserved(click me)"] !== ""
							&& translation["license: GNU General Public License v3.0(click me)"] !== "")?
		{
			"Copyright (c) 2022 zhang7391 All rights reserved(click me)": "license: GNU General Public License v3.0(click me)",
			"license: GNU General Public License v3.0(click me)": "Copyright (c) 2022 zhang7391 All rights reserved(click me)"
		} :
		{
			[translation["Copyright (c) 2022 zhang7391 All rights reserved(click me)"]]: translation["license: GNU General Public License v3.0(click me)"],
			[translation["license: GNU General Public License v3.0(click me)"]]: translation["Copyright (c) 2022 zhang7391 All rights reserved(click me)"]
		};
		
		document.querySelector("#license").innerText = license[document.querySelector("#license").innerText]
	});
});