const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:9545'));
var connect, dis, gacc, team, bet, placeBet, betdiv, contract, abi, accounts, selectedacc;

const contract_address = '';
const maxTeams = 2;

// **
//
// While using ganache, PRIVATE_KEY of the account is used
// to sign and send the transaction
// This is harmless as this is a develop account spun up
// by ganache.
// Do not use in production!
//
// **
const acc_pvt_key =
[

]

fetch("Bet.json")
    .then(response => {
        return response.json();
    })
    .then(data => abi = data.abi)

window.addEventListener("DOMContentLoaded", function() {
    connect = document.getElementById("connect");
    dis = document.getElementById("displayerror");
    gacc = document.getElementById("getacc");
    getAccountsResult = document.getElementById("getAccountsResult");
    team = document.getElementById("team");
    bet = document.getElementById("bet");
    placeBet = document.getElementById("placeBet");
    betdiv = document.getElementById("betdiv");
    checkb = document.getElementById("check");
    withdraw = document.getElementById("withdraw");
    selectedacc = document.getElementById("selectedacc");
    winbet = document.getElementById("winbet");
    winningBet = document.getElementById("winningBet");
    starthere();
})

function starthere() {
    gacc.disabled = true;
    betdiv.style.display = 'none';
    connect.onclick = () => {
        try {
            contract1 = new web3.eth.Contract(abi, contract_address);
            if (get_account()) init_all();
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}

async function listacc() {
    getAccountsResult.innerHTML = accounts[selectedacc.value-1] || 'Not able to get accounts';
}

async function get_account() {
    try {
        accounts = await web3.eth.getAccounts();
        gacc.disabled = false;
        gacc.onclick = () => listacc();
        betdiv.style.display = 'block';
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function signAndSendTx() {
    //Get function ABI and encode
    c = contract1.methods.placeBet(parseInt(team.value));
    encodedABI = c.encodeABI();

    // Sign Tx, and then send, wait for confirmation
    web3.eth.accounts.signTransaction({
            to: contract_address,
            value: parseInt(bet.value),
            gas: 2000000,
            data: encodedABI
        }, acc_pvt_key[selectedacc.value-1])
        .then(signed => {
            console.log(signed);
            tran = web3.eth.sendSignedTransaction(signed.rawTransaction);
            tran.on('confirmation', (confirmationNumber, receipt) => {
                console.log('confirmation: ' + confirmationNumber);
            });
        });
}

async function signAndSendTxWinner() {
    //Get function ABI and encode
    c = contract1.methods.winningBet(parseInt(winbet.value));
    encodedABI = c.encodeABI();

    // Sign Tx, and then send, wait for confirmation
    web3.eth.accounts.signTransaction({
            to: contract_address,
            gas: 2000000,
            data: encodedABI
        }, acc_pvt_key[selectedacc.value-1])
        .then(signed => {
            console.log(signed);
            tran = web3.eth.sendSignedTransaction(signed.rawTransaction);
            tran.on('confirmation', (confirmationNumber, receipt) => {
                console.log('confirmation: ' + confirmationNumber);
            });
        });
}

async function signAndSendTxWithdraw() {
    //Get function ABI and encode
    c = contract1.methods.distribute();
    encodedABI = c.encodeABI();

    // Sign Tx, and then send, wait for confirmation
    web3.eth.accounts.signTransaction({
            to: contract_address,
            gas: 2000000,
            data: encodedABI
        }, acc_pvt_key[selectedacc.value-1])
        .then(signed => {
            console.log(signed);
            tran = web3.eth.sendSignedTransaction(signed.rawTransaction);
            tran.on('confirmation', (confirmationNumber, receipt) => {
                console.log('confirmation: ' + confirmationNumber);
            });
        });
}

async function init_all() {
    // Initializing placeBet button
    placeBet.onclick = () => {
        if (team.value == '' || bet.value == '') {
            alert("Neither team nor bet can be empty");
            return false;
        }
        console.log(parseInt(bet.value));
        signAndSendTx();
        team.value = '';
        bet.value = '';
        selectedacc.value = 1;
        return true;
    }

    // Initializing checkBets button
    checkb.onclick = () => {
        contract1.methods.myBets().call({
                'from': accounts[selectedacc.value-1]
            },
            function(err, result) {
                if (parseInt(result) == maxTeams) {
                    alert("You have placed no bets yet");
                    return;
                }
                alert("Your placed bet is on team: " + result);
            }
        );
    }
    // Initializing withdraw button
    withdraw.onclick = () => {
        signAndSendTxWithdraw();
    }
    // Admin account only
    winningBet.onclick = () => {
        console.log(parseInt(winbet.value));
        signAndSendTxWinner();
    }
}