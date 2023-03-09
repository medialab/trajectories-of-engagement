import {useRef,useEffect} from "react";
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

  const inputRef = useRef(null);

  /* focus input on mount */
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef.current]) /* eslint react-hooks/exhaustive-deps : 0 */

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
    <div className="LoginPage">
      <div>
        <p>You must log in to view the page at {from}</p>

        <form onSubmit={handleSubmit}>
          <label>
            Password {isAdmin ? '(admin)' : <span>(for this trajectory <code>{id}</code>)</span>}:
            <input ref={inputRef} name="password" id="password" type="password" />
          </label>{" "}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
