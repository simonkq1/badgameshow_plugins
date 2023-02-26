// ==UserScript==
// @name         Auto Boss - badgameshow.com
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://badgameshow.com/top.cgi
// @match        https://badgameshow.com/etc.cgi
// @icon         https://www.google.com/s2/favicons?sz=64&domain=badgameshow.com
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==
import $ from "jquery";
import MainPage from "./MainPage";
import Pages from "./Pages";
import etc from "./etc";

var rnd = "";
var interval = undefined;
var autoTower = false;
var floorLimit = 80;
var bossFailed = 0;
/** @type {MainPage} */
var main = undefined;

(function () {
    'use strict';
    const page = getPageName()
    autoTower = GM_getValue('auto_tower')
    console.log(autoTower)
    if (autoTower === undefined || autoTower === null) {
        autoTower = false
    }
    switch (page) {
        case Pages.MainPage:
            main = new MainPage()
            addAutoBossCheckbox()
            startTracker()
            break;
        case Pages.BattlePage:
            break;
        case Pages.MiddlePage:
            etc()
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
    autoBossBox.checked = autoTower
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
    GM_setValue('auto_tower', event.originalTarget.checked)
    if (event.originalTarget.checked) {
        autoTower = true
    } else {
        autoTower = false
    }
}

function startTracker() {
    stopTracker()
    interval = setInterval(() => {
        if (main.inBossRoom() && autoTower) {
            console.log("In Boss Room")
            const bossButton = main.findBossButton()
            if (bossButton !== null && bossButton !== undefined) {
                bossButton.click()
                return
            }
        }
        else if (main.isMainPage()) {
            if (autoTower) {
                main.openAutoAttack()
            }
            const newRnd = main.getRnd()
            if (autoTower && rnd !== newRnd) {
                // rnd = newRnd
                // console.log("rnd: " + rnd)
                towerTracker()
            }
        }
        else if (main.isBattlePage()) {
            backtown()
        }

        else if (main.isWarningPage()) {
            backtown()           
        }
    }, 3000);
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
            if (modeSelector[0].value == "1") {
                modeSelector.value = "43"
            }
            if (modeSelector.length > 0 && modeSelector[modeSelector.length - 1].value === "check") {
                modeSelector.value = modeSelector[modeSelector.length - 1].value
                main.clickBattleButton()
            }
        }
    }
}

function autoBoss() {

}


