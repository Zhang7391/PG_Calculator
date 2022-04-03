/******************************************************/
//                                                     /
// Copyright (c) 2021 zhang7391 All rights reserved    /
//             <zhang7391@protonmail.com>              /
//                                                     /
// Version: PG-1.0.7                                   /
// License: GNU General Public License v3.0            /
// Github: https://github.com/Zhang7391/PG_Calculator  /
//                                                     /
// Keep this information if you use this code, please. /
//                                                     /
//*****************************************************/


(function(globalScope) 
{
	try {let test = !!localStorage;}
	catch {localStorage = Object.create(Object.prototype);}

	let nope = () => "PG_" + Math.random().toString(36).substr(2, 8) + Math.random().toString(36).substr(4, 10);
	let broad = {"PGallThingBewareBeginning": nope(), "PGallThingBewareBeginning2": nope()};
	nope = undefined;

	let local = document.getElementsByTagName("script"); 
	local = local[local.length - 1].getAttribute("src");
	local = local.slice(0, local.lastIndexOf("/")+1);
	
	let script = document.createElement("script");
	script.setAttribute("src", `${local}decimal.js`);
	script.setAttribute("id", broad["PGallThingBewareBeginning"]);
	document.head.appendChild(script);
	
	script.addEventListener("load", () =>
	{
		let script = document.createElement("script");
		script.setAttribute("src", `${local}PGcontent.js`);
		script.setAttribute("id", broad["PGallThingBewareBeginning2"]);
		document.head.appendChild(script);
	});
	
    file = ["free.min.css",
			"free-v4-shims.min.css", 
			"free-v4-font-face.min.css", 
			"free-v5-font-face.min.css"];

    for(let css of file)
    {
        let link = document.createElement("link");

        link.setAttribute("type", "text/css");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", `${local}lib/` + css);

        document.head.appendChild(link);
    }

	class PGcalculator
	{
		#set; #randomID;
		
		constructor(set = {}) {window.addEventListener("load", this.initialization(set));}
		
		initialization(set)
		{
			if(set["viewBox"] === undefined) throw this.PGcalculator_Error + "Can't find the view box.";
			if(set.viewBox.nodeName !== "DIV") throw this.PGcalculator_Error + "View box must be a div.";
			if(204 > set.viewBox.offsetHeight) throw this.PGcalculator_Error + "Height must be more than 204px.";
			this.#set = set;
			
			const id = () => "PG_" + Math.random().toString(36).substr(2, 8) + Math.random().toString(36).substr(4, 10);	
			const randomID = {};
			for(let tag of ["gear", "gear2", "infix", "trash", "trash2", "history", "license", "license2", "topTitle", "titleBar", "fakeTable", "Num0to1000", "enterValue", "resultView", "historyBar", "historyShow", "userOptions", "setupSuccess", "block_bottom", "bufferBlock", "license_block", "settingButtom", "calculateHistory", "Maximum_Fractional", "PGcalculator_container", "PGcalculator_container2", "Maximum_Fractional_Text", "Maximum_Fractional_Error", "Maximum_Fractional_Success", "illustrate", "illustrate_pi", "illustrate_ln", "illustrate_log"]) randomID[tag] = id();
			this.#randomID = randomID;

			const cssDiff = 
			{
				"trash2_top": undefined,
				"trash2_right": undefined,
				"trash2_position": undefined,
				"fakeTable_top": undefined,
				"enterValue_width":undefined,
				"fakeTable_td_width": undefined,
				"textarea_margin_top": undefined
			};
			if(set.viewBox.offsetWidth >= 590)
			{
				cssDiff.enterValue_width = "93%";
				cssDiff.trash2_position = "relative";
				cssDiff.fakeTable_td_width = ["65%", "6%", "15%", "7%", "7%"];
			}
			else
			{
				cssDiff.trash2_right = "0";
				cssDiff.trash2_top = "-39px";
				cssDiff.trash2_position = "absolute";
				cssDiff.enterValue_width = "90%";
				cssDiff.textarea_margin_top = "40px";
				cssDiff.fakeTable_td_width = ["0", "0", "84%", "8%", "8%"];
				cssDiff.fakeTable_top = "78px";
			}
			this.width = set.viewBox.offsetWidth;

			set.viewBox.style.backgroundColor = "#f9f2ff";	
	
			//PGcalculator root
			let div = document.createElement("div");
			
			div.setAttribute("id", randomID["PGcalculator_container"]);
			div.style.margin = "0";
			div.style.width = "100%";
			div.style.height = "100%";
			div.style.maxWidth = "600px";
			div.style.textAlign = "center";
			
			set.viewBox.appendChild(div);
			
			//title and button
			div = document.createElement("div");
			div.id = randomID["titleBar"];
			let h1 = document.createElement("h1");
			
			h1.id = randomID["topTitle"];
			h1.innerText = "Rapid Calculator";
			h1.style.textIndent = "0";
			h1.style.color = "#6c2dc7";
			h1.style.fontSize = "26px";
			h1.style.margin = "0 0 0.05em";
			
			let table = document.createElement("table");
			let tr = document.createElement("tr");
			
			table.setAttribute("id", randomID["fakeTable"]);
			table.style.height = "0";
			table.style.position = "absolute";
			table.style.top = (cssDiff.fakeTable_top === undefined)? "" : cssDiff.fakeTable_top;
			table.appendChild(tr);
			
			let td = document.createElement("td");
			td.style.paddingTop = "4px";
			td.style.width = cssDiff.fakeTable_td_width[0];
			td.innerHTML = "&nbsp;";
			tr.appendChild(td);
			
			td = document.createElement("td");
			//td.style.paddingTop = "4px";
			//td.style.padding = "0 5px 10px 0";
			td.style.paddingBottom = "10px";
			td.style.width = cssDiff.fakeTable_td_width[1];
			tr.appendChild(td);
			
			let button = document.createElement("button");
			td.appendChild(button);
			
			button.setAttribute("id", randomID["trash2"]);
			button.style.zIndex = "20";
			button.style.color = "#ff0000";
			button.style.fontSize = "25px";
			button.style.padding = "0px 5px";
			//button.style.marginBottom = "0px";
			button.style.lineHeight = "33px";
			button.style.borderRadius = "23px";
			button.style.backgroundColor = "#fbc0c0";
			button.style.position = cssDiff.trash2_position;
			button.style.top = (cssDiff.trash2_top === undefined)? "" : cssDiff.trash2_top;
			button.style.right = (cssDiff.trash2_right === undefined)? "" : cssDiff.trash2_right;	
			td.appendChild(button);
			
			let i = document.createElement("i");
			i.className = "fa fa-trash";
			button.appendChild(i);
			
			td = document.createElement("td");
			td.style.paddingTop = "4px";
			td.style.width = cssDiff.fakeTable_td_width[2];
			tr.appendChild(td);
			
			let input = document.createElement("input");
			input.setAttribute("type", "submit");
			input.setAttribute("value", "Calculate");
			input.setAttribute("id", randomID["infix"]);
			input.style.color = "#ffffff";
			input.style.fontSize = "15px";
			input.style.display = "inline";
			input.style.padding = "6px 12px";
			input.style.borderRadius = "23px";
			input.style.backgroundColor = "#7e12e3";
			td.appendChild(input);
			
			td = document.createElement("td");
			td.style.paddingTop = "4px";
			td.style.width = cssDiff.fakeTable_td_width[3];
			tr.appendChild(td);
			
			button = document.createElement("button");
			button.setAttribute("id", randomID["history"]);
			button.style.color = "#0000ff";
			button.style.fontSize = "25px";
			button.style.lineHeight = "31px";
			button.style.borderRadius = "23px";
			button.style.backgroundColor = "#b1bee3";
			td.appendChild(button);
			
			i = document.createElement("i");
			i.className = "fas fa-history";
			button.appendChild(i);
			
			td = document.createElement("td");
			td.style.paddingTop = "4px";
			td.style.width = cssDiff.fakeTable_td_width[4];
			tr.appendChild(td);
			
			button = document.createElement("button");
			button.setAttribute("id", randomID["gear"]);
			button.style.color = "#ceffce";
			button.style.fontSize = "25px";
			button.style.lineHeight = "31px";
			button.style.borderRadius = "23px";
			button.style.backgroundColor = "#228b22";
			td.appendChild(button);
			
			i = document.createElement("i");
			i.className = "fa fa-gear";
			button.appendChild(i);
			
			div.appendChild(h1);
			div.appendChild(table);
			div.appendChild(this.createEnterValue(cssDiff.enterValue_width));
			document.querySelector(`#${randomID["PGcalculator_container"]}`).appendChild(div);
			document.querySelector(`#${randomID["fakeTable"]}`).style.width = ((set.viewBox.offsetWidth >= 600)? "600": set.viewBox.offsetWidth.toString()) + "px";
			
			let css = `#${randomID["resultView"]}::election{background-color:#00ff00;} #${randomID["resultView"]}::-moz-selection{background-color:#00ff00;}`;
			let style = document.createElement("style");
			style.appendChild(document.createTextNode(css));
			
			let textarea = document.createElement("textarea");
			textarea.value = "...";
			textarea.readOnly = true;
			textarea.setAttribute("id", randomID["resultView"]);
			textarea.style.resize = "none";
			textarea.style.width = "95%";
			textarea.style.height = "28px";
			textarea.style.color = "#ffffff";
			textarea.style.caretColor = "#5efb6e";
			textarea.style.backgroundColor = "#000000";
			textarea.style.marginTop = (cssDiff.textarea_margin_top === undefined)? "" : cssDiff.textarea_margin_top;
			document.querySelector(`#${randomID["PGcalculator_container"]}`).appendChild(textarea);
			
			let p = document.createElement("p");
			p.setAttribute("id", randomID["historyBar"]);
			p.hidden = true;
			p.style.margin = "0";
			p.style.textAlign = "left";
			p.style.textIndent = "10px";
			document.querySelector("html").appendChild(style);
			
			let b = document.createElement("b");
			b.setAttribute("id", randomID["calculateHistory"]);
			b.innerText = "history of calculation";
			
			p.appendChild(b);
			p.innerHTML += "&nbsp;&nbsp;";
			document.querySelector(`#${randomID["PGcalculator_container"]}`).appendChild(p);
			
			button = document.createElement("button");
			button.setAttribute("id", randomID["trash"]);
			button.style.fontSize ="14px";
			button.style.color = "#ff0000";
			button.style.borderRadius = "15px";
			button.style.backgroundColor = "#fbc0c0";
			p.appendChild(button);
			
			i = document.createElement("i");
			i.className = "fa fa-trash";
			button.appendChild(i);
			
			div = document.createElement("div");
			div.setAttribute("id", randomID["block_bottom"]);
			div.hidden = true;
			div.style.marginLeft = "8px";
			div.style.overflowY = "auto";
			div.style.overflowX = "hidden";
			div.style.wordBreak = "break-all";
			div.style.maxHeight = "78px";
			document.querySelector(`#${randomID["PGcalculator_container"]}`).appendChild(div);
			
			table = document.createElement("table");
			table.id = randomID["historyShow"];
			table.style.width = "100%";
			table.style.textAlign = "left";
			div.appendChild(table);
			
			div = document.createElement("div");
			div.hidden = true;
			div.id = randomID["PGcalculator_container2"];
			div.style.width = "100%";
			div.style.height = "100%";
			div.style.maxWidth = "600px";
			
			set.viewBox.appendChild(div);
			
			table = document.createElement("table"), tr = document.createElement("tr"), td = document.createElement("td");
			td.style.width = "95%";
			td.style.color = "#228b22";
			td.style.fontSize = "24px";
			td.style.fontWeight = "700";
			td.style.paddingLeft = "40px";
			td.style.textAlign = "center";
			td.innerText = "Options";
			td.id = randomID["userOptions"];
			
			div.appendChild(table);
			table.appendChild(tr);
			tr.appendChild(td);
			
			td = document.createElement("td");
			td.style.width = "5%";
			tr.appendChild(td);
			
			button = document.createElement("button");
			button.setAttribute("id", randomID["gear2"]);
			button.style.color = "#ceffce";
			button.style.fontSize = "22px";
			button.style.lineHeight = "27px";
			button.style.borderRadius = "16px";
			button.style.backgroundColor = "#228b22";
			td.appendChild(button);
			
			i = document.createElement("i");
			i.className = "fa fa-gear";
			button.appendChild(i);
			
			table = document.createElement("table"), tr = document.createElement("tr"), td = document.createElement("td");
			td.id = randomID["Maximum_Fractional_Text"];
			td.style.paddingRight = "65px";
			td.innerText = "Maximum fractional digits";
			
			div.appendChild(table);
			table.appendChild(tr);
			tr.appendChild(td);
			
			td = document.createElement("td"), input = document.createElement("input");
			input.id = randomID["Maximum_Fractional"];
			input.setAttribute("type", "number");
			tr.appendChild(td);
			td.appendChild(input);
			
			tr = document.createElement("tr"), td = document.createElement("td");
			tr.hidden = true;
			tr.id = randomID["Maximum_Fractional_Error"];
			td.style.color = "#ff0000";
			td.style.textAlign = "center";
			td.id = randomID["Num0to1000"];
			td.innerText = "Error! Number range: 0~1000";
			
			table.appendChild(tr);
			tr.appendChild(td);
			tr.appendChild(document.createElement("td"));
			
			tr = document.createElement("tr"), td = document.createElement("td");
			tr.hidden = true;
			tr.id = randomID["Maximum_Fractional_Success"];
			td.style.color = "#00ff00";
			td.style.textAlign = "center";
			td.id = randomID["setupSuccess"];
			td.innerText = "success";
			
			table.appendChild(tr);
			tr.appendChild(td);
			tr.appendChild(document.createElement("td"));
			
			p = document.createElement("p"), input = document.createElement("input");
			p.style.textAlign = "center";
			input.id = randomID["settingButtom"];
			input.style.color = "#ffffff";
			input.style.padding = "3px 4px";
			input.style.borderRadius = "4px";
			input.style.backgroundColor = "#228b22";
			input.setAttribute("type", "submit");
			input.setAttribute("value", "Update");
			
			div.appendChild(p);
			p.appendChild(input);
			
			table = document.createElement("table");
			table.style.textAlign = "left";
			table.style.marginBottom = "20px";
			
			let caption = document.createElement("caption");
			caption.style.textAlign = "left";
			
			b = document.createElement("b");
			b.innerText = "Document";
			b.id = randomID["illustrate"];
			
			table.appendChild(caption);
			caption.appendChild(b);
			
			let teach = [["pi: Calculate pi", "illustrate_pi"], ["ln(x): Calculate ln x", "illustrate_ln"], ["log(x): Calculate log x", "illustrate_log"]];
			for(let x of teach)
			{
				tr = document.createElement("tr"), td = document.createElement("td");
				td.style.textIndent = "2em";
				td.innerText = x[0];
				td.id = randomID[x[1]];
				table.appendChild(tr);
				tr.appendChild(td);
			}
			div.appendChild(table);
		
			let span = document.createElement("span");
			p = document.createElement("p");
			p.id = randomID["license_block"];
			p.style.fontSize = "12px";
			p.style.color = "#888888";
			p.style.textAlign = "center";
			span.id = randomID["license"];
			//span.innerText = "License: GNU General Public License v3.0";
			
			div.appendChild(p);
			p.appendChild(span);
			p.appendChild(document.createElement("br"));
			
			span = document.createElement("span");
			span.id = randomID["license2"];
			//span.innerText = "Copyright (c) 2022 zhang7391 All rights reserved";
			
			p.appendChild(span);
			
			window.addEventListener("resize", () =>
			{
				if(this.width !== set.viewBox.offsetWidth)
				{
					let key = false;	//false: small, true: big
					this.width = set.viewBox.offsetWidth;
					
					if(set.viewBox.offsetWidth >= 590)
					{
						key = true;
						cssDiff.enterValue_width = "93%";
						cssDiff.trash2_position = "relative";
						cssDiff.fakeTable_td_width = ["65%", "6%", "15%", "7%", "7%"];
						cssDiff.fakeTable_top = cssDiff.trash2_top = cssDiff.trash2_right = cssDiff.textarea_margin_top = "";
					}
					else
					{
						cssDiff.trash2_right = "0";
						cssDiff.trash2_top = "-39px";
						cssDiff.trash2_position = "absolute";
						cssDiff.enterValue_width = "90%";
						cssDiff.textarea_margin_top = "40px";
						cssDiff.fakeTable_td_width = ["0", "0", "84%", "8%", "8%"];
						cssDiff.fakeTable_top = "78px";
					}
					
					let target = document.querySelector(`#${randomID["trash2"]}`);
					target.style.top = cssDiff.trash2_top;
					target.style.right = cssDiff.trash2_right;
					target.style.position = cssDiff.trash2_position;
					
					if(key === true && document.querySelector(`#${randomID["bufferBlock"]}`) === null)
					{
						target = document.querySelector(`#${randomID["titleBar"]}`);
						target.removeChild(document.querySelector(`#${randomID["enterValue"]}`));
						target.appendChild(this.createEnterValue(cssDiff.enterValue_width));
					}
					if(key === false && document.querySelector(`#${randomID["bufferBlock"]}`) !== null)
					{
						target = document.querySelector(`#${randomID["titleBar"]}`);
						target.removeChild(document.querySelector(`#${randomID["bufferBlock"]}`));
						target.appendChild(this.createEnterValue(cssDiff.enterValue_width));
						
						document.querySelector(`#${randomID["fakeTable"]}`).style.top = set.viewBox.getBoundingClientRect().top + "px";
					}
					
					document.querySelector(`#${randomID["resultView"]}`).style.marginTop = cssDiff.textarea_margin_top;
					
					target = 0;
					for(let x of document.querySelector(`#${randomID["fakeTable"]}`).childNodes[0].childNodes)
					{
						x.style.width = cssDiff.fakeTable_td_width[target];
						target += 1;
					}
					
					document.querySelector(`#${randomID["fakeTable"]}`).style.top = cssDiff.fakeTable_top;
					
					//document.querySelector(`#${randomID["block_bottom"]}`).style.height = set.viewBox.offsetHeight - 170).toString() + "100px";
					document.querySelector(`#${randomID["fakeTable"]}`).style.width = ((set.viewBox.offsetWidth >= 600)? "600" : set.viewBox.offsetWidth.toString()) + "px";
				}
			});
			
			document.querySelector(`#${broad["PGallThingBewareBeginning"]}`).addEventListener("load", () => {document.querySelector(`#${broad["PGallThingBewareBeginning2"]}`).addEventListener("load", () => {this.#setEventListener();});}, {once: true});
		}
		
		createEnterValue(width)
		{	
			let block = undefined;
			
			let input = document.createElement("input");
			input.setAttribute("name", "massage");
			input.setAttribute("id", this.#randomID["enterValue"]);
			input.setAttribute("placeholder", "Please enter your postfix notation.");
			input.style.padding = "4px 0 4px 9px";
			input.style.border = "2px black soild";
			input.style.cursor = "pointer";
			input.style.margin = "0.05em 20px 0.5em 0";
			input.style.height = "38px";
			input.style.borderRadius = "5px 20px 20px 5px";
			input.style.width = width;
			
			if(width === "93%")
			{
				block = document.createElement("table");
				block.style.width = "100%";
				block.style.backgroundColor ="#f9f2ff";
				block.setAttribute("id", this.#randomID["bufferBlock"]);
				
				let tr = document.createElement("tr"), td = document.createElement("td");
				td.style.zIndex = "0";
				td.style.width = "70%";
				td.style.position = "relative";
				td.appendChild(input);
				tr.appendChild(td);
				
				td = document.createElement("td");
				td.style.width = "30%";
				td.innerHTML = "&nbsp;";
				tr.appendChild(td);
				
				block.appendChild(tr);
			}
			else return input;
			
			return block;
		}
		
		#setEventListener()
		{
			let translation = undefined;
			
			const PGcore = new core();
			const tool = new toolbox();
			const asari = new localStorageUpdate();
			
			//Core initialization
			if(!localStorage.viewResultColor) asari.viewResultColor_Update("#ffffff");
			document.querySelector(`#${this.#randomID["resultView"]}`).style.color = localStorage.viewResultColor;

			if(!localStorage.userInputHistory) asari.userInputHistory_Update();
			document.querySelector(`#${this.#randomID["enterValue"]}`).value = localStorage.userInputHistory;
			
			if(!localStorage.viewResultPrint) /*asari.viewResultPrint_Update("...")*/;
			let result = PGcore.calculation(localStorage.userInputHistory);
			PGcore.setResultView(result[0], result.length);
			document.querySelector(`#${this.#randomID["resultView"]}`).value = localStorage.viewResultPrint;
			document.querySelector(`#${this.#randomID["resultView"]}`).style.color = localStorage.viewResultColor;
			
			//Settings initialization
			if(!localStorage.MaximumFractional) asari.MaximumFractional_Update("8");
			document.querySelector(`#${this.#randomID["Maximum_Fractional"]}`).value = localStorage.MaximumFractional;
			document.querySelector(`#${this.#randomID["Maximum_Fractional"]}`).placeholder = `${localStorage.MaximumFractional} (0~1000)`;
			
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
					td.addEventListener("click", (itself) => {localStorage.userInputHistory = itself.target.innerText.split('=')[0];let PGcore = new core();let result = PGcore.calculation(localStorage.userInputHistory);PGcore.setResultView(result[0], result.length);document.querySelector(`#${this.#randomID["enterValue"]}`).value = localStorage.userInputHistory;document.querySelector(`#${this.#randomID["resultView"]}`).value = localStorage.viewResultPrint;document.querySelector(`#${this.#randomID["resultView"]}`).style.color = localStorage.viewResultColor;});
					tr.appendChild(td);
					tr.style.cursor = "pointer";
					tr.className = "historyViewer";
					document.querySelector(`#${this.#randomID["historyShow"]}`).appendChild(tr);
					now += 1;
				}
			}
			
			if(!localStorage.historyReview) asari.historyReview_Update("-1", asari.SET);
			
			//Load other language
			const language = (navigator.language || navigator.browserLanguage).toLowerCase();

			fetch(local + "language/" + language + ".json")
				.then(response => response.json())
				.then(data => 
				{
					translation = data;

					let result = PGcore.calculation(document.querySelector(`#${this.#randomID["enterValue"]}`).value);
					PGcore.setResultView(result[0], result.length);
					document.querySelector(`#${this.#randomID["resultView"]}`).value = localStorage.viewResultPrint;
					document.querySelector(`#${this.#randomID["resultView"]}`).style.color = localStorage.viewResultColor;

					//translation
					for(let x of ["topTitle", "calculateHistory", "userOptions", "Maximum_Fractional_Text", "license", "license2", "Num0to1000", "setupSuccess", "illustrate", "illustrate_pi", "illustrate_ln", "illustrate_log"])
					{
						let y = document.querySelector(`#${this.#randomID[x]}`);
						if(translation[y.innerText] !== "" && translation[y.innerText] !== undefined) y.innerText = translation[y.innerText];
					}

					for(let x of ["infix", "resultView", "settingButtom"])
					{
						let y = document.querySelector(`#${this.#randomID[x]}`);
                        
						if(translation[y.value] !== "" && translation[y.value] !== undefined) y.value = translation[y.value];
					}

					if(translation[document.querySelector(`#${this.#randomID["enterValue"]}`).placeholder] !== "" && translation[document.querySelector(`#${this.#randomID["enterValue"]}`).placeholder] !== undefined) document.querySelector(`#${this.#randomID["enterValue"]}`).placeholder = translation[document.querySelector(`#${this.#randomID["enterValue"]}`).placeholder];
				})
				.catch(error => console.log("No support for local language"));
				
			//Event Listener
			document.querySelector(`#${this.#randomID["infix"]}`).addEventListener("click", () => 
			{
				let result = PGcore.calculation(document.querySelector(`#${this.#randomID["enterValue"]}`).value);
				
				PGcore.setResultView(result[0], result.length);
				document.querySelector(`#${this.#randomID["resultView"]}`).value = (translation !== undefined && translation[localStorage.viewResultPrint] !== "" && translation[localStorage.viewResultPrint] !== undefined)? translation[localStorage.viewResultPrint] : localStorage.viewResultPrint;
				document.querySelector(`#${this.#randomID["resultView"]}`).style.color = localStorage.viewResultColor;

				if(result instanceof Decimal)
				{
                result = result[0];
                asari.historyReview_Update("-1", asari.SET)
                let formula = document.querySelector(`#${this.#randomID["enterValue"]}`).value;
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

                for(let x of document.querySelectorAll(".historyViewer")) document.querySelector(`#${this.#randomID["historyShow"]}`).removeChild(x);

                let now = 0;
                while(parseInt(localStorage.CalculateHistoryMaximum) > now && calculateData.length > now+1)
                {
                    let tr = document.createElement("tr"), td = document.createElement("td");
                    td.innerText = calculateData[calculateData.length - now - 1];
                    td.addEventListener("click", (itself) => {localStorage.userInputHistory = itself.target.innerText.split('=')[0];let PGcore = new core();let result = PGcore.calculation(localStorage.userInputHistory);PGcore.setResultView(result[0], result.length);document.querySelector(`#${this.#randomID["enterValue"]}`).value = localStorage.userInputHistory;document.querySelector(`#${this.#randomID["resultView"]}`).value = (translation !== undefined && translation[localStorage.viewResultPrint] !== "" && translation[localStorage.viewResultPrint] !== undefined)? translation[localStorage.viewResultPrint] : localStorage.viewResultPrint;document.querySelector(`#${this.#randomID["resultView"]}`).style.color = localStorage.viewResultColor;});
                    tr.appendChild(td);
                    tr.style.cursor = "pointer";
                    tr.className = "historyViewer";
                    document.querySelector(`#${this.#randomID["historyShow"]}`).appendChild(tr);
                    now += 1;
				}
			}
		});
			
			document.querySelector(`#${this.#randomID["enterValue"]}`).addEventListener("keydown", () => 
			{
				document.querySelector(`#${this.#randomID["historyBar"]}`).hidden = false;
				document.querySelector(`#${this.#randomID["block_bottom"]}`).hidden = false;
			}, {once: true});
			
			document.addEventListener("keyup", (press) =>
			{
				let result = undefined;
				if(document.querySelector(`#${this.#randomID["enterValue"]}`).value !== localStorage.userInputHistory)
				{
					asari.userInputHistory_Update(document.querySelector(`#${this.#randomID["enterValue"]}`).value);

					result = PGcore.calculation(localStorage.userInputHistory);
					PGcore.setResultView(result[0], result.length);
					document.querySelector(`#${this.#randomID["resultView"]}`).value = (translation !== undefined && translation[localStorage.viewResultPrint] !== "" && translation[localStorage.viewResultPrint] !== undefined)? translation[localStorage.viewResultPrint] : localStorage.viewResultPrint;
					document.querySelector(`#${this.#randomID["resultView"]}`).style.color = localStorage.viewResultColor;
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
					let formula = document.querySelector(`#${this.#randomID["enterValue"]}`).value;
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
						
					for(let x of document.querySelectorAll(".historyViewer")) document.querySelector(`#${this.#randomID["historyShow"]}`).removeChild(x);
						
					let now = 0;
					while(parseInt(localStorage.CalculateHistoryMaximum) > now && calculateData.length > now+1)
					{
						let tr = document.createElement("tr"), td = document.createElement("td");
						td.innerText = calculateData[calculateData.length - now - 1];
						td.addEventListener("click", (itself) => {localStorage.userInputHistory = itself.target.innerText.split('=')[0];let PGcore = new core();let result = PGcore.calculation(localStorage.userInputHistory);PGcore.setResultView(result[0], result.length);document.querySelector(`#${this.#randomID["enterValue"]}`).value = localStorage.userInputHistory;document.querySelector(`#${this.#randomID["resultView"]}`).value = (translation !== undefined && translation[localStorage.viewResultPrint] !== "" && translation[localStorage.viewResultPrint] !== undefined)? translation[localStorage.viewResultPrint] : localStorage.viewResultPrint;document.querySelector(`#${this.#randomID["resultView"]}`).style.color = localStorage.viewResultColor;});
						tr.appendChild(td);
						tr.style.cursor = "pointer";
						tr.className = "historyViewer";
						document.querySelector(`#${this.#randomID["historyShow"]}`).appendChild(tr);
						now += 1;
					}
					break;
					//History's Event Listener Code. (input: itself[Object])
					/*
						localStorage.userInputHistory = itself.target.innerText.split('=')[0];
						let PGcore = new core();
						let result = PGcore.calculation(localStorage.userInputHistory);
						PGcore.setResultView(result[0], result.length);
						document.querySelector(`#${this.#randomID["enterValue"]}`).value = localStorage.userInputHistory;
						document.querySelector(`#${this.#randomID["resultView"]}`).value = (translation !== undefined && translation[localStorage.viewResultPrint] !== "" && translation[localStorage.viewResultPrint] !== undefined)? translation[localStorage.viewResultPrint] : localStorage.viewResultPrint;
						document.querySelector(`#${this.#randomID["resultView"]}`).style.color = localStorage.viewResultColor;
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
					document.querySelector(`#${this.#randomID["enterValue"]}`).value = algorithm;
					
					result = PGcore.calculation(algorithm);
					PGcore.setResultView(result[0], result.length);
					document.querySelector(`#${this.#randomID["resultView"]}`).value = (translation !== undefined && translation[localStorage.viewResultPrint] !== "" && translation[localStorage.viewResultPrint] !== undefined)? translation[localStorage.viewResultPrint] : localStorage.viewResultPrint;
					document.querySelector(`#${this.#randomID["resultView"]}`).style.color = localStorage.viewResultColor;
					break;
					}
					
				case 40:		//down arrow
					{
					let calculateData = localStorage.CalculateHistory.split(',');

					if(calculateData.length-1 > parseInt(localStorage.historyReview)) asari.historyReview_Update(1, asari.ADD);

					let algorithm = calculateData[parseInt(localStorage.historyReview)].split('=')[0];
					
					asari.userInputHistory_Update(algorithm);
					document.querySelector(`#${this.#randomID["enterValue"]}`).value = algorithm;
					
					result = PGcore.calculation(algorithm);
					PGcore.setResultView(result[0], result.length);
					document.querySelector(`#${this.#randomID["resultView"]}`).value = (translation !== undefined && translation[localStorage.viewResultPrint] !== "" && translation[localStorage.viewResultPrint] !== undefined)? translation[localStorage.viewResultPrint] : localStorage.viewResultPrint;
					document.querySelector(`#${this.#randomID["resultView"]}`).style.color = localStorage.viewResultColor;
					break;
					}
				}
			});
			
		document.querySelector(`#${this.#randomID["settingButtom"]}`).addEventListener("click", () =>
			{
				let x = parseInt(document.querySelector(`#${this.#randomID["Maximum_Fractional"]}`).value);
				let old = document.querySelector(`#${this.#randomID["Maximum_Fractional"]}`).placeholder.split(' ')[0];
				if(!isNaN(x) && 1000 >= x && x >= 0) 
				{
					if(parseInt(old) !== x)
					{
						asari.MaximumFractional_Update(x);
						document.querySelector(`#${this.#randomID["Maximum_Fractional"]}`).value = x;
						document.querySelector(`#${this.#randomID["Maximum_Fractional"]}`).placeholder = `${x} (0~1000)`;
					
						document.querySelector(`#${this.#randomID["Maximum_Fractional_Error"]}`).hidden = true;
						document.querySelector(`#${this.#randomID["Maximum_Fractional_Success"]}`).hidden = false;

						let result = PGcore.calculation(localStorage.userInputHistory);
						PGcore.setResultView(result[0], result.length);
						document.querySelector(`#${this.#randomID["resultView"]}`).value = (translation !== undefined && translation[localStorage.viewResultPrint] !== "" && translation[localStorage.viewResultPrint] !== undefined)? translation[localStorage.viewResultPrint] : localStorage.viewResultPrint;
						document.querySelector(`#${this.#randomID["resultView"]}`).style.color = localStorage.viewResultColor;
					
						document.querySelector(`#${this.#randomID["license_block"]}`).style.top = (this.#set.viewBox.getBoundingClientRect().height - ((this.#set.viewBox.offsetWidth >= 340)? 177 : 190)).toString() + "px";
					}
					else 
					{
						document.querySelector(`#${this.#randomID["Maximum_Fractional_Error"]}`).hidden = true;
						document.querySelector(`#${this.#randomID["Maximum_Fractional_Success"]}`).hidden = true;
						//document.querySelector(`#${this.#randomID["license_block"]}`).style.top = (this.#set.viewBox.getBoundingClientRect().height - ((this.#set.viewBox.offsetWidth >= 340)? 154 : 167)).toString() + "px";
					}
				}
				else
				{
					document.querySelector(`#${this.#randomID["Maximum_Fractional"]}`).value = old;
					document.querySelector(`#${this.#randomID["Maximum_Fractional_Error"]}`).hidden = false;
					document.querySelector(`#${this.#randomID["Maximum_Fractional_Success"]}`).hidden = true;
				
					document.querySelector(`#${this.#randomID["license_block"]}`).style.top = (this.#set.viewBox.getBoundingClientRect().height - ((this.#set.viewBox.offsetWidth >= 340)? 177 : 190)).toString() + "px";
				}
			});
			
			document.querySelector(`#${this.#randomID["history"]}`).addEventListener("click", () => 
			{
				document.querySelector(`#${this.#randomID["historyBar"]}`).hidden = !document.querySelector(`#${this.#randomID["historyBar"]}`).hidden;
				document.querySelector(`#${this.#randomID["block_bottom"]}`).hidden = !document.querySelector(`#${this.#randomID["block_bottom"]}`).hidden;
			});
				
			document.querySelector(`#${this.#randomID["gear"]}`).addEventListener("click", () => 
			{	
				document.querySelector(`#${this.#randomID["PGcalculator_container"]}`).hidden = true;
				document.querySelector(`#${this.#randomID["PGcalculator_container2"]}`).hidden = false;
				document.querySelector(`#${this.#randomID["Maximum_Fractional_Error"]}`).hidden =
				document.querySelector(`#${this.#randomID["Maximum_Fractional_Success"]}`).hidden = true;
				document.querySelector(`#${this.#randomID["license_block"]}`).style.top = (this.#set.viewBox.getBoundingClientRect().height - ((this.#set.viewBox.offsetWidth >= 340)? 154 : 167)).toString() + "px";
			});
			
			document.querySelector(`#${this.#randomID["gear2"]}`).addEventListener("click", () => 
			{
				document.querySelector(`#${this.#randomID["PGcalculator_container"]}`).hidden = false;
				document.querySelector(`#${this.#randomID["PGcalculator_container2"]}`).hidden = true;
			});
			
			document.querySelector(`#${this.#randomID["trash"]}`).addEventListener("click", () =>
			{
				asari.CalculateHistory_Update("", "", asari.DEL);
				for(let x of document.querySelectorAll(".historyViewer")) document.querySelector(`#${this.#randomID["historyShow"]}`).removeChild(x);
			});
			
			document.querySelector(`#${this.#randomID["trash2"]}`).addEventListener("click", () =>
			{
				asari.viewResultPrint_Update("...");
				document.querySelector(`#${this.#randomID["resultView"]}`).value = "...";
				
				asari.viewResultColor_Update("#ffffff");
				document.querySelector(`#${this.#randomID["resultView"]}`).style.color = "#ffffff";

				asari.userInputHistory_Update();
				document.querySelector(`#${this.#randomID["enterValue"]}`).value = "";
			});
		}

		get set() {return this.#set;}
		get idList() {return this.#randomID;}
		get [Symbol.toStringTag]() {return "PGcalculator";}
		get PGcalculator_Error() {return "[PGcalculator Error]: ";}
	}

	
	// Export
	// Node and other environments that support module.exports
	if(typeof module != "undefined" && module.exports) module.exports = function(set = {}) {return new PGcalculator(set)};
	else 	// Browser 
	{
		if (!globalScope) globalScope = (typeof self != "undefined" && self && self.self == self)? self : window;

		globalScope.PGcalculator = PGcalculator;
	}
}(this));
