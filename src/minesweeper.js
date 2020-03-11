import { useState } from 'react';

const generateXAndY = size => [
  Math.floor(Math.random() * size),
  Math.floor(Math.random() * size),
];

const isInvalidXAndY = (coordinates, x, y) => {
  return coordinates.some(
    coordinate => coordinate[0] === x && coordinate[1] === y
  );
};

const generateBombs = (size, numberOfBombs) => {
  const bombs = [];

  for (let i = 0; i < numberOfBombs; i++) {
    let [x, y] = generateXAndY(size);

    while (isInvalidXAndY(bombs, x, y)) {
      const newResult = generateXAndY(size);
      x = newResult[0];
      y = newResult[1];
    }

    bombs.push([x, y]);
  }

  return bombs;
};

const isBomb = (line, column, bombs) =>
  bombs.some(bomb => bomb[0] === line && bomb[1] === column);

const generateAroundFields = (line, column) => {
  return [
    [line - 1, column + 1],
    [line, column + 1],
    [line + 1, column + 1],
    [line - 1, column],
    [line + 1, column],
    [line - 1, column - 1],
    [line, column - 1],
    [line + 1, column - 1],
  ];
};

const generateBombsAround = (line, column, bombs) => {
  const aroundFields = generateAroundFields(line, column);
  let count = 0;

  aroundFields.forEach(aroundField => {
    if (isBomb(aroundField[0], aroundField[1], bombs)) {
      count += 1;
    }
  });

  return count;
};

const generateCell = (line, column, bombs) => {
  return {
    line,
    column,
    isBomb: isBomb(line, column, bombs),
    open: false,
    bombsAround: generateBombsAround(line, column, bombs),
    markedAsBomb: false,
  };
};

const useBoard = (size = 5) => {
  const [bombs] = useState(generateBombs(size, size * size * 0.3));

  const board = [];

  for (let x = 0; x < size; x++) {
    const line = [];
    for (let y = 0; y < size; y++) {
      const cell = generateCell(x, y, bombs);
      line.push(cell);
    }
    board.push(line);
  }

  const [boardState, setBoardState] = useState(board);

  return {
    board: boardState,
    setBoardState,
    bombs,
  };
};

const printBoard = board => {
  board.forEach(line => {
    let lineStr = '';
    line.forEach(column => {
      lineStr += column.isBomb ? ' X ' : ' - ';
    });
    console.log(lineStr);
  });
};

export { useBoard, isBomb, generateAroundFields };
