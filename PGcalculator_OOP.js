/*****************************************************/
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

(function(globalScope) 
{
    class PGcalculator
	{
		#set; #randomID;
		
		constructor(set = {})
		{
			if(set["viewBox"] === undefined) throw this.PGcalculator_Error + "Can't find the view box.";
			if(set.viewBox.nodeName !== "DIV") throw this.PGcalculator_Error + "View box must be a div.";
			if(204 > set.viewBox.offsetHeight) throw this.PGcalculator_Error + "Height must be more than 204px.";
			this.#set = set;
			
			const id = () => "PG_" + Math.random().toString(36).substr(2, 8) + Math.random().toString(36).substr(4, 10);	
			const randomID = 
			{
				"gear": id(),
				"infix": id(),
				"trash": id(),
				"trash2": id(),
				"history": id(),
				"titleBar": id(),
				"fakeTable": id(),
				"enterValue": id(),
				"resultView": id(),
				"historyBar": id(),
				"historyShow": id(),
				"block_bottom": id(),
				"bufferBlock" : id(),
				"calculateHistory": id(),
				"PGcalculator_container": id()
			}
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
				cssDiff.fakeTable_td_width = ["65%", "6%", "15%", "7%", "7%"];
			}
			else
			{
				cssDiff.trash2_right = "0";
				cssDiff.trash2_top = "-37px";
				cssDiff.trash2_position = "absolute";
				cssDiff.enterValue_width = "90%";
				cssDiff.textarea_margin_top = "40px";
				cssDiff.fakeTable_td_width = ["0", "0", "84%", "8%", "8%"];
				cssDiff.fakeTable_top = `${71 + set.viewBox.getBoundingClientRect().top}px`;
			}
			this.width = set.viewBox.offsetWidth;
			
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
			
			td.style.width = cssDiff.fakeTable_td_width[0];
			td.innerHTML = "&nbsp;";
			tr.appendChild(td);
			
			td = document.createElement("td");
			td.style.width = cssDiff.fakeTable_td_width[1];
			tr.appendChild(td);
			
			let button = document.createElement("button");
			td.appendChild(button);
			
			button.setAttribute("id", randomID["trash2"]);
			button.style.color = "#ff0000";
			button.style.fontSize = "25px";
			button.style.padding = "1px 6px";
			button.style.marginBottom = "6px";
			button.style.borderRadius = "23px";
			button.style.backgroundColor = "#fbc0c0";
			button.style.top = (cssDiff.trash2_top === undefined)? "" : cssDiff.trash2_top;
			button.style.right = (cssDiff.trash2_right === undefined)? "" : cssDiff.trash2_right;
			button.style.position = (cssDiff.trash2_position === undefined)? "" : cssDiff.trash2_position;	
			td.appendChild(button);
			
			let i = document.createElement("i");
			i.className = "fa fa-trash";
			button.appendChild(i);
			
			td = document.createElement("td");
			td.style.width = cssDiff.fakeTable_td_width[2];
			tr.appendChild(td);
			
			let input = document.createElement("input");
			input.setAttribute("type", "submit");
			input.setAttribute("value", "Calculate");
			input.setAttribute("id", randomID["infix"]);
			input.style.color = "#ffffff";
			input.style.fontSize = "15px";
			input.style.display = "inline";
			input.style.padding = "8px 12px";
			input.style.marginBottom = "6px";
			input.style.borderRadius = "23px";
			input.style.backgroundColor = "#7e12e3";
			td.appendChild(input);
			
			td = document.createElement("td");
			td.style.width = cssDiff.fakeTable_td_width[3];
			tr.appendChild(td);
			
			button = document.createElement("button");
			button.setAttribute("id", randomID["history"]);
			button.style.color = "#0000ff";
			button.style.fontSize = "25px";
			button.style.marginBottom = "6px";
			button.style.borderRadius = "23px";
			button.style.backgroundColor = "#b1bee3";
			td.appendChild(button);
			
			i = document.createElement("i");
			i.className = "fas fa-history";
			button.appendChild(i);
			
			td = document.createElement("td");
			td.style.width = cssDiff.fakeTable_td_width[4];
			tr.appendChild(td);
			
			button = document.createElement("button");
			button.setAttribute("id", randomID["gear"]);
			button.style.color = "#ceffce";
			button.style.fontSize = "25px";
			button.style.marginBottom = "6px";
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
			textarea.style.height = "24px";
			textarea.style.color = "#ffffff";
			textarea.style.caretColor = "#5efb6e";
			textarea.style.backgroundColor = "#000000";
			textarea.style.marginTop = (cssDiff.textarea_margin_top === undefined)? "" : cssDiff.textarea_margin_top;
			document.querySelector(`#${randomID["PGcalculator_container"]}`).appendChild(textarea);
			
			let p = document.createElement("p");
			p.setAttribute("id", randomID["historyBar"]);
			p.style.margin = "0";
			p.style.textAlign = "left";
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
			div.style.overflowY = "auto";
			div.style.overflowX = "hidden";
			div.style.wordBreak = "break-all";
			document.querySelector(`#${randomID["PGcalculator_container"]}`).appendChild(div);
			document.querySelector(`#${randomID["block_bottom"]}`).style.height = ((set.viewBox.offsetHeight) - 170).toString() + "px";
			
			table = document.createElement("table");
			table.id = randomID["historyShow"];
			table.style.width = "100%";
			table.style.textAlign = "left";
			div.appendChild(table);
			
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
						cssDiff.fakeTable_td_width = ["65%", "6%", "15%", "7%", "7%"];
						cssDiff.trash2_position = cssDiff.trash2_top = cssDiff.trash2_right = cssDiff.textarea_margin_top = cssDiff.fakeTable_top = "";
					}
					else
					{
						cssDiff.trash2_right = "0";
						cssDiff.trash2_top = "-37px";
						cssDiff.trash2_position = "absolute";
						cssDiff.enterValue_width = "90%";
						cssDiff.textarea_margin_top = "40px";
						cssDiff.fakeTable_td_width = ["0", "0", "84%", "8%", "8%"];
						cssDiff.fakeTable_top = `${71 + set.viewBox.getBoundingClientRect().top}px`;
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
					
					document.querySelector(`#${randomID["block_bottom"]}`).style.height = (set.viewBox.offsetHeight - 170).toString() + "px";
					document.querySelector(`#${randomID["fakeTable"]}`).style.width = ((set.viewBox.offsetWidth >= 600)? "600" : set.viewBox.offsetWidth.toString()) + "px";
				}
			});
		}
		
		createEnterValue(width)
		{	//"bufferBlock" : id(),
			let block = undefined;
			
			let input = document.createElement("input");
			input.setAttribute("name", "massage");
			input.setAttribute("id", this.#randomID["enterValue"]);
			input.setAttribute("placeholder", "Please enter your postfix notation.");
			input.style.height = "24px";
			input.style.padding = "4px 0 4px 9px";
			input.style.border = "2px black soild";
			input.style.cursor = "pointer";
			input.style.margin = "0.05em 0 0.5em";
			input.style.borderRadius = "5px 20px 20px 5px";
			input.style.width = width;
			
			if(width === "93%")
			{
				block = document.createElement("table");
				block.style.width = "100%";
				block.style.backgroundColor ="#ffffff";
				block.setAttribute("id", this.#randomID["bufferBlock"]);
				
				let tr = document.createElement("tr"), td = document.createElement("td");
				td.style.width = "70%";
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