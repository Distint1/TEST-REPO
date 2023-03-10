import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import Task from "./Task";
import "./App.css";

import { TaskContractAddress } from "./config.js";
import { ethers } from "ethers";
import TaskAbi from "./TaskContract.json";
import Navbar from "./Navbar";

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
    <div className="bg h-screen">
      <div className=" m-auto ">
        <Navbar />
        <div className="Itask text-white mt-20 md:mt-[25vh] ">
          <h1 className="text-yellow-700"> I-TASK APP</h1>
        </div>
        <div className="max-w-7xl mx-7 md:m-auto pl-4 flex flex-col items-center md:flex-row justify-between mt-12">
          <div className="blockchain md:w-2/4">
            <p className="text-white">
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
            <div className="flex flex-col justify-start mt-8 md:mt-0 w-2/4 md:pl-12 items-start">
              <h2 className="text-white mb-2"> Create Task</h2>
              <form className="flex flex-col  md:w-[50%]">
                <input
                  id="outlined-basic"
                  placeholder="Task creation"
                  className="my-2 w-full p-2 outline-none bg-transparent text-black border-none text-sm bg-white rounded-xl"
                  size="small"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  className="text-white w-[10rem] mt-4 border-[1px] p-2 border-green-600 hover:bg-[#3d4f7c] rounded-full cursor-pointer"
                  varaint="contained"
                  color="primary"
                  onClick={addTask}
                >
                  Add Task
                </button>
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
      </div>
      <div className="sm:w-full px-8 m-auto bottom-0 mb-8 fixed w-full flex justify-between items-center">
        <p className="text-white text-left text-xs">@I-TaskApp</p>
        <p className="text-white text-right text-xs">All rights reserved</p>
      </div>
    </div>
  );
}

export default App;
