
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/admin/Dashboard";
import ManageTasks from "./pages/admin/ManageTasks";
import ManageUsers from "./pages/admin/ManageUsers";
import UserDashboard from "./pages/tasks/UserDashboard";
import MyTask from "./pages/tasks/MyTask";
import TaskDetail from "./pages/tasks/TaskDetail";
import CreateTask from "./pages/tasks/CreateTask";
import EditTask from "./pages/tasks/EditTask";




const App = () => {
  return (

    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/*Admin Routes*/}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/tasks" element={<ManageTasks />} />
            <Route path="/admin/users" element={<ManageUsers />} />
          </Route>

          {/*User Routes*/}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/tasks" element={<MyTask />} />
            <Route path="/user/task-details/:id" element={<TaskDetail />} />
            <Route path="/user/create-task" element={<CreateTask />} />
            <Route path="/user/edit-task/:id" element={<EditTask />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </div>

  );
};

export default App
