import * as React from "react";
import {
  Routes,
  Route,
  Navigate,
  NavLink,
} from "react-router-dom";

import { BrowserRouter } from "react-router-dom";

import AuthProvider from "./components/AuthProvider";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import LoginPage from './components/LoginPage';
import Landing from "./components/Landing";
import TrajectoryView from "./components/TrajectoryView";
import AdminView from "./components/AdminView";

import './App.scss'

function NoMatch() {
  return (
    <div>
      No match (404)
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      {/* <h1><NavLink to={'/'}>Trajectories of engagement</NavLink></h1> */}

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <RequireAuth isAdmin>
                <AdminView />
              </RequireAuth>
            }
          />
          <Route
            path="/trajectories/:id"
            element={
              <RequireAuth>
                <TrajectoryView />
              </RequireAuth>
            }
          />
          <Route path="/trajectories/"
            element={<Navigate replace to="/admin" />}
          />
          <Route path="*"
            element={<NoMatch />}
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}



export default function Main() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}