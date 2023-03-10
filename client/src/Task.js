import DeleteIcon from "@mui/icons-material/Delete";
import { List, ListItem, ListItemText } from "@mui/material";
import "./Task.css";

const Task = ({ taskText, onClick }) => {
  return (
    <List className="todo_list">
      <ListItem>
        <ListItemText primary={taskText} />
      </ListItem>
      <DeleteIcon fontsize="large" style={{ opacity: 0.8 }} onClick={onClick} />
    </List>
  );
};

export default Task;
