const assert = require("assert");
const Web3 = require("web3");
const AssertioError = require("assert").AssertionError;
var chaiassert = require("chai").assert;

const web3 = new Web3(Web3.givenProvider || "HTTP://127.0.0.1:7545");

const compile = require("../scripts/compile");

const bytecode = compile.evm.bytecode; //acá tuvimos un error ya que  estabamos usando deployedBytecode en vez de bytecode!! Ojo!
const abi = compile.abi;

let accounts;
let usersContract;
console.log("Algo");
//Se ejecuta antes de ejecutar cada test unitario
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  usersContract = await new web3.eth.Contract(abi) //Se le debe pasar el abi en formato json
    .deploy({ data: bytecode.object, arguments: [] }) //esto recibe un obejo, puede tener argumentos
    .send({ from: accounts[0], gas: 1000000 });
});

describe("The UsersContract", async () => {
  it("should deploy", () => {
    console.log(usersContract.options.address);
    assert.ok(usersContract.options.address);
  });

  it("should join user", async () => {
    let name = "Santiago";
    let surname = "Chopitea";
    await usersContract.methods
      .join(name, surname)
      .send({ from: accounts[0], gas: 500000 });
  });

  it("should retrieve a user", async () => {
    let name = "Santiago";
    let surname = "Chopitea";
    await usersContract.methods
      .join(name, surname)
      .send({ from: accounts[0], gas: 500000 });

    //En vez de usar send() como una transacción, se usa call()
    let user = await usersContract.methods.getUser(accounts[0]).call();

    assert.strictEqual(name, user[0]);
    assert.strictEqual(surname, user[1]);
  });

  it("should not allow joining an account twice", async () => {
    await usersContract.methods
      .join("Pedro", "Lopez")
      .send({ from: accounts[1], gas: 500000 });

    try {
      await usersContract.methods
        .join("Ana", "Gomez")
        .send({ from: accounts[1], gas: 500000 });

      assert.fail("Same account cant join twice");
    } catch (error) {
      if (error instanceof AssertioError) {
        assert.fail(error.message);
      }
    }
  });

  it("should not allow retrieving a not registered user", async () => {
    try {
      await usersContract.methods.getUser(accounts[0]).call();
      assert.fail("user should not be registered");
    } catch (error) {
      if (error instanceof AssertioError) {
        assert.fail(error.message);
      }
    }
  });

  it("should retrieve total registered users", async () => {
    await usersContract.methods
      .join("Ana", "Gomez")
      .send({ from: accounts[0], gas: "500000" });

    await usersContract.methods
      .join("Mario", "Bros")
      .send({ from: accounts[1], gas: "500000" });

    let total = await usersContract.methods.totalUsers().call();
    chaiassert.equal(total, 2);
  });
});
