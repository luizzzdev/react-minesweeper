import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { useBoard, isBomb, generateAroundFields } from './minesweeper';

function Line({ children }) {
  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      {children}
    </div>
  );
}

function Cell({ children, cell, onClick, onMarkAsBomb }) {
  return (
    <div
      style={{
        width: '60px',
        height: '60px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #ccc',
        margin: '5px',
        cursor: 'pointer',
        backgroundColor: cell.isOpen ? 'skyblue' : '',
      }}
      onClick={() => onClick(cell)}
      onContextMenu={e => {
        e.preventDefault();
        onMarkAsBomb(cell);
      }}
    >
      {children}
    </div>
  );
}

const isNextToCell = (previousBoardCell, cell) => {
  const aroundCell = generateAroundFields(cell.line, cell.column)
  if(previousBoardCell.bombsAround === 0 && cell.bombsAround === 0) {
    // debugger
  }
  return aroundCell.some((around) => around[0] === previousBoardCell.line && previousBoardCell.column === around[1])
}

const isZeroAndNextToSelectedCell = (previousBoardCell, cell) => {
  const isZeroAround = cell.bombsAround === 0
  return cell.bombsAround === 0 && previousBoardCell.bombsAround === 0 && isNextToCell(previousBoardCell, cell)
}

const getCellState = cell => {
  return cell.isBomb? 'Bomb' : cell.bombsAround

  if (cell.markedAsBomb) return 'Bomb';

  if (!cell.isOpen) return '';

  if (cell.isOpen) return cell.bombsAround;
};

function App() {
  const { board, bombs, setBoardState } = useBoard(6);
  const [didLoose, setDidLoose] = useState(false);

  const selectCell = cell => {
    if (cell.markedAsBomb) return;

    const cellIsBomb = isBomb(cell.line, cell.column, bombs);

    if (cellIsBomb) {
      setDidLoose(true);
      return;
    }


    setBoardState(previousBoard => {
      return previousBoard.map(line => {
        return line.map(previousBoardCell => {
          const isTheCellSelected =
            previousBoardCell.line === cell.line &&
            previousBoardCell.column === cell.column;

            if(isZeroAndNextToSelectedCell(previousBoardCell, cell)) {
              console.log(previousBoardCell)
            }
          return {
            ...previousBoardCell,
            isOpen: isTheCellSelected || previousBoardCell.isOpen || isZeroAndNextToSelectedCell(previousBoardCell, cell),
          };
        });
      });
    });
  };

  const markAsBomb = cell => {
    setBoardState(previousBoard => {
      return previousBoard.map(line => {
        return line.map(previousBoardCell => {
          const isTheCellSelected =
            previousBoardCell.line === cell.line &&
            previousBoardCell.column === cell.column;

          const markedAsBomb = isTheCellSelected
            ? !previousBoardCell.markedAsBomb
            : previousBoardCell.markedAsBomb;
          return {
            ...previousBoardCell,
            markedAsBomb,
          };
        });
      });
    });
  };

  return (
    <div className="App">
      <h1>{didLoose ? 'You loose' : 'Keep trying'}</h1>

      <div style={{ display: 'inline-block' }}>
        {!didLoose &&
          board.map(line => {
            return (
              <Line>
                {line.map(cell => {
                  return (
                    <Cell
                      cell={cell}
                      onClick={selectCell}
                      onMarkAsBomb={markAsBomb}
                    >
                      {getCellState(cell)}
                    </Cell>
                  );
                })}
              </Line>
            );
          })}
      </div>
    </div>
  );
}

export default App;
