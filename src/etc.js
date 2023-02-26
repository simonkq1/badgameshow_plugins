import $ from "jquery";

function etc () {
    const title = $('table.FC font')
    if (title.length > 0 && title[0].innerText == "轉移門") {
        const button = getButton()
        if (button && button !== undefined) {
            button.click()
        }
    }
}

function getButton() {
    const elements = $('table.FC input.FC[type="submit"]')
    if (elements.length > 0) {
        return elements[0]
    }
}
export default etc;