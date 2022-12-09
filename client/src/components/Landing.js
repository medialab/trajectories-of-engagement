/* eslint import/no-webpack-loader-syntax : 0 */
import intro from '../contents/en/introduction.md';
import Md from 'react-markdown';
import useMeasure from 'react-use-measure'
import { useState, useEffect, useMemo } from 'react';
import * as d3 from 'd3-shape';
console.log('d3', d3);

export default function Landing ({
  lang = 'en',
  debug = false
}) {
  const [content, setContent] = useState(null);
  const [measureRef, bounds] = useMeasure();
  const {width, height: realHeight} = bounds;
  const height = realHeight;
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

  const titleLetters = useMemo(() => Array.from(lang === 'en' ? "Toajectories of engagement" : "Trajectoires d'implication"), [lang]);

  const fontHeight = 75;

  const letters = useMemo(() => {
    const yColumnHeight = 1 / titleLetters.length;
    return titleLetters.map((letter, index) => {
      const x = 0.25 + Math.random() * .5;
      return {
        letter,
        // [0,1]
        x,
        // [0,1]
        y: index * yColumnHeight
      }
    })
  }, [titleLetters]);

  const curvePoints = useMemo(() => {
    return [
      ...letters.reduce((cur, {x,y}, index) => {
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

  const shapePoints = useMemo(() => {
    const margin = 10;
    return [
      ...letters.reduce((cur, {x, y}, index) => {
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
          y:  y * height + fontHeight * 1.3
        }
        :
        {
          x: next.x * width + fontHeight,
          y:  y * height + fontHeight * 1.3
        }
        : undefined,
        next ?
        next.x < x ?

        {
          x: x * width + fontHeight,
          y:  next.y * height
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
    ]
  }, [letters, width, height]);

  // const curve = curve(curveCatmullRom.alpha(0.5));
  // console.log(d3.curve(curvePoints.map(({x, y}) => [x, y])));

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
          curvePoints.map(({x, y}, index) => {
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
        }
        {
          <path
            stroke="red"
            fill="transparent"
            d={`M ${curvePoints[0].x} ${curvePoints[0].y} 
            Q ${curvePoints[1].x} ${curvePoints[1].y}, ${curvePoints[2].x} ${curvePoints[2].y}
            ${
              []
              // curvePoints.slice(2)
              .map(({x, y}) => `T ${x} ${y}`)
              .join(' ')
              // curvePoints.slice(1).map(({x, y}) => `L ${x} ${y}`).join(' ')
              // curvePoints.slice(1)
              // .reduce((cur, {x, y}, index) => {
              //   if (index%2 === 0) {
              //     return cur;
              //   }
              //   if (index === curvePoints.length - 2) {
              //     return cur;
              //   }
              //   const next = curvePoints[index + 1];
              //   const nextNext = curvePoints[index + 2];
              //   // if (index === 0) {
              //   //   return `${cur} Q ${next.x} ${next.y} ${x} ${y}`
              //   // }
              //   // return `${cur} T ${x} ${y}`
              //   return `${cur} ${index === 0 ? 'Q' : 'Q'} ${x} ${y}, ${next.x} ${next.y}`;
              // }, '')
            }
            `}
          />
        } 
        {
          debug ?
          <polygon points={
            shapePoints.map(({x, y}) => {
              return `${x}, ${y}`
            }).join(', ')
          } fill="purple" />
          : null
        }
        
        { debug ?
          shapePoints.map(({x, y}, index) => {
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
      </svg>
      {content ? <Md>{content}</Md> : <div>Loading</div>}
      <h1 
        className="title"
        // style={{display: 'none'}}
      >
      {
        letters.map(({x, y, letter}, index) => {
          return (
            <span
              style={{
                position: 'absolute',
                left: `${x * width}px`,
                top: `${y * height}px`,
                fontSize: fontHeight
              }}
              key={index}
            >
              {letter === ' ' ? '⨯' : letter}
            </span>
          )
        })
      }
      </h1>
      <style>{
        `
        /*  // polygon(71.78% 23.22%, 99.4% 23.3%, 99.56% 77.52%, 72.19% 80.87%); */
        .Landing::before {
      shape-outside : polygon(${shapePoints.map(({x, y}) => `${x / width * 100}% ${y / height * 100}%`).join(', ')});
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