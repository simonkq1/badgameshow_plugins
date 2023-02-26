// ==UserScript==
// @name         Test Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://badgameshow.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=badgameshow.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.3.min.js
// ==/UserScript==

(function () {
  'use strict';
  // Your code here...
  let searchableStr = document.URL
  console.log(searchableStr)
  setTimeout(function() {
    currentFloor()
  }, 3000)
})();

function getPageName() {
  return document.URL.match (/https:\/\/badgameshow.com\/(.*).cgi/i) [1];
}

function currentFloor() {
  const element = document.getElementById('map7')
  console.log(element)
  if (element) {
    const regex = /目前所在地[\r\n]+艾恩葛朗特：(\d+)[ ]?層/
    const matches = element.innerText.match(regex)
    if (matches && matches.length > 1) {
      return parseInt(matches[1])
    }
  }
}

function highestFloor() {
  const element = document.getElementById('map9')
  if (element) {
    const regex = /目前最高樓層[\r\n]+艾恩葛朗特：(\d+)[ ]?層/
    const matches = element.innerText.match(regex)
    if (matches && matches.length > 1) {
      return parseInt(matches[1])
    }
  }
}
