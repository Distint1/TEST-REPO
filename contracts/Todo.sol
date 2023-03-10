// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

contract TaskContract {
    struct Task {
        uint id;
        string taskText;
        bool isDone;
        bool isDeleted;
    }

    Task[] private tasks;
    mapping(uint256 => address) private taskToOwner;

    event AddTask(address indexed recipient, uint indexed taskId);
    event DeleteTask(uint indexed taskId, bool indexed isDeleted);
    event MarkAsDone(uint indexed taskId, bool indexed isDone);

    function addTask(string memory _taskText, bool _isDone, bool _isDeleted) external {
        uint256 taskId = tasks.length;
        tasks.push(Task(taskId, _taskText, _isDone, _isDeleted));
        taskToOwner[taskId] = msg.sender;
        emit AddTask(msg.sender, taskId);
    }

    function getMyTasks() external view returns (Task[] memory) {
        Task[] memory myTasks = new Task[](tasks.length);
        uint256 counter = 0;
        for (uint256 i = 0; i < tasks.length; i++) {
            if (taskToOwner[i] == msg.sender && !tasks[i].isDeleted) {
                myTasks[counter++] = tasks[i];
            }
        }
        Task[] memory result = new Task[](counter);
        for (uint256 i = 0; i < counter; i++) {
            result[i] = myTasks[i];
        }
        return result;
    }

    function deleteTask(uint256 _taskId, bool _isDeleted) external {
        if (taskToOwner[_taskId] == msg.sender) {
            tasks[_taskId].isDeleted = _isDeleted;
            emit DeleteTask(_taskId, _isDeleted);
        }
    }
    
    function markAsDone(uint256 _taskId, bool _isDone) external {
        if (taskToOwner[_taskId] == msg.sender) {
            tasks[_taskId].isDone = _isDone;
            emit MarkAsDone(_taskId, _isDone);
        }
    }
}
