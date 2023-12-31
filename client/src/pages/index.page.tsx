import { useEffect, useState } from 'react';
import { apiClient } from 'src/utils/apiClient';
import { returnNull } from 'src/utils/returnNull';
import type { BoardArr } from '../../../server/useCase/boardUseCase';
import styles from './index.module.css';

const Home = () => {
  const [board, setBoard] = useState<BoardArr>([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 3, 0, 0, 0],
    [0, 0, 0, 1, 2, 3, 0, 0],
    [0, 0, 3, 2, 1, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [turnColor, setTurnColor] = useState(1);

  const fetchBoard = async () => {
    const board = await apiClient.board.$get().catch(returnNull);

    if (board !== null) setBoard(board);
  };

  const createBoard = async (x: number, y: number, turn: number) => {
    if (board[y][x] === 3) {
      const a = await apiClient.board.post({ body: { board, x, y, turn } });
      console.log(a.body.board);
      setBoard(a.body.board);
      setTurnColor(3 - a.body.turn);
    }
  };

  const resetGame = async () => {
    const b = await apiClient.newboard.post({ body: { board } });
    console.log(b);
    setBoard(b.body);
    setTurnColor(1);
  };

  const startGame = async () => {
    await apiClient.startboard.post({ body: { board } });
  };

  const countCandidates = () => {
    let candidate = 0;
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        if (board[y][x] === 3) {
          candidate++;
        }
      }
    }
    return candidate;
  };

  let timeoutcounts = 0;
  const candidate = countCandidates();
  const endGame = async () => {
    if (candidate === 0) {
      timeoutcounts++;
      alert('ゲーム終了');

      const b = await apiClient.newboard.post({ body: { board } });
      console.log(b);
      setBoard(b.body);
      setTurnColor(1);
    }
  };

  endGame();
  // setTimeout(endGame, 3000);

  // setTimeout(function () {
  //   if (timeoutcounts === 0) {
  //     endGame();
  //   }
  // }, 3000);

  useEffect(() => {
    fetchBoard();
    const intervalId = setInterval(fetchBoard, 100);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div
              key={`${x}-${y}`}
              className={styles.cell}
              onClick={() => createBoard(x, y, turnColor)}
            >
              {color !== 0 && (
                <div
                  className={styles.stone}
                  style={{
                    background: color === 3 ? '#adff2f' : color === 1 ? '#000' : '#fff',
                  }}
                />
              )}
            </div>
          ))
        )}
      </div>
      <button className={styles.button} onClick={startGame}>
        ゲームスタート
      </button>
      <button className={styles.button} onClick={resetGame}>
        ゲーム終了
      </button>
    </div>
  );
};

export default Home;
