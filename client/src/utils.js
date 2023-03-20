
import * as React from "react";
import {useEffect, useState} from 'react';
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

export function cumulativeOffset (element) {
  let top = 0, left = 0;
  do {
      top += element.offsetTop  || 0;
      left += element.offsetLeft || 0;
      element = element.offsetParent;
  } while(element);

  return {
      top: top,
      left: left
  };
};

export function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}