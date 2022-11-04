import { useAuth } from "../utils";

import {
  useNavigate,
} from "react-router-dom";

export default function AuthStatus() {
  let auth = useAuth();
  let navigate = useNavigate();

  if (!auth.isAuthenticated) {
    return <p>You are not logged in.</p>;
  }

  return (
    <p>
      Welcome
      <button
        onClick={() => {
          auth.signout().then(() => navigate("/"));
        }}
      >
        Sign out
      </button>
    </p>
  );
}
