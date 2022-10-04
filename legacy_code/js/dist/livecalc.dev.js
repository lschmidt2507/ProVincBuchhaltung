"use strict";

function calc() {
  console.log("recalculating");
  var productRows = document.getElementsByClassName("productCalc");
  var salesComb = 0;
  var profitComb = 0;

  for (var i = 0; i < productRows.length; i++) {
    var prev = parseInt(productRows[i].getElementsByClassName("BestVorher")[0].value);
    var after = parseInt(productRows[i].getElementsByClassName("BestNachher")[0].value);
    var lost = parseInt(productRows[i].getElementsByClassName("Verlust")[0].value);
    var EK = parseFloat(productRows[i].getElementsByClassName("EK")[0].value.replace(",", "."));
    var VK = parseFloat(productRows[i].getElementsByClassName("VK")[0].value.replace(",", "."));
    var sold = productRows[i].getElementsByClassName("soldItems")[0];
    var sales = productRows[i].getElementsByClassName("sales")[0];
    var profit = productRows[i].getElementsByClassName("profit")[0];
    var input = parseInt(productRows[i].getElementsByClassName("productInputRaw")[0].value);
    var soldCount = prev - (after - input) - lost;
    sold.innerHTML = soldCount;
    productRows[i].getElementsByClassName("amountSingleInput")[0].value = prev - (after - input) - lost;
    profit.innerHTML = Number(soldCount * (VK - EK) - lost * EK).toFixed(2) + "€";
    sales.innerHTML = Number(soldCount * VK).toFixed(2) + "€";
    productRows[i].getElementsByClassName("profitSingleInput")[0].value = Number(soldCount * (VK - EK) - lost * EK).toFixed(2);

    if (!isNaN(soldCount * (VK - EK) - lost * EK)) {
      profitComb += soldCount * (VK - EK) - lost * EK;
    }

    if (!isNaN(soldCount * VK)) {
      salesComb += soldCount * VK;
    }
  }

  document.getElementsByClassName("overallProfit")[0].innerHTML = Number(salesComb).toFixed(2) + "€";
  document.getElementsByClassName("profitTotal")[0].innerHTML = Number(profitComb).toFixed(2) + "€";
  var coins = parseFloat(document.getElementsByClassName("coinsBegin")[0].value.replace(",", "."));
  var bills = parseFloat(document.getElementsByClassName("billsBegin")[0].value.replace(",", "."));
  var coinsTrans = parseFloat(document.getElementsByClassName("coinsTransfer")[0].value.replace(",", "."));
  var billsTrans = parseFloat(document.getElementsByClassName("billsTransfer")[0].value.replace(",", "."));
  var before = parseFloat(document.getElementsByClassName("lastMoney")[0].innerHTML);
  document.getElementsByClassName("nowMoney")[0].innerHTML = Number(coins + bills).toFixed(2) + "€";
  document.getElementsByClassName("realProfit")[0].innerHTML = Number(coins + bills - before).toFixed(2) + "€";
  document.getElementsByClassName("salesInput")[0].value = Number(coins + bills - before).toFixed(2);
  document.getElementsByClassName("profitInput")[0].value = Number(profitComb).toFixed(2);
  document.getElementsByClassName("diffMoney")[0].innerHTML = Number(coins + bills - before - salesComb).toFixed(2) + "€";
  document.getElementsByClassName("diffInput")[0].value = Number(coins + bills - before - salesComb).toFixed(2);
  document.getElementsByClassName("transComb")[0].innerHTML = Number(coinsTrans + billsTrans).toFixed(2) + "€";
}

var productRows = document.getElementsByClassName("productCalc");

for (var i = 0; i < productRows.length; i++) {
  productRows[i].getElementsByClassName("BestVorher")[0].addEventListener("change", calc);
  productRows[i].getElementsByClassName("BestNachher")[0].addEventListener("change", calc);
  productRows[i].getElementsByClassName("Verlust")[0].addEventListener("change", calc);
  productRows[i].getElementsByClassName("EK")[0].addEventListener("change", calc);
  productRows[i].getElementsByClassName("VK")[0].addEventListener("change", calc);
}

document.getElementsByClassName("coinsBegin")[0].addEventListener("change", calc);
document.getElementsByClassName("billsBegin")[0].addEventListener("change", calc);
document.getElementsByClassName("coinsTransfer")[0].addEventListener("change", calc);
document.getElementsByClassName("billsTransfer")[0].addEventListener("change", calc);
calc();