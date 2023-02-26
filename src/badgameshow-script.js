// ==UserScript==
// @name         Auto Boss - badgameshow.com
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://badgameshow.com/top.cgi
// @icon         https://www.google.com/s2/favicons?sz=64&domain=badgameshow.com
// @grant        none
// ==/UserScript==
import $ from "jquery";
import MainPage from "./MainPage";
import Pages from "./Pages";

var rnd = "";
var interval = undefined;
var autoTower = false;
var floorLimit = 80;
var bossFailed = 0;

let main = new MainPage()

(function () {
    'use strict';
    const page = main.getPageName()
    switch (page) {
        case Pages.MainPage:
            addAutoBossCheckbox()
            startTracker()
            break;
        case Pages.BattlePage:
            break;
        case Pages.MiddlePage:
            break;
        default:
            return;
    }

})();

function getPageName() {
    return document.URL.match(/https:\/\/badgameshow.com\/(.*).cgi/i)[1];
}

function addAutoBossCheckbox() {
    const container = document.createElement('span')
    const autoBossBox = document.createElement('input')
    autoBossBox.id = 'autoboss'
    autoBossBox.name = 'autoboss'
    autoBossBox.type = 'checkbox'
    autoBossBox.onchange = autoBossCheckboxAction
    const autoBossLabel = document.createElement('label')
    autoBossLabel.setAttribute("for", "autoboss")
    autoBossLabel.innerText = "AutoBoss"
    container.appendChild(autoBossBox)
    container.appendChild(autoBossLabel)
    const autoAttackBox = document.getElementById('autoattack')
    autoAttackBox.parentNode.insertBefore(container, autoAttackBox)
}

function autoBossCheckboxAction(event) {
    if (event.originalTarget.checked) {
        autoTower = true
    } else {
        autoTower = false
    }
}

function startTracker() {
    stopTracker()
    interval = setInterval(() => {
        const newRnd = main.getRnd()
        if (rnd == newRnd) { ; return }
        rnd = newRnd
        console.log('new: ', rnd)
        const main = document.getElementById('mainTable')
        if (main != null || main != undefined) {
            console.log("In Main Page")
            if (autoTower) {
                console.log("Auto Tower Open")
                towerTracker()
                openAutoAttack()
            }
        }else {

            console.log("Not Main Page")
        }
    }, 5000);
}

function stopTracker() {
    if (interval !== undefined) {
        clearInterval(interval)
        interval = undefined
    }
}

function towerTracker() {
    const current = main.currentFloor()
    const highest = main.highestFloor()
    if (current !== undefined && highest !== undefined) {
        if (highest > floorLimit) {
            return
        }
        if (current !== highest) {
            main.changeFloor(highest)
        }
    }
    if (highest <= floorLimit) {
        const modeSelector = main.getModeSelector()
        if (modeSelector !== undefined) {
            if (modeSelector[0].value == 1) {
                modeSelector.value = "43"
            }
            if (modeSelector.length > 0 && modeSelector[modeSelector.length - 1].value !== "toubatsu") {
                modeSelector.value = modeSelector[modeSelector.length - 1].value
                main.clickBattleButton()
            }
        }
    }
}

function autoBoss() {

}


