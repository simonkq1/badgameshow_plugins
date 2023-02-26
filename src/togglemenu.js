// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://badgameshow.com/top.cgi
// @icon         https://www.google.com/s2/favicons?sz=64&domain=badgameshow.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    addStyle(`
    .float_menu_bar{width:300px;height: 55px;border:1px solid rgb(#000);display:block;background:#9edbff72;z-index:9999;position:fixed;bottom:15px;right:15px}
    .round_border {border-radius: 5px;}
    .white-text {color: #fff;}
    .float_layer{width:300px;border:1px solid #aaa;display:block;background:#fff;z-index:9999;position:fixed;bottom:15px;right:15px}
    .float_layer .content {min-height: 50px; overflow: hidden; font-size: 14px; line-height: 18px; color: #666; text-indent: 28px; }
    `)
    // Your code here...
    addFloatLayer()
    
})();

function myFunction() {
    var x = document.getElementById("float_layer");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function addStyle(styleText){
    let s = document.createElement('style')
    s.appendChild(document.createTextNode(styleText))
    document.getElementsByTagName('head')[0].appendChild(s)
}

function addFloatLayer() {
    let d = document.createElement('div')
    d.className = "float_menu_bar"
    d.id = "float_menu_bar"
    d.innerHTML = `
    <div>
        Menu
    </div>
    `
    document.getElementsByTagName('body')[0].appendChild(d)
}