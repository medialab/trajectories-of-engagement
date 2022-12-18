import * as React from "react";
import {
  // Link,
  Outlet,
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import AuthStatus from "./AuthStatus";

export default function Layout() {
  return (
    <div>
    

      <Outlet />
      {/* <ul>
        <li>
          <Link to="/admin">Go to admin</Link>
        </li>
      </ul>
      <AuthStatus /> */}
      <ToastContainer autoClose={1000} />
    </div>
  );
}