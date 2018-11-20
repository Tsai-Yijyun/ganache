"use strict";

let contractAddress = $("#contractAddress");
let deployedContractAddressInput = $("#deployedContractAddressInput");
let loadDeployedContractButton = $("#loadDeployedContractButton");
let deployNewContractButton = $("#deployNewContractButton");

let killContractButton = $("#killContractButton");

let whoami = $("#whoami");
let whoamiButton = $("#whoamiButton");
let copyButton = $("#copyButton");

let update = $("#update");

let logger = $("#logger");

let deposit = $("#deposit");
let depositButton = $("#depositButton");

let withdraw = $("#withdraw");
let withdrawButton = $("#withdrawButton");

let transferEtherTo = $("#transferEtherTo");
let transferEtherValue = $("#transferEtherValue");
let transferEtherButton = $("#transferEtherButton");

let bankAddress = "";
let nowAccount = "";

// let web3 = new Web3('http://localhost:8545');
let web3 = new Web3(
    new Web3.providers.WebsocketProvider("ws://localhost:8545")
);

let bank = new web3.eth.Contract(bankAbi);

// 註釋：log解析，循環判斷輸入的input是否是object，如果是，則進行字串解析，而後將input與logger的返回內容，合併後，返回合併的內容。
function log(...inputs) {
    for (let input of inputs) {
        if (typeof input === "object") {
            input = JSON.stringify(input, null, 2);
        }
        logger.html(input + "\n" + logger.html());
    }
}

init();

// 註釋：init，獲取accounts帳單，而後循環將accounts的元素加入whoami，而後以單機觸發update功能，返回log解析後的內容。
async function init() {
    let accounts = await web3.eth.getAccounts();

    for (let account of accounts) {
        whoami.append(`<option value="${account}">${account}</option>`);
    }
    nowAccount = whoami.val();

    update.trigger("click");

    log(accounts, "以太帳戶");
}

// 註釋：當按下載入既有合約位址時，點擊loadDeployedContractButton後，將deployedContractAddressInput作為輸入值，觸發loadBank載入bank合約。
loadDeployedContractButton.on("click", function () {
    loadBank(deployedContractAddressInput.val());
});

// 註釋：當按下部署合約時，點擊deployNewContractButton後，觸發newBank新增bank合約功能。
deployNewContractButton.on("click", function () {
    newBank();
});

// 註釋：當按下登入按鍵時，點擊whoamiButton後，獲取當前的帳單狀況，並觸發update更新功能。
whoamiButton.on("click", function () {
    nowAccount = whoami.val();

    update.trigger("click");
});

// 註釋：當按下複製按鍵時，點擊copyButton後，獲取textarea的資料，將資料完成複製。複製結果會回傳。
copyButton.on("click", function () {
    let textarea = $("<textarea />");
    textarea
        .val(whoami.val())
        .css({
            width: "0px",
            height: "0px",
            border: "none",
            visibility: "none"
        })
        .prependTo("body");

    textarea.focus().select();

    try {
        if (document.execCommand("copy")) {
            textarea.remove();
            return true;
        }
    } catch (e) {
        console.log(e);
    }
    textarea.remove();
    return false;
});

// 註釋：當按下更新按鍵時，
// 點擊update後，判斷bankAddress是否為空，為非空則，將輸入資料（address，ethBalance，bankBalance）進行更新，並將結果呈現；為空，則創建一個新的web3.eth.getBalance，再將結果呈現。
update.on("click", async function () {
    if (bankAddress != "") {
        let ethBalance = await web3.eth.getBalance(nowAccount);
        let bankBalance = await bank.methods
            .getBankBalance()
            .call({ from: nowAccount });

        log({
            address: bankAddress,
            ethBalance: ethBalance,
            bankBalance: bankBalance
        });
        log("更新帳戶資料");

        $("#ethBalance").text("以太帳戶餘額 (wei): " + ethBalance);
        $("#bankBalance").text("銀行ETH餘額 (wei): " + bankBalance);
    } else {
        let ethBalance = await web3.eth.getBalance(nowAccount);

        $("#ethBalance").text("以太帳戶餘額 (wei): " + ethBalance);
        $("#bankBalance").text("銀行ETH餘額 (wei): ");
    }
});

// 註釋：當按下刪除合約按鈕時，
// 點擊killContractButton後，如果bankAddress為空，則跳出。為非空，則進行解鎖，若不能解鎖，則跳出。解鎖後，更新介面，將合約進行刪除動作。將bankAddress、contractAddress、deployedContractAddressInput置空，而後更新介面。
killContractButton.on("click", async function () {
    if (bankAddress == "") {
        return;
    }

    // 解鎖
    let unlock = await unlockAccount();
    if (!unlock) {
        return;
    }

    // 更新介面
    waitTransactionStatus();
    // 刪除合約
    bank.methods
        .kill()
        .send({
            from: nowAccount,
            gas: 3400000
        })
        .on("receipt", function (receipt) {
            log(bankAddress, "成功刪除合約");

            bankAddress = "";
            contractAddress.text("合約位址:" + bankAddress);
            deployedContractAddressInput.val(bankAddress);

            // 觸發更新帳戶資料
            update.trigger("click");

            // 更新介面
            doneTransactionStatus();
        })
        .on("error", function (error) {
            log(error.toString());
            // 更新介面
            doneTransactionStatus();
        });
});

//code start

let certificateDeposit = $('#certificateDeposit');
let certificateDepositBtn = $('#certificateDepositBtn');
let cdPeriod = $('#certificateDepositPeriod');
let cdWithdrawEarlyBtn = $('#cdWithdrawEarlyBtn')
let cdWithdrawBtn = $('#cdWithdrawBtn')
let cdWithdrawPeriod = $('#cdWithdrawPeriod')

// 註釋：點擊certificateDepositBtn後，如果bankAddress為空，則跳出。為非空，則進行解鎖，若不能解鎖，則跳出。解鎖後，更新介面，將certificateDeposit資料進行定存修改，成功，則返回“定存成功”，失敗，則報錯“error”。
certificateDepositBtn.on("click", async function () {
    if (bankAddress == "") {
        return;
    }


    let unlock = await unlockAccount();
    if (!unlock) {
        return;
    }

    waitTransactionStatus();

    bank.methods
        .certificateDeposit(parseInt(cdPeriod.val()))
        .send({
            from: nowAccount,
            gas: 3400000,
            value: web3.utils.toWei(certificateDeposit.val(), "ether"),
            times: 0
        })
        .on("receipt", function (receipt) {
            log(receipt.events.cdEvent.returnValues, "定存成功");


            update.trigger("click");


            doneTransactionStatus();
        })
        .on("error", function (error) {
            log(error.toString());

            doneTransactionStatus();
        });

    bank.events.cdEvent().on("data", function (event) {
        log(event, "cdEvent");
    });
});


// 註釋：cdWithdraw，如果bankAddress為空，則跳出。為非空，則進行解鎖，若不能解鎖，則跳出。解鎖後，跟新介面，將輸入值period（period預設為最大整數）導入，取出定存，成功，則返回“取出定存成功”，失敗，則報錯“error”。
async function cdWithdraw(period = Number.MAX_SAFE_INTEGER) {
    if (bankAddress == "") {
        return;
    }

    let unlock = await unlockAccount();
    if (!unlock) {
        return;
    }
    
    waitTransactionStatus();
    bank.methods
        .cdWithdraw(parseInt(period))
        .send({
            from: nowAccount,
            gas: 3400000
        })
        .on("receipt", function (receipt) {
            log(receipt.events.cdWithdrawEvent.returnValues, "取出定存成功");
            
            update.trigger("click");

            doneTransactionStatus();
        })
        .on("error", function (error) {
            log(error.toString());
            doneTransactionStatus();
        });
}

// 註釋：點擊cdWithdrawBtn，觸法cdWithdraw功能，以預設period執行。
cdWithdrawBtn.on("click", async function () {
    cdWithdraw();
});

// 註釋：點擊cdWithdrawEarlyBtn，觸法cdWithdraw功能，以period=cdWithdrawPeriod執行。
cdWithdrawEarlyBtn.on("click", async function () {
    cdWithdraw(cdWithdrawPeriod.val());
});

//code end

// 註釋：當按下存款按鍵時，
// 點擊depositButton，如果bankAddress為空，則跳出。為非空，則進行解鎖，若不能解鎖，則跳出。解鎖後，更新介面，將deposit資料進行存款修改，成功，則返回“存款成功”，觸發帳戶資料更新，失敗，則報錯“error”。
depositButton.on("click", async function () {
    if (bankAddress == "") {
        return;
    }

    // 解鎖
    let unlock = await unlockAccount();
    if (!unlock) {
        return;
    }

    // 更新介面
    waitTransactionStatus();
    // 存款
    bank.methods
        .deposit()
        .send({
            from: nowAccount,
            gas: 3400000,
            value: web3.utils.toWei(deposit.val(), "ether")
        })
        .on("receipt", function (receipt) {
            log(receipt.events.DepositEvent.returnValues, "存款成功");

            // 觸發更新帳戶資料
            update.trigger("click");

            // 更新介面
            doneTransactionStatus();
        })
        .on("error", function (error) {
            log(error.toString());
            // 更新介面
            doneTransactionStatus();
        });
    bank.events.DepositEvent().on("data", function (event) {
        log(event, "DepositEvent");
    });
});

// 註釋：點擊withdrawButton，如果bankAddress為空，則跳出。為非空，則進行解鎖，若不能解鎖，則跳出。解鎖後，更新介面，將withdraw資料進行提款修改，成功，則返回“提款成功”，觸發帳戶資料更新，失敗，則報錯“error”。
withdrawButton.on("click", async function () {
    if (bankAddress == "") {
        return;
    }

    // 解鎖
    let unlock = await unlockAccount();
    if (!unlock) {
        return;
    }

    // 更新介面
    waitTransactionStatus();
    // 提款
    bank.methods
        .withdraw(parseInt(withdraw.val(), 10))
        .send({
            from: nowAccount,
            gas: 3400000
        })
        .on("receipt", function (receipt) {
            log(receipt.events.WithdrawEvent.returnValues, "提款成功");

            // 觸發更新帳戶資料
            update.trigger("click");

            // 更新介面
            doneTransactionStatus();
        })
        .on("error", function (error) {
            log(error.toString());
            // 更新介面
            doneTransactionStatus();
        });
});


// 註釋：當按下轉帳按鍵時，
// 點擊withdrawButton，如果bankAddress為空，則跳出。為非空，則進行解鎖，若不能解鎖，則跳出。解鎖後，更新介面，將transferEtherValue資料進行提款修改，成功，則返回“提款成功”，觸發帳戶資料更新，失敗，則報錯“error”。
transferEtherButton.on("click", async function () {
    if (bankAddress == "") {
        return;
    }

    // 解鎖
    let unlock = await unlockAccount();
    if (!unlock) {
        return;
    }

    // 更新介面
    waitTransactionStatus();
    // 轉帳
    bank.methods
        .transfer(transferEtherTo.val(), parseInt(transferEtherValue.val(), 10))
        .send({
            from: nowAccount,
            gas: 3400000
        })
        .on("receipt", function (receipt) {
            log(receipt.events.TransferEvent.returnValues, "轉帳成功");

            // 觸發更新帳戶資料
            update.trigger("click");

            // 更新介面
            doneTransactionStatus();
        })
        .on("error", function (error) {
            log(error.toString());
            // 更新介面
            doneTransactionStatus();
        });
});

// 註釋：載入bank合約，
// loadBank，首先判斷輸入值address是否為空，並建立bank，在確定bank非undefined後，載入合約，成功，則回傳“合約位置：”+ address，並觸法更新功能，失敗，則回傳“載入失敗”。
function loadBank(address) {
    if (!(address === undefined || address === null || address === "")) {
        let bank_temp = new web3.eth.Contract(bankAbi);
        bank_temp.options.address = address;

        if (bank_temp != undefined) {
            bankAddress = address;
            bank.options.address = bankAddress;

            contractAddress.text("合約位址:" + address);
            log(bank, "載入合約");

            update.trigger("click");
        } else {
            log(address, "載入失敗");
        }
    }
}

// 註釋： 新增bank合約，
// newBank，如果bankAddress為空，則跳出。為非空，則進行解鎖，若不能解鎖，則跳出。解鎖後，更新介面，將receipt資料進行部署合約，成功，則返回"合約位址:" + receipt.contractAddress，觸發帳戶資料更新。
async function newBank() {
    // 解鎖
    let unlock = await unlockAccount();
    if (!unlock) {
        return;
    }

    // 更新介面
    waitTransactionStatus();

    bank
        .deploy({
            data: bankBytecode
        })
        .send({
            from: nowAccount,
            gas: 3400000
        })
        .on("receipt", function (receipt) {
            log(receipt, "部署合約");

            // 更新合約介面
            bankAddress = receipt.contractAddress;
            bank.options.address = bankAddress;
            contractAddress.text("合約位址:" + receipt.contractAddress);
            deployedContractAddressInput.val(receipt.contractAddress);

            update.trigger("click");

            // 更新介面
            doneTransactionStatus();
        });
}

// 註釋：更新介面waitTransactionStatus，解析返回accountStatus的狀態。
function waitTransactionStatus() {
    $("#accountStatus").html(
        '帳戶狀態 <b style="color: blue">(等待交易驗證中...)</b>'
    );
}

// 註釋：更新介面doneTransactionStatus，改變accountStatus的帳戶狀態。
function doneTransactionStatus() {
    $("#accountStatus").text("帳戶狀態");
}

// 註釋：解鎖unlockAccount，提示使用者”請輸入你的密碼”，待輸入後，判斷輸入是否為空，為空，則跳出。對比使用者輸入的密碼與帳戶的密碼，正確則回傳true，錯誤則提示”密碼錯誤”，並跳出。
async function unlockAccount() {
    let password = prompt("請輸入你的密碼", "");
    if (password == null) {
        return false;
    } else {
        return web3.eth.personal
            .unlockAccount(nowAccount, password, 60)
            .then(function (result) {
                return true;
            })
            .catch(function (err) {
                alert("密碼錯誤");
                return false;
            });
    }
}
