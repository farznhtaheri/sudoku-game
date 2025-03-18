import { useState } from 'react'
import { useEffect } from 'react'
import {nanoid} from 'nanoid'
import EmptyCell from './EmptyCell';
import confetti from "https://cdn.skypack.dev/canvas-confetti"
import clsx from 'clsx';

function Sudoku() {

  const savedBoard = JSON.parse(localStorage.getItem('board')) || [];
  const savedSolution = JSON.parse(localStorage.getItem('solution')) || [];
  
  const [board, setBoard] = useState(savedBoard);
  const [solution, setSolution] = useState(savedSolution);
  const [highlightedNumber, setHighlightedNumber] = useState(null);
  const [highlightedArea, setHighlightedArea] = useState([]);

  if (board.length > 0 && board.every(row => row.every(value => value > 0))) {
    confetti();
  }  

  function selectArea(rowIndex, colIndex) {
    setHighlightedArea([rowIndex, colIndex]);
  }
  
  async function fetchBoard() {
    const res = await fetch("https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:2){grids{value,solution}}}")
    const data = await res.json();
    setBoard(() => {
      const board = data.newboard.grids[0].value;
      localStorage.setItem('board', JSON.stringify(board));
      return board;
    });
    setSolution(() => {
      const solution = data.newboard.grids[0].solution;
      localStorage.setItem('solution', JSON.stringify(solution));
      return solution;
    });
  }

  useEffect(() => {
    if (savedBoard.length === 0 || savedSolution.length === 0) {
      fetchBoard();
    }
  }, []);

  function handleCorrect(rowIndex, colIndex, value) {
    setBoard(prev => {
      let newArr = Array.from(prev);
      newArr[rowIndex][colIndex] = value;
      return newArr;
    })
  }
  
  function determineFilledClassName(cell, rowIndex, colIndex) {
    return clsx(
      `cell row-${rowIndex} col-${colIndex}`,
      (rowIndex === highlightedArea[0] || colIndex === highlightedArea[1]) && "area",
      cell === highlightedNumber && "highlight"
    );    
  }

  function determineEmptyClassName(rowIndex, colIndex) {
    return clsx(
      `cell row-${rowIndex} col-${colIndex}`,
      (rowIndex === highlightedArea[0] || colIndex === highlightedArea[1]) && "area");
  }

  return (
    <div onClick={() => {
      setHighlightedArea([]);
      setHighlightedNumber(null)
      }} 
      className='container'>
      <div className='sudoku-table'>
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          cell != 0 ? (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setHighlightedNumber(prev => prev == cell ? null : cell);
                selectArea(rowIndex, colIndex);}}
              key={nanoid()}
              className={determineFilledClassName(cell, rowIndex, colIndex)}
            >
              {cell}
            </div>
          ) : (
            <div 
              key={`${rowIndex}-${colIndex}`}
              className={determineEmptyClassName(rowIndex, colIndex)}
              onClick={(e) => {
              selectArea(rowIndex, colIndex);
              e.stopPropagation();
            }}>
              <EmptyCell
                solution={solution}
                rowIndex={rowIndex}
                colIndex={colIndex}
                handleCorrect={handleCorrect}
              />
            </div>
          )))}
      </div>
      <button onClick={fetchBoard} className='info'>New Game</button>
    </div>
  )
}

export default Sudoku
