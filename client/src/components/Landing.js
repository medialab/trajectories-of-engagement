/* eslint import/no-webpack-loader-syntax : 0 */
import introEn from '../contents/en/introduction.md';
import introFr from '../contents/fr/introduction.md';
import { useSearchParams } from 'react-router-dom';
import Md from 'react-markdown';
import useMeasure from 'react-use-measure'
import { useState, useEffect, useMemo } from 'react';
import { Path } from './animatedPrimitives'
import * as d3 from 'd3-shape';

export default function Landing({
  // lang = 'en',
  debug = false
}) {
  const [content, setContent] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [shapePoints, setShapePoints] = useState([]);
  const [curve, setCurve] = useState('');
  // trick
  const [heightIsSetup, setHeightIsSetup] = useState(false);
  const [hoveredTitleCharIndex, setHoveredTitleCharIndex] = useState(undefined);
  const [lettersAreMoving, setLettersAreMoving] = useState(false);
  const [measureRef, bounds] = useMeasure();
  const { width, height: realHeight } = bounds;
  const height = realHeight;
  let lang = useMemo(() => {
    return searchParams && searchParams.get('lang');
  }, [searchParams]);
  lang = lang || 'en';

  useEffect(
    () => {
      const intro = lang === 'en' ? introEn : introFr;
      fetch(intro)
        .then(response => {
          return response.text()
        })
        .then((txt) => {
          setContent(txt)
        })
    }
    , [lang]);

  const titleLetters = useMemo(() => Array.from(lang === 'en' ? "Trajectories of engagement" : "Trajectoires d'implication"), [lang]);

  const fontHeight = 75;

  const letters = useMemo(() => {
    const yColumnHeight = 1 / titleLetters.length;
    let currentRow = 0;
    let indexInRow = 0;
    return titleLetters.map((letter, index) => {
      const x = 0.3 + Math.random() * .5;
      if (letter === ' ') {
        currentRow++;
        indexInRow = -1;
      }
      indexInRow++;
      return {
        letter,
        // [0,1]
        x,
        // [0,1]
        y: index * yColumnHeight,
        row: currentRow,
        indexInRow
      }
    })
  }, [titleLetters]);

  const curvePoints = useMemo(() => {
    return [
      ...letters.reduce((cur, { x, y }, index) => {
        return [
          ...cur,
          {
            x: x * width + fontHeight * .333,
            y: y * height + fontHeight * .66
          }
        ]
      }, [])
    ]
  }, [letters, width, height]);

  useEffect(() => {
    if (height) {
      setTimeout(() => {
        setHeightIsSetup(true);
      }, 700)
    }
  }, [height])

  // const curveFn = useMemo(() => d3.line().x(d => d.x).y(d => d.y).curve(d3.curveBasisOpen), [width, height, letters]);

  useEffect(function updateShapePoints() {
    const margin = 10;
    const newShapePoints = [
      ...letters.reduce((cur, { x, y }, index) => {
        const next = index === letters.length - 1 ? undefined : letters[index + 1];
        return [
          ...cur,
          {
            x: x * width - margin,
            y: y * height
          },
          {
            x: x * width - margin,
            y: y * height + fontHeight * 1.3
          },
          next ?
            next.x < x ?
              {
                x: x * width + fontHeight,
                y: y * height + fontHeight * 1.3
              }
              :
              {
                x: next.x * width + fontHeight,
                y: y * height + fontHeight * 1.3
              }
            : undefined,
          next ?
            next.x < x ?

              {
                x: x * width + fontHeight,
                y: next.y * height
              }
              :
              {
                x: next.x * width + fontHeight,
                y: next.y * height
              }
            : undefined
        ].filter(p => p)
      }, [
        {
          x: width,
          y: 0
        }
      ]),
      {
        x: width,
        y: height
      }
    ];
    setShapePoints(newShapePoints)
  }, [letters, width, content, heightIsSetup]); /* eslint react-hooks/exhaustive-deps : 0 */

  useEffect(() => {
    const curveFn = d3.line().x(d => d.x).y(d => d.y).curve(d3.curveBasisOpen);
    let newCurve = curveFn(shapePoints);
    // console.log('width : ', width, 'shape points : ', shapePoints[2], 'curve : ', newCurve && newCurve.substring(0, 100));
    setCurve(newCurve);
    setTimeout(() => {
      let newCurve = curveFn(shapePoints);
      setCurve(newCurve);
    }, 500)
  }, [shapePoints, width, content, height])
  return (
    <div ref={measureRef} className="Landing">
      <svg
        width={width}
        height={height}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: width,
          height: height,
          zIndex: -1,
          // display: 'none'
        }}
      >
        {/* <rect
          fill="red"
          x={0}
          y={0}
          width={width / 2}
          height={height}
        /> */}
        {
          debug ?
            curvePoints.map(({ x, y }, index) => {
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r={5}
                  fill="red"
                />
              )
            })
            : false
        }

        {
          debug ?
            <polygon points={
              shapePoints.map(({ x, y }) => {
                return `${x}, ${y}`
              }).join(', ')
            } fill="purple" />
            : null
        }

        {debug ?
          shapePoints.map(({ x, y }, index) => {
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={5}
                fill="green"
              />
            )
          })
          : null
        }
        {
          <Path
            fill="transparent"
            d={curve}
            markerEnd="url(#arrowhead)"
            className="vector-path"
            style={{
              opacity: heightIsSetup ? 1 : 0
            }}
          />
        }
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7"
            refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="red" stroke="red" />
          </marker>
        </defs>
      </svg>
      {content ? <Md>{content}</Md> : <div>Loading</div>}
      <h1
        className="title"
      // style={{display: 'none'}}
      >
        {
          letters.map(({ x, y, letter, row, indexInRow }, index) => {
            const handleMouseMove = () => {
              if (hoveredTitleCharIndex === undefined && !lettersAreMoving) {
                setHoveredTitleCharIndex(index);
                setLettersAreMoving(true);
                setTimeout(() => setLettersAreMoving(false), 500);
              }
            }
            const handleMouseLeave = () => {
              if (hoveredTitleCharIndex === index && !lettersAreMoving) {
                setHoveredTitleCharIndex(undefined);
                setLettersAreMoving(true);
                setTimeout(() => setLettersAreMoving(false), 500);
              }
            }

            let realX = x * width;
            let realY = y * height;

            if (hoveredTitleCharIndex !== undefined) {
              const refPos = letters[hoveredTitleCharIndex];
              const fontWidth = fontHeight;
              if (hoveredTitleCharIndex !== index) {
                const rowDisplace = refPos.row - row;
                realY = refPos.y * height - rowDisplace * fontHeight * 1.5;
                const indexDisplace = refPos.indexInRow - indexInRow;
                realX = refPos.x * width - indexDisplace * fontWidth;
              }
            }

            const handleClick = () => {
              const supportsTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
              if (supportsTouch) {
                if (hoveredTitleCharIndex) {
                  setHoveredTitleCharIndex(undefined);
                } else {
                  setHoveredTitleCharIndex(index);
                }
              }
            }

            return (
              <span
                style={{
                  position: 'absolute',
                  left: `${realX}px`,
                  top: `${realY}px`,
                  fontSize: fontHeight
                }}
                className="title-letter"
                onMouseEnter={handleMouseMove}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                key={index}
              >
                {letter === ' ' ? '⨯' : letter}
              </span>
            )
          })
        }
      </h1>

      <div className="lang-switch-container">
        <button onClick={() => {
          setSearchParams({ lang: 'en' })
        }} className={`lang-btn ${lang === 'en' ? 'is-active' : ''}`}>
          en
        </button>
        <button onClick={() => {
          setSearchParams({ lang: 'fr' })
        }} className={`lang-btn ${lang === 'fr' ? 'is-active' : ''}`}>
          fr
        </button>
      </div>

      <style>{
        `
        /*  // polygon(71.78% 23.22%, 99.4% 23.3%, 99.56% 77.52%, 72.19% 80.87%); */
        .Landing::before {
      shape-outside : polygon(${shapePoints.map(({ x, y }) => `${x / width * 100}% ${y / height * 100}%`).join(', ')});
      content: "";
      float: right;
      height: ${height}px;
      width: 100%;

      //  background: blue;
    }
    `}
      </style>
    </div>
  )
}