import $ from "jquery";

export default class MainPage {

  constructor() {

  }

  currentFloor() {
    const element = $('#map7')[0]
    const regex = /目前所在地[\r\n]+艾恩葛朗特：(\d+)[ ]?層/
    const matches = element.innerText.match(regex)
    if (matches && matches.length > 1) {
      return parseInt(matches[1])
    }
  }

  highestFloor() {
    const element = $('#map9')[0]
    const regex = /目前最高樓層[\r\n]+艾恩葛朗特：(\d+)[ ]?層/
    const matches = element.innerText.match(regex)
    if (matches && matches.length > 1) {
      return parseInt(matches[1])
    }
  }

  changeFloor(floor) {
    const elements = $('input[type="text"][name="lname"]')
    const button = this.getStatusBarButton()
    if (elements.length > 0) {
      elements[0].value = floor
      button.click()
    }
  }

  clickBattleButton() {
    const element = $('#battlebutton')[0]
    element.click()
  }

  getStatusBarButton() {
    const elements = $('.MFC[type="submit"][value="實行"]')
    if (elements.length > 1) {
      return elements[1]
    }
  }
  getRnd() {
    const elements = $('input[name="rnd"]')
    if (elements.length > 1) {
      return $('input[name="rnd"]')[1].value
    } else {
      return ""
    }
  }
  getModeSelector() {
    const elements = $('#table1 select[name="mode"]')
    if (elements.length > 0) {
      return elements[0]
    }
  }

  openAutoAttack() {
    const element = $('#autoattack')[0]
    if (!element.checked) {
      element.click()
    }
  }

  getCharacterData() {
    const hp = $('#chara_maxmaxhp').text()
    const mp = $('#chara_maxmaxmp').text()
    const str = $('#chara_max0')[0].innerText //力量
    const vit = $('#chara_max1')[0].innerText //生命力
    const int = $('#chara_max2')[0].innerText //智力
    const spi = $('#chara_max3')[0].innerText //精神
    const mnd = $('#chara_max2')[0].innerText //智力
    const luk = $('#chara_max4')[0].innerText //運氣
    const dex = $('#chara_max5')[0].innerText //精神
  }
  spiltCharacterRowData(data) {
    const match = data.matches("/(\d+)\((\d+)\)/")
    if (match.length >= 2) {
      return { value: parseInt(match[1]), max: parseInt(match[2]) }
    }
  }
  iframeContents() {
    return $('iframe#actionframe').contents()
  }
  inBossRoom() {
    const title = this.iframeContents().find('font:contains("上塔之門已開啟")')
    if (title.length) {
      return true
    }
    return false
  }
  findBossButton() {
    const buttons = this.iframeContents().find('input.FC[value="魔王鑰匙"]')
    if (buttons.length > 0) {
      return buttons[0]
    }
  }
  isMainPage() {
    return $('#mainTable').css('display') !== "none"
  }
  isBattlePage() {
    const elements = this.iframeContents().find('table.TOC')
    console.log(elements)
    return elements.length > 0
  }

  isWarningPage() {
    const elements = this.iframeContents().find('table.TC font b')
    console.log(elements)
    return elements.length > 0 && elements[0].innerText == "警 告123"
  }

  backToMainTown() {
    const button = this.iframeContents().find('table.TC input.FC[value="[F4]回到城鎮"]')
    if (button.length > 0) {
      button[0].click()
    }
  }

  clickReturnButtonInBattlePage() {
    const element = this.iframeContents().find('input.FC[value="[F4]回到城鎮"]')
    console.log(element)
    if (element.length > 0) {
      element[0].click()
    }
  }
}
