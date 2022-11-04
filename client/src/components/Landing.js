/* eslint import/no-webpack-loader-syntax : 0 */
import intro from '../contents/en/introduction.md';
import Md from 'react-markdown';
import { useState, useEffect } from 'react';

export default function Landing ({lang = 'en'}) {
  const [content, setContent] = useState(null);
  useEffect(
    () => {
      fetch(intro)
      .then(response => {
        return response.text()
      })
      .then((txt) => {
        setContent(txt)
      })
    }
  , [lang]);

  return (
    <div className="Landing">
      {content ? <Md>{content}</Md> : <div>Loading</div>}
    </div>
  )
}