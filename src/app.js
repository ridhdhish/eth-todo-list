const App = {
  loading: false,
  contract: {},
  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
  },

  loadWeb3: async () => {
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        web3.eth.sendTransaction({
          /* ... */
        });
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.sendTransaction({
        /* ... */
      });
    }
    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  },

  loadAccount: async () => {
    accounts = await web3.eth.getAccounts();
    App.account = accounts[0];
  },

  loadContract: async () => {
    const todoList = await $.getJSON("TodoList.json");
    App.contract.TodoList = TruffleContract(todoList);
    App.contract.TodoList.setProvider(web3.currentProvider);

    App.todoList = await App.contract.TodoList.deployed();
  },

  render: async () => {
    if (App.loading) {
      return;
    }

    App.setLoading(true);
    $("#account").html(App.account);

    await App.renderTask();
    App.setLoading(false);
  },

  renderTask: async () => {
    const tasks = await App.todoList.taskCount();
    const taskCount = tasks.toNumber();
    const $taskTemplate = $(".taskTemplate");

    // const totalTasks = await App.todoList.tasks();
    // console.log(totalTasks);

    //Render Each task
    for (let i = 1; i <= taskCount; i++) {
      const task = await App.todoList.tasks(i);
      const $newTaskTemplate = $taskTemplate.clone();
      $newTaskTemplate.find(".content").html(task[1]);
      $newTaskTemplate
        .find("input")
        .prop("name", task[0])
        .prop("checked", task[2])
        .on("click", App.toggleCompleted);

      if (App.taskCompleted) {
        $("#completedTaskList").append($newTaskTemplate);
      } else {
        $("#taskList").append($newTaskTemplate);
      }

      // Show the task
      $newTaskTemplate.show();
    }
  },

  toggleCompleted: async (e) => {
    App.setLoading(true);
    const taskId = e.target.name;
    //await App.todoList.toggleCompleted(taskId);

    console.log(App.todoList);
    //window.location.reload();
  },

  setLoading: (loading) => {
    App.loading = loading;
    const loader = $("#loader");
    const content = $("#content");

    if (loading) {
      loader.show();
      content.hide();
    } else {
      loader.hide();
      content.show();
    }
  },
};

$(() => {
  $(window).load(() => {
    App.load();
  });
});
