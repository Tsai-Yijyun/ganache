let bankBytecode =
"608060405260008054600160a060020a031916331790556105d3806100256000396000f30060806040526004361061008c5763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166252fae781146100915780632e1a7d4d146100bb57806341c0e1b5146100d5578063745e875a146100ea5780637b83b50b146100f5578063a9059cbb1461010a578063c0e010311461013b578063d0e30db014610150575b600080fd5b34801561009d57600080fd5b506100a9600435610158565b60408051918252519081900360200190f35b3480156100c757600080fd5b506100d3600435610212565b005b3480156100e157600080fd5b506100d3610322565b6100d36004356103c3565b34801561010157600080fd5b506100a9610421565b34801561011657600080fd5b506100d373ffffffffffffffffffffffffffffffffffffffff60043516602435610434565b34801561014757600080fd5b506100a961053c565b6100d361054f565b33600090815260036020526040812054819081908190851161017a578461018b565b336000908152600360205260409020545b336000818152600260209081526040808320805460018452828520805460648984020492830190810190915591859055600384528285209490945581518181524293810193909352815195985092965091945091927fa87a8590e1a5aa4864d599d394ac0d5dd78770d224e6d8dcf39d9e6e772fb5e59281900390910190a2505050919050565b33600090815260016020526040902054670de0b6b3a764000082029081111561029c57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601c60248201527f796f75722062616c616e63657320617265206e6f7420656e6f75676800000000604482015290519081900360640190fd5b604051339082156108fc029083906000818181858888f193505050501580156102c9573d6000803e3d6000fd5b5033600081815260016020908152604091829020805485900390558151858152429181019190915281517f5bb95829671915ece371da722f91d5371159095dcabf2f75cd6c53facb7e1bab929181900390910190a25050565b60005473ffffffffffffffffffffffffffffffffffffffff1633146103a857604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601160248201527f796f7520617265206e6f74206f776e6572000000000000000000000000000000604482015290519081900360640190fd5b60005473ffffffffffffffffffffffffffffffffffffffff16ff5b336000818152600260209081526040808320349081905560038352928190208590558051928352429183019190915280517fdad37ff1c4e630f7924f3542fa5206a62ea3f1f9d9e221e3f9de31f539803cb99281900390910190a250565b3360009081526001602052604090205490565b33600090815260016020526040902054670de0b6b3a76400008202908111156104be57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601c60248201527f796f75722062616c616e63657320617265206e6f7420656e6f75676800000000604482015290519081900360640190fd5b3360008181526001602090815260408083208054869003905573ffffffffffffffffffffffffffffffffffffffff8716808452928190208054860190558051868152429281019290925280519293927fbabc8cd3bd6701ee99131f374fd2ab4ea66f48dc4e4182ed78fecb0502e44dd69281900390910190a3505050565b3360009081526002602052604090205490565b336000818152600160209081526040918290208054349081019091558251908152429181019190915281517fad40ae5dc69974ba932d08b0a608e89109412d41d04850f5196f144875ae2660929181900390910190a25600a165627a7a7230582055444d579e303c91927ef94a1ba25aff18a998d0fca1ec950087d3b22c89215c0029";


let bankAbi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "period",
				"type": "uint256"
			}
		],
		"name": "cdWithdraw",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "etherValue",
				"type": "uint256"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "kill",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "period",
				"type": "uint256"
			}
		],
		"name": "certificateDeposit",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getBankBalance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "to",
				"type": "address"
			},
			{
				"name": "etherValue",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getCdBalance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "deposit",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "value",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "DepositEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "value",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "WithdrawEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "value",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "TransferEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "value",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "cdEvent",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "value",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "cdWithdrawEvent",
		"type": "event"
	}
]