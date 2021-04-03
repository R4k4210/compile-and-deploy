const path = require('path');
const fs = require('fs');
const solc = require('solc');
const chalk = require('chalk');

//Esto normalmente lo hace un framework como truffle, pero lo haremos a mano, primero usamos path, para
//buscar el contrato, luego usamos fs para leer el archivo encontrado
const contractPath = path.resolve(__dirname, "../contracts", "UsersContract.sol");
const source = fs.readFileSync(contractPath, "utf8");

//Para compilar el contrato, tenemos que generar un input como el siguiente, donde especificamos
//que contrato debe ir a buscar y que queremos de ahí. También podemos especificar el output.
const input = {
    language: "Solidity",
    sources: {
        "UsersContract.sol": {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            "*": {
                "*": ["*"],
            },
        },
    },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

module.exports = output.contracts["UsersContract.sol"].UsersContract;

/* 
Esto es a fines de conocer que nos devuelve al compilar, no es necesario para el desarollo

console.log(chalk.green(JSON.stringify(compileOutput.abi)));
console.log(chalk.cyan(compileOutput.evm.bytecode.object));
*/