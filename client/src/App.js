import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import Task from "./Task";
import "./App.css";

import { TaskContractAddress } from "./config.js";
import { ethers } from "ethers";
import TaskAbi from "./TaskContract.json";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [currentAccount, setCurrentAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask not found");
        return;
      }

      let chainId = await ethereum.request({ method: "eth_chainId" });

      const goerliChainId = "0x5";

      if (chainId !== goerliChainId) {
        return;
      } else {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {}
  };

  const getAlltasks = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );

        let allTasks = await TaskContract.getMyTask();
        setTasks(allTasks);
      } else {
        console.log("Ethereum doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addTask = async () => {
    let task = {
      taskText: input,
      isDeleted: false,
    };

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );

        TaskContract.addTask(task.taskText, task.isDeleted)
          .then((response) => {
            setTasks([...tasks, task]);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } catch (error) {}

    setInput("");
  };

  const deleteTask = (id) => async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );

        let deleteTx = await TaskContract.deleteTask(id, true);
        await deleteTx.wait();

        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks);
      }
    } catch (error) {}

    setInput("");
  };

  useEffect(() => {
    connectWallet();
    getAlltasks();
  }, []);

  return (
    <div>
      <div className="Itask">
        <h1> I-TASK APP</h1>
      </div>
      <div className="blockchain">
        <p>
          {" "}
          This is application is written with a blockchain technology which
          helps in scheduling your day to day activities on an ethereum
          blockchain
        </p>
      </div>

      {currentAccount === "" ? (
        <div>
          <button className="ConnectWallet" onClick={connectWallet}>
            Connect Wallet
          </button>
        </div>
      ) : correctNetwork ? (
        <div className="App">
          <h2> Create Task</h2>
          <form>
            <TextField
              id="outlined-basic"
              label="Task creation"
              varaint="outlined"
              style={{ margin: "0px 5px" }}
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button varaint="contained" color="primary" onClick={addTask}>
              Add Task
            </Button>
          </form>
          <ul>
            {tasks.map((item) => (
              <Task
                key={item.id}
                taskText={item.taskText}
                onClick={deleteTask(item.id)}
              />
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col jsutify-center items-center mb-20 font-bold text-2xl gap-y-3">
          <div>-------------------------------</div>
          <div>Please connect to the Goerli testnet</div>
          <div>and reload the page</div>
          <div>------------------------------</div>
        </div>
      )}
    </div>
  );
}

export default App;
