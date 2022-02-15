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