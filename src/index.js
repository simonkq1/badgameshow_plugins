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
var intervalId = undefined;
var interval = 3000;
var autoTower = false;
var autoBoss = false;
var currentMode = undefined;
var floorLimit = 100;
var bossFailed = 0;
/** @type {MainPage} */
var main = undefined;
var excludeList = [22, 74, 75];

(function () {
    'use strict';
    const page = getPageName()
    checkConfig()
    console.log("Auto Tower: " + autoTower)
    console.log("Auto Boss: " + autoBoss)
    console.log("Current Mode: " + currentMode)
    console.log("Floor Limit: " + floorLimit)
    console.log("Interval: " + interval)
    console.log("ExcludeList: " + JSON.stringify(excludeList))
    if (autoTower === undefined || autoTower === null) {
        autoTower = false
    }
    switch (page) {
        case Pages.MainPage:
            main = new MainPage()
            modeSelectorListener()
            addAutoBossCheckbox()
            addAutoTowerCheckbox()
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
    return document.URL.match(/http[s]?:\/\/badgameshow.com\/(.*).cgi/i)[1];
}
function checkConfig() {
    autoBoss = GM_getValue('auto_boss')
    autoTower = GM_getValue('auto_tower')
    currentMode = GM_getValue('current_mode')
    floorLimit = GM_getValue('floor_limit')
    interval = GM_getValue('interval')
    excludeList = GM_getValue('exclude_list')
    if (autoBoss == undefined) {
        autoBoss = false
        GM_setValue('auto_boss', autoBoss)
    }
    if (autoTower == undefined) {
        autoTower = false
        GM_setValue('auto_tower', autoTower)
    }
    if (currentMode == undefined) {
        currentMode = ""
        GM_setValue('current_mode', currentMode)
    }
    if (floorLimit == undefined) {
        floorLimit = 80
        GM_setValue('floor_limit', floorLimit)
    }
    if (interval == undefined) {
        interval = 3000
        GM_setValue('interval', interval)
    }
    if (excludeList == undefined) {
        excludeList = []
        GM_setValue('exclude_list', JSON.stringify(excludeList))
    }else {
        excludeList = JSON.parse(excludeList)
    }
}

function addAutoBossCheckbox() {
    const container = document.createElement('span')
    const autoBossBox = document.createElement('input')
    autoBossBox.id = 'autoboss'
    autoBossBox.name = 'autoboss'
    autoBossBox.type = 'checkbox'
    autoBossBox.checked = autoBoss
    autoBossBox.onchange = autoBossCheckboxAction
    const autoBossLabel = document.createElement('label')
    autoBossLabel.setAttribute("for", "autoboss")
    autoBossLabel.innerText = "AutoBoss"
    container.appendChild(autoBossBox)
    container.appendChild(autoBossLabel)
    const autoAttackBox = document.getElementById('autoattack')
    autoAttackBox.parentNode.insertBefore(container, autoAttackBox)
}

function addAutoTowerCheckbox() {
    const container = document.createElement('span')
    const autoTowerBox = document.createElement('input')
    autoTowerBox.id = 'autotower'
    autoTowerBox.name = 'autotower'
    autoTowerBox.type = 'checkbox'
    autoTowerBox.checked = autoTower
    autoTowerBox.onchange = autoTowerCheckboxAction
    const autoTowerLabel = document.createElement('label')
    autoTowerLabel.setAttribute("for", "autotower")
    autoTowerLabel.innerText = "AutoTower"
    container.appendChild(autoTowerBox)
    container.appendChild(autoTowerLabel)
    const autoAttackBox = document.getElementById('autoattack')
    autoAttackBox.parentNode.insertBefore(container, autoAttackBox)
}

function autoBossCheckboxAction(event) {
    GM_setValue('auto_boss', event.originalTarget.checked)
    if (event.originalTarget.checked) {
        autoBoss = true
    } else {
        autoBoss = false
    }
}

function autoTowerCheckboxAction(event) {
    GM_setValue('auto_tower', event.originalTarget.checked)
    if (event.originalTarget.checked) {
        autoTower = true
    } else {
        autoTower = false
    }
}

function startTracker() {
    stopTracker()
    intervalId = setInterval(() => {
        if (main.inBossRoom() && autoBoss) {
            console.log("In Boss Room")
            const bossButton = main.findBossButton()
            if (bossButton !== null && bossButton !== undefined) {
                bossButton.click()
                return
            }
        }
        else if (main.isMainPage()) {
            if (autoTower || autoBoss) {
                towerTracker()
                continueCurrentMode()
                main.openAutoAttack()
            }
            if (autoBoss) {
                autoBossBattle()
            }
            if (autoTower) {
                autoTowerBattle()
            }
        }
        else if (main.isBattlePage() && (autoBoss || autoTower)) {
            backtown()
        }

        else if (main.isWarningPage()) {
            backtown()
        }
    }, interval);
}

function stopTracker() {
    if (intervalId !== undefined) {
        clearInterval(intervalId)
        intervalId = undefined
    }
}
function towerTracker() {
    const current = main.currentFloor()
    const highest = main.highestFloor()
    const modeSelector = main.getModeSelector()
    if (current !== undefined && highest !== undefined && current !== highest) {
        if (modeSelector !== undefined && (modeSelector.value == "31" || modeSelector.value == "40" || modeSelector.value == "51")) {
            currentMode = modeSelector.value
            GM_setValue('current_mode', currentMode)
        }
        main.changeFloor(highest)
    }
}
function autoTowerBattle() {
    const modeSelector = main.getModeSelector()
    const highest = main.highestFloor()
    if (modeSelector !== undefined && highest !== undefined) {
        if (modeSelector[0].value == "1") {
            if (highest <= floorLimit) {
                modeSelector.value = "43"
            } else {
                modeSelector.value = "31"
            }
        }
    }
}
function autoBossBattle() {
    const modeSelector = main.getModeSelector()
    const highest = main.highestFloor()
    if (checkExcludeFloor(highest)) {
        return
    }
    if (modeSelector.length > 0 && modeSelector[modeSelector.length - 1].value === "check") {
        modeSelector.value = modeSelector[modeSelector.length - 1].value
        main.clickBattleButton()
    }
}
function continueCurrentMode() {
    const modeSelector = main.getModeSelector()
    if (autoBoss && !autoTower && modeSelector[0].value == "1" && currentMode !== undefined && modeSelector.value !== currentMode && (currentMode == "31" || currentMode == "40" || currentMode == "51")) {
        modeSelector.value = currentMode
    }
}
function modeSelectorListener() {
    const modeSelector = main.getModeSelector()
    if (modeSelector !== undefined) {
        modeSelector.addEventListener('change', function(event) {
            currentMode = modeSelector.value
            GM_setValue('current_mode', currentMode)
        })
    }
}

function checkExcludeFloor(current) {
    return excludeList.includes(current)
}