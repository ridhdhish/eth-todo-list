const TodoList = artifacts.require("TodoList.sol");

module.exports = async function (deployer) {
  deployer.deploy(TodoList);
};
