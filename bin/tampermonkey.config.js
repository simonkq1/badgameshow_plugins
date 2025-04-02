const package = require('../package.json')

module.exports = {
    name: "Auto Boss - badgameshow.com",
    namespace: "http://tampermonkey.net/",
    version: package.version,
    description: "badgameshow auto boss plugins!",
    author: "simonkq1",
    match: ["http*://badgameshow.com/top.cgi", "http*://badgameshow.com/etc.cgi"],
    icon: "https://www.google.com/s2/favicons?sz=64&domain=badgameshow.com",
    grant: ["GM_setValue", "GM_getValue"],
    downloadURL: `https://raw.githubusercontent.com/simonkq1/badgameshow_plugins/refs/heads/main/build/${package.name}.user.js`,
    updateURL: `https://raw.githubusercontent.com/simonkq1/badgameshow_plugins/refs/heads/main/build/${package.name}.user.js`
}