pragma solidity ^0.4.23;

contract Bank {
	// 此合約的擁有者
    address private owner;

	// 儲存所有會員的餘額
    mapping (address => uint256) private balance;

    mapping (address => uint256) private cdBalance;
    mapping (address => uint256) private cdPeriod;

	// 事件們，用於通知前端 web3.js
    event DepositEvent(address indexed from, uint256 value, uint256 timestamp);
    event WithdrawEvent(address indexed from, uint256 value, uint256 timestamp);
    event TransferEvent(address indexed from, address indexed to, uint256 value, uint256 timestamp);

    event cdEvent(address indexed from, uint256 value, uint256 timestamp);
    event cdWithdrawEvent(address indexed from, uint256 value, uint256 timestamp);

    modifier isOwner() {
        require(owner == msg.sender, "you are not owner");
        _;
    }
    
	// 建構子
    constructor() public payable {
        owner = msg.sender;
    }

	// 存錢
	//將balance[msg.sender]的值累加存錢的值msg.value，返回存錢情況、錢數量、時間
    function deposit() public payable {
        balance[msg.sender] += msg.value;

        emit DepositEvent(msg.sender, msg.value, now);
    }
    
    	//code start
    
	//將cdBalance[msg.sender]設為msg.value，cdPeriod[msg.sender]設為period，返回處理情況、錢數量、時間
    function certificateDeposit(uint256 period) public payable {
        cdBalance[msg.sender] = msg.value;
        cdPeriod[msg.sender] = period;
        emit cdEvent(msg.sender, msg.value, now);
    }

	//回傳cdBalance[msg.sender]
    function getCdBalance() public view returns (uint256)  {
        return cdBalance[msg.sender];
    }

	//將uint256 _period 設為cdPeriod[msg.sender] 、 period的較大值，uint256 interest設為cdBalance[msg.sender] * _period / 100， uint256 weiValue設為cdBalance[msg.sender] + interest，balance[msg.sender]進行weiValue累加，cdBalance[msg.sender]、cdPeriod[msg.sender]設為0，返回處理情況、錢數量、時間
    function cdWithdraw(uint256 period) public returns (uint) {
        uint256 _period = period > cdPeriod[msg.sender] ? cdPeriod[msg.sender] : period;
        uint256 interest = cdBalance[msg.sender] * _period / 100;
        uint256 weiValue = cdBalance[msg.sender] + interest;

        balance[msg.sender] += weiValue;

        cdBalance[msg.sender] = 0;
        cdPeriod[msg.sender] = 0;

        emit cdWithdrawEvent(msg.sender, weiValue, now);
    }

    /*
        ##################################
                    CODE END
        ##################################
    */

	// 提錢
	//獲取要提領的錢數。判斷提領錢是否超過存款，未超過，則提示"your balances are not enough”，若超過，則進行msg.sender.transfer，減去帳戶的餘額，提領金錢，成功返回處理情況、錢數量、時間
    function withdraw(uint256 etherValue) public {
        uint256 weiValue = etherValue * 1 ether;

        require(balance[msg.sender] >= weiValue, "your balances are not enough");

        msg.sender.transfer(weiValue);

        balance[msg.sender] -= weiValue;

        emit WithdrawEvent(msg.sender, etherValue, now);
    }

	// 轉帳
	//獲取要提領的錢數。判斷提領錢是否超過存款，未超過，則提示"your balances are not enough"，若超過，則減去該帳戶的餘額，轉帳帳戶金額則增加相應的金額，成功返回處理情況、錢數量、時間
    function transfer(address to, uint256 etherValue) public {
        uint256 weiValue = etherValue * 1 ether;

        require(balance[msg.sender] >= weiValue, "your balances are not enough");

        balance[msg.sender] -= weiValue;
        balance[to] += weiValue;

        emit TransferEvent(msg.sender, to, etherValue, now);
    }

	// 檢查銀行帳戶餘額
	//觸發balance[msg.sender]，返回帳戶餘額
    function getBankBalance() public view returns (uint256) {
        return balance[msg.sender];
    }
	//觸發selfdestruct(owner)
    function kill() public isOwner {
        selfdestruct(owner);
    }

}
