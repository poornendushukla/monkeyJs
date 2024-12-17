import React, { ReactNode, useEffect, useState } from 'react';

const generateRandomStyle = () => {
  const width = Math.floor(Math.random() * 200) + 50; // Random width between 50px and 250px
  const height = Math.floor(Math.random() * 200) + 50; // Random height between 50px and 250px
  const left = Math.floor(Math.random() * (window.innerWidth - width)); // Random position within the window's width
  const top = Math.floor(Math.random() * (window.innerHeight - height)); // Random position within the window's height
  const backgroundColor = `hsl(${Math.floor(Math.random() * 360)}, 100%, 75%)`; // Random color

  return {
    width: `${width}px`,
    height: `${height}px`,
    left: `${left}px`,
    top: `${top}px`,
    backgroundColor,
    position: 'absolute',
  } as React.CSSProperties;
};

const Demo = () => {
  const [divs, setDivs] = useState<Array<unknown>>([]);
  // Create 15 divs with random styles

  useEffect(() => {
    const el = [];
    for (let i = 0; i < 15; i++) {
      el.push(<div id={`step-${i}`} key={i} style={generateRandomStyle()} />);
    }
    setDivs(el);
    setTimeout(() => {
      const ele = (
        <div id={`step-${123}`} key={123} style={generateRandomStyle()} />
      );
      setDivs((prev) => [ele, ...prev]);
    }, 3000);
  }, []);
  return <div>{divs as ReactNode}</div>;
};

export default Demo;
