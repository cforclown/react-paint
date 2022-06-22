import { useState } from 'react';

export const useHistory = (initialState: any[]): [any[], (state: any, overwrite?: boolean)=>void, ()=>void, ()=>void] => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const setState = (action: any, overwrite?: boolean): void => {
    const newState = typeof action === 'function' ? action(history[index]) : action;
    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      setHistory([...updatedState, newState]);
      setIndex((prevState) => prevState + 1);
    }
  };

  const undo = (): false | void => index > 0 && setIndex((prevState) => prevState - 1);
  const redo = (): false | void => index < history.length - 1 && setIndex((prevState) => prevState + 1);

  return [history[index], setState, undo, redo];
};
