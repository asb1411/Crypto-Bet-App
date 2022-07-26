const f = async () => {let c = await Bet.deployed()

c.placeBet(0,{value:1000000000000000000})

c.placeBet(1,{value:1000000000000000000, from:accounts[1]})

c.winningBet(1)

c.withdraw({from:accounts[1]})}.catch((error)=>{assert.isNotOk(error,'Promise error');
  done();
});


f();