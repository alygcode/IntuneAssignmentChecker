import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DashboardHome from './components/DashboardHome';
import PoliciesPage from './pages/PoliciesPage';
import GroupsPage from './pages/GroupsPage';
import DevicesPage from './pages/DevicesPage';
import UsersPage from './pages/UsersPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/policies">Policies</Link>
            </li>
            <li>
              <Link to="/groups">Groups</Link>
            </li>
            <li>
              <Link to="/devices">Devices</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/policies" element={<PoliciesPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/devices" element={<DevicesPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
