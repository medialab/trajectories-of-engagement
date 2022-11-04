import * as React from "react";
import {
  useLocation,
  useParams,
  Navigate,
} from "react-router-dom";

import { useAuth } from "../utils";

export default function RequireAuth({ children, isAdmin}) {
  let {isAuthenticated} = useAuth();
  let location = useLocation();
  const params = useParams();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location, isAdmin, params }} replace />;
  }

  return children;
}