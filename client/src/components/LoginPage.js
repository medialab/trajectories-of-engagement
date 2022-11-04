import * as React from "react";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import { toast } from 'react-toastify';


import { useAuth } from "../utils";

export default function LoginPage() {
  let navigate = useNavigate();
  let location = useLocation();
  let auth = useAuth();

  let from = location.state?.from?.pathname || "/";
  const isAdmin = location.state?.isAdmin;
  const id = location.state?.params?.id;

  function handleSubmit(event) {
    event.preventDefault();

    let formData = new FormData(event.currentTarget);
    let password = formData.get("password");
    auth.signin(password, id)
    .then(() => {
      toast.success('Valid password !');
      navigate(from, { replace: true });
    })
    .catch(() => {
      toast.error('Invalid password');
    })
  }

  return (
    <div>
      <p>You must log in to view the page at {from}</p>

      <form onSubmit={handleSubmit}>
        <label>
          Password {isAdmin ? '(admin)': <span>(for this trajectory <code>{id}</code>)</span>}: 
          <input name="password" id="password" type="password" />
        </label>{" "}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
