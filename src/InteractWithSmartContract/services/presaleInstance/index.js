
import { Contract } from '@ethersproject/contracts'
import axios from 'axios';

import { presaleABI } from '../../abis/presale';
// import { presaleContractAddress } from '../../constants/contractAddresses';

var _secondAmount = 9000000000;
var presaleContractAddress = "";
const presaleContractAddres = "0x234FFC9B27E56817E4357d3bF7A71adc09699477";
const presaleHostAddress = "";
var presaleStart = false;



const presaleInstance = (account, chainId, library) => {

    if (chainId) {
        return new Contract(presaleContractAddress, presaleABI, library.getSigner(account));
    }
    return null
}

export {
    presaleInstance,
    _secondAmount,
    presaleContractAddress,
    presaleContractAddres,
    presaleHostAddress,
    presaleStart
}


