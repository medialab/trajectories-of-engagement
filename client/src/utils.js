
import * as React from "react";
import { parse as parseYml } from 'yaml'
import messagesURL from './contents/messages.yml';

export const AuthContext = React.createContext();

let messages = {}
fetch(messagesURL)
.then((response) => {
  return response.text()
})
.then(str => {
  try {
    messages = parseYml(str);
  } catch(e) {
    console.error(e);
  }
})

export function useAuth() {
  return React.useContext(AuthContext);
}

export function translate(key, lang) {
  const loadingMessage = lang === 'en' ? 'loading' : 'chargement';
  if (messages[key] !== undefined) {
    return messages[key][lang] || key;
  }
  return loadingMessage;
}