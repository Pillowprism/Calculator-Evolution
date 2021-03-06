(function(){
  siSymbol = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
  tabNow = 0;
  shopItems = [
    // Base_Increaser.exe
    [
      {
        "itemName": "Base_Increaser.exe",
        "itemCost": '0.03',
        "itemDesc": "Increase your base to store more number",
      },
      {
        "itemName": "Base_Increaser_2.0.exe",
        "itemCost": '1.004e33',
        "itemDesc": "Can increase base with only 12 digits",
      },
      {
        "itemName": "Base_Increaser_3.0.exe",
        "itemCost": '1.1111e45',
        "itemDesc": "Extend base cap based on Digits",
      },
      {
        "itemName": "Base_Increaser_4.0.exe",
        "itemCost": '8.421e100',
        "itemDesc": "Increase base won't reset memory",
      },
      {
        "itemName": "Base_Increaser_5.0.exe",
        "itemCost": '7.7777e200',
        "itemDesc": "Increase base won't reset anything",
      },
    ],
    // Miner.exe
    [
      {
        "itemName": "Miner_2.0.exe",
        "itemCost": '1e6',
        "itemDesc": "Multiply mine power by Digits",
      },
      {
        "itemName": "Miner_3.0.exe",
        "itemCost": '2.4680e55',
        "itemDesc": "Multiply mine power by Research Point",
      },
      {
        "itemName": "Miner_4.0.exe",
        "itemCost": '2.2222e179',
        "itemDesc": "Multiply mine power by Overclock Power",
      }
    ],
    // Data_Holder.exe
    [
      {
        "itemName": "Data_Holder.exe",
        "itemCost": '2e15',
        "itemDesc": "Keep your Base and Programs on reboot",
      },
      {
        // dino ref.!
        "itemName": "Data_Holder_2.0.exe",
        "itemCost": '1.997e80',
        "itemDesc": "Keep your Digit and Number on reboot",
      },
      {
        "itemName": "Data_Holder_3.0.exe",
        "itemCost": '0.911e90',
        "itemDesc": "Keep your Money and Upgrade on reboot",
      },
    ],
    // Auto_Upgrader.exe
    [
      {
        "itemName": "Auto_Upgrader.exe",
        "itemCost": '3.21e30',
        "itemDesc": "Buy CPU upgrade automatically",
      }
    ],
    // Memory.exe
    [
      {
        "itemName": "Memory_2.0.exe",
        "itemCost": '4.4444e70',
        "itemDesc": "Increase digit won't reset anything",
      },
    ]
  ];
})();

function renderBasic() {
  $("#basedNumber").innerHTML = formatWithBase(game.number, game.base, game.digits, 1);
  $("#money").innerHTML = dNotation(game.money, 5);
  tempRes = '';
  if (game.t2toggle) tempRes += ` | ${dNotation(game.researchPoint, 4, 0)} RP\n`;
  if (game.t3toggle) tempRes += ` | ${dNotation(game.qubit, 4, 0)} Qubit , ${dNotation(game.quantumLab, 4, 0)} Lab\n`;
  $("#otherRes").innerHTML = tempRes;
  $("#memoryDigit").innerHTML = ("").padStart(dNum(game.mDigits)-dNum(game.digits), 0);
  $("#numberBase").innerHTML = game.base;

  //tabs
  $('#mainNav > .tabNav:nth-child(6)').style.display = (game.t3toggle ? 'inline-block' : 'none');

  commandFloat();
}
function renderProgram() {
  var programPoint = [-1, 1, 4, 0, 2, 3, -1];
  var defNames = ["", "Miner.exe", "Memory.exe", "Increment.exe", "Data_Holder.exe", "Auto_Upgrader.exe", ""];
  for (var i = 0; i < 7; i++) {
    $(".program:nth-of-type(" + (i+1) + ")").className = ((game.programActive[i]) ? "program active" : "program") + (i==6 ? " permanent": "");
    if (programPoint[i] != -1) {
      if (game.shopBought[programPoint[i]]-1 == -1) {
        $(".program:nth-of-type(" + (i+1) + ") > span:nth-child(2)").innerHTML = defNames[i];
        continue;
      }
      $(".program:nth-of-type(" + (i+1) + ") > span:nth-child(2)").innerHTML = shopItems[programPoint[i]][game.shopBought[programPoint[i]]-1].itemName;
    }
  }
  $(".program:nth-of-type(4)").style.display = ((game.shopBought[0]) ? "block" : "none");
  $(".program:nth-of-type(5)").style.display = ((game.shopBought[2]) ? "block" : "none");
  $(".program:nth-of-type(6)").style.display = ((game.shopBought[3]) ? "block" : "none");
  $(".program:nth-of-type(7)").style.display = ((game.researchLevel[0]>=1) ? "block" : "none");
}
function renderShop() {
  for (var i = 0; i < 5; i++) {
    var infoObj = shopItems[i][Math.min(game.shopBought[i], shopItems[i].length-1)];
    if (typeof infoObj == "undefined") continue;
    $(".shopItem:nth-of-type(" + (i+1) + ") > .itemName").innerHTML = infoObj.itemName;
    $(".shopItem:nth-of-type(" + (i+1) + ") > .itemCost > .itemCostNum").innerHTML = dNotation(infoObj.itemCost, 4) + '$';
    $(".shopItem:nth-of-type(" + (i+1) + ") > .itemDesc").innerHTML = infoObj.itemDesc;
    $(".shopItem:nth-of-type(" + (i+1) + ")").className = ((calcShopMax()[i] == game.shopBought[i]) ? "shopItem bought" : "shopItem");
  }
  for (var i = 0; i < 5; i++) {
    $(".shopBox:nth-of-type(2) > .shopItem:nth-of-type(" + (i+1) + ") > .itemCost > .itemCostNum").innerHTML = dNotation(calcShopCost()[i+5], 5);
  }
  $("#cpuHz").innerHTML = notationSI(calcCPU(), 0);
  $("#cpuSpeed").innerHTML = dNotation(calcCpuUpgradeEffect(), 4, 1);
}
function renderOption() {
  for (var i = 0; i < 1; i++) {
    $('#optionToggle' + i).className = 'optionBtn' + ((game.optionToggle[i]) ? '' : ' disabled');
  }
}
function renderBasicInfo() {
  $('#basicInfo').innerHTML = `Number: ${dNotation(game.number, 2, 0)} / ${dNotation(game.base.pow(game.digits), 2, 0)}<br>Digit: ${dNotation(game.digits, 2, 0)} / ${dNotation(calcMaxDigit(), 2, 0)}`;
}

function goTab(num) {
  if (!rebooting || game.t3toggle) {
    for (var i = 0; i < document.getElementsByClassName('tab').length; i++) {
      $(".tab:nth-of-type(" + (i+1) + ")").style.display = "none";
    }
    $(".tab:nth-of-type(" + (num+1) + ")").style.display = "block";
    tabNow = num;
    renderAll();
  }
}
function optionBtn(num) {
  game.optionToggle[num] = !game.optionToggle[num];
}
function calcToggleTabs() {
  if (calcRPGain().gte(1)) game.t2toggle = 1;
  if (game.money.gte(1e80)) game.t3toggle = 1;
}
function activeProgram(num) {
  if (rebooting) return;
  if (num == 3 && !game.shopBought[0]) return;
  if (num == 4 && !game.shopBought[2]) return;
  if (num == 5 && !game.shopBought[3]) return;
  if (num == 6 && (game.programActive[6] || game.researchLevel[0]<1)) return;
  var programCount = 0;
  if (game.programActive[num]) {
    programCount--;
  } else {
    programCount++;
  }
  for (var i = 0; i < game.programActive.length; i++) {
    if (game.programActive[i]) {
      programCount++;
    }
  }
  if (programCount >= game.researchLevel[1]+2) {
    for (var i = 5; i > -1; i--) {
      if (game.programActive[i] && i != num) {
        game.programActive[i] = 0;
        programCount--;
      }
      if (programCount < game.researchLevel[1]+2) break;
    }
  }
  game.programActive[num] = !game.programActive[num];
  if (num == 6) {
    commandAppend('start overclock.exe', 140);
  } else if (game.programActive[num]) {
    commandAppend('start ' + $('.program:nth-of-type(' + (num+1) + ') > span:nth-child(2)').innerHTML);
  } else {
    commandAppend('kill ' + $('.program:nth-of-type(' + (num+1) + ') > span:nth-child(2)').innerHTML, -110);
  }
  renderProgram();
}
function shopBuy(num) {
  if (game.money.gte(calcShopCost()[num]) && game.shopBought[num] < calcShopMax()[num]) {
    game.money = game.money.sub(calcShopCost()[num]);
    game.shopBought[num]++;
    switch (num) {
      case 0: case 1: case 2: case 3: case 4:
      commandAppend(`buy ${shopItems[num][Math.min(game.shopBought[num], calcShopMax()[num]-1)].itemName}`);
        break;
      case 5:
      commandAppend('upgrade CPU', -60);
        break;
    }
  }
  renderShop();
}

function calcCpuUpgradeEffect() {
  var eff = D(2);
  if (game.quantumUpgradeBought.includes('11')) eff = eff.mul(1.1);
  return eff;
}
function calcCPU() {
  var tempVar = D(1);
  tempVar = tempVar.mul(calcCpuUpgradeEffect().pow(
    game.shopBought[5]+
    game.researchLevel[0]*(game.quantumUpgradeBought.includes('13')?2:1)
  )).mul(getOverclockPower());
  tempVar = tempVar.mul(calcQubitEffect());
  if (game.quantumUpgradeBought.includes('14')) tempVar = tempVar.mul(D(9).pow(game.quantumLab));
  return tempVar;
}
function calcShopCost() {
  const tempArr = new Array(15).fill(D(Infinity));
  for (var i = 0; i < 5; i++) {
    var tempObj = shopItems[i][Math.min(game.shopBought[i], calcShopMax()[i]-1)];
    if (typeof tempObj != "undefined") {
      tempArr[i] = D(tempObj.itemCost);
    }
  }
  tempArr[5] = D(3+game.shopBought[5]/9).pow(game.shopBought[5]).div(5);
  tempArr[6] = D(1e32).mul( D(10).pow(game.shopBought[6]).pow(Math.max(1, game.shopBought[6]/10+1-0.5)) );
  return tempArr;
}
function calcShopMax() {
  const tempArr = new Array(15).fill(Infinity);
  for (var i = 0; i < 5; i++) {
    tempArr[i] = shopItems[i].length;
  }
  tempArr[5] = 1e15;
  return tempArr;
}
function calcMaxDigit() {
  var tempNum = D(6);
  tempNum = tempNum.plus(game.researchLevel[2]);
  if (game.quantumUpgradeBought.includes('12')) tempNum = tempNum.plus(game.base.pow(0.6).floor());
  return tempNum;
}
function calcMaxBase() {
  var tempNum = D(36);
  if (game.shopBought[0] >= 3) tempNum = tempNum.add(game.digits);
  return tempNum;
}
function getBaseIncreaseReq() {
  return game.base.pow(
    (
      game.shopBought[0] >= 2 ?
      D.min(12, game.mDigits) :
      game.mDigits
    )
  ).sub(1);
}
function calcProgram() {
  if (rebooting) {
    return;
  }
  if (game.programActive[0]) {
    game.number = D.min(game.number.plus(calcCPU().mul(tGain)), game.base.pow(game.digits).sub(1));
    game.rebootNum = D.max(game.number, game.rebootNum);
    rainbowEffect("#basedNumber");
  } else {
    delRainbowEffect("#basedNumber");
  }
  if (game.programActive[1]) {
    moneyGain = D.max(0, calcCPU().mul(tGain/3e4).mul(game.number));
    if (game.shopBought[1] >= 1) moneyGain = moneyGain.mul(game.digits);
    if (game.shopBought[1] >= 2) moneyGain = moneyGain.mul(game.researchPoint);
    if (game.shopBought[1] >= 3) moneyGain = moneyGain.mul(getOverclockPower());
    if (game.quantumUpgradeBought.includes('15')) moneyGain = moneyGain.mul(D(2.4).pow(game.qubit));
    game.money = game.money.plus(moneyGain);
    rainbowEffect("#money");
  } else {
    delRainbowEffect("#money");
  }
  if (game.programActive[2]) {
    if (game.number.gte(game.base.pow(game.digits).sub(1)) && game.digits.lt(game.mDigits)) {
      if (game.shopBought[4] < 1) game.number = game.number.sub(game.base.pow(game.digits).sub(1));
      game.digits = game.digits.plus(1);
    }
  }
  if (game.programActive[3]) {
    if (
      (game.digits.gte(
        (
          game.shopBought[0] >= 2 ?
          D.min(13, game.mDigits) :
          D(1e308)
        )
      ) ||
      game.number.gte(getBaseIncreaseReq())) &&
      game.base.lt(calcMaxBase())
    ) {
      if (game.shopBought[0] < 5) game.number = D(0);
      if (game.shopBought[0] < 4) game.digits = D(1);
      game.base = game.base.plus(1);
    }
  }
  if (game.programActive[5]) {
    shopBuy(5);
  }
  if (game.programActive[6]) {
    game.durability = game.durability.sub(getOverclockPower().add(1).log(2).div(D.pow(1.1, game.researchLevel[4])).div(1000).mul(tGain));

    // minus bug fix
    if (game.durability.lte(0.01)) game.durability = D(0);

    // hardcap fix
    if (game.durability.eq(0) && calcRPGain().lt(1)) {
      commandAppend('< Fatal Error Found...', -120, 1);
      commandAppend('shutdown system', 0);
      goTab(2);
      for (var i = 0; i < game.programActive.length; i++) {
        game.programActive[i] = 0;
      }
      game.shopBought[5] = 0;
      game.money = D(0);
      game.rebootNum = D(0);
      game.durability = D(1);
      game.base = D(2);
      game.digits = D(1);
      game.number = D(0);
    }
  }
}
