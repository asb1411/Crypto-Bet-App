// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Bet{
    mapping(address => mapping(uint => uint)) bets;
    mapping(uint => uint) totalEach;
    address[] add;

    address owner;
    uint winner;
    bool roundDone;
    uint total;
    uint maxTeams=2;

    constructor(){
        owner=msg.sender;
    }

    modifier numberOfTeams(uint t){
        require(t < maxTeams, 'Not a valid bet item');
        _;
    }

    function placeBet(uint t) payable numberOfTeams(t) external{
        require(!roundDone, 'Round is done');
        require(bets[msg.sender][t] == 0, 'Can only bet once not again');

        uint b=msg.value;
        bets[msg.sender][t] =  b;
        add.push(msg.sender);
        total+=b;
        totalEach[t]+=b;
    }

    function myBets() external view returns(uint8){
        for(uint8 i=0;i<maxTeams;i++){
            if(bets[msg.sender][i]!=0) return i;
        }
        return uint8(maxTeams);
    }

    function distribute() external{
        require(roundDone, 'Round is still in progress');
        require(bets[msg.sender][winner] != 0, 'You did\'nt win anything, better luck next time');
        calculate(msg.sender);
        uint give=bets[msg.sender][winner];
	    bets[msg.sender][winner]=0;
        payable(msg.sender).transfer(give);
    }

    function calculate(address a) internal{
        bets[a][winner]=bets[a][winner]*total/totalEach[winner];
    }

    function winningBet(uint g) numberOfTeams(g) external{
        require(msg.sender==owner, 'You are not the owner!');
        roundDone=true;
        winner=g;
    }
}

/*

    function getPrize() internal pure returns(string memory){
        return 'Winner declared go get prize!';
    }
*/
