import * as React from "react";
import {
  useLocation,
  useParams,
  Navigate,
  useSearchParams
} from "react-router-dom";

import { useAuth } from "../utils";

export default function RequireAuth({ children, isAdmin}) {
  let {isAuthenticated} = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const params = useParams();
  const lang = searchParams.get('lang') || 'en'
  if (!isAuthenticated) {
    return <Navigate to={`/login?lang=${lang}`} state={{ from: location, isAdmin, params }} replace />;
  }

  return children;
}