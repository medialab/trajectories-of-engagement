import {useRef,useEffect} from "react";
import {
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";

import { toast } from 'react-toastify';


import { translate, useAuth } from "../utils";

export default function LoginPage() {
  let navigate = useNavigate();
  let location = useLocation();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get('lang') || 'en'

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
        toast.success(translate('valid_password', lang));
        const finalFrom = from.includes('?lang=') ? from : from + '?lang=' + lang
        navigate(finalFrom, { replace: true });
      })
      .catch(() => {
        toast.error(translate('invalid_password', lang));
      })
  }
  return (
    <div className="LoginPage">
      <div>
        <p>{translate('must_login', lang)}{' '}<code>{from}</code></p>

        <form onSubmit={handleSubmit}>
          <label>
            {translate('password', lang)} {isAdmin ? '(admin)' : <span>({translate('for_this_specific_trajectory', lang)})</span>}:
            <input ref={inputRef} name="password" id="password" type="password" />
          </label>{" "}
          <button type="submit">{translate('login', lang)}</button>
        </form>
      </div>
    </div>
  );
}
