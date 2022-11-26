import { ReactNode, useEffect, useState } from 'react';
import anime from 'animejs/lib/anime.es.js';
import { DELAY_ANIMATION, TILE_SIZE } from '../../constants';
import { TilesContainer } from './style';

const colors = [
  'rgb(229, 57, 53)',
  'rgb(253, 216, 53)',
  'rgb(244, 81, 30)',
  'rgb(76, 175, 80)',
  'rgb(33, 150, 243)',
  'rgb(156, 39, 176)',
];
let count = -1;

type TileProps = {
  index: number;
  columns: number;
  rows: number;
  size: number;
};
const Tile = ({ index, columns, rows, size }: TileProps) => {
  const handleClick = (index: number) => {
    count = count + 1;

    anime({
      targets: '.tile',
      backgroundColor: colors[count & (colors.length - 1)],
      delay: anime.stagger(DELAY_ANIMATION, {
        grid: [columns, rows],
        from: index,
      }),
    });
  };
  return (
    <div
      className={`tile w-[${size}px] h-[${size}px] bg-accent`}
      onClick={() => handleClick(index)}
    />
  );
};

type TilesProps = {
  children: ReactNode;
};
const Tiles = ({ children }: TilesProps) => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);
  const columns = Math.floor(windowWidth / TILE_SIZE);
  const rows = Math.floor(windowHeight / TILE_SIZE);
  const quantity = columns * rows;
  const container = document.getElementById('container');
  container?.style.setProperty('--columns', String(columns));
  container?.style.setProperty('--rows', String(rows));

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    handleResize;
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return (
    <>
      <TilesContainer id='container'>
        {Array.from(Array(quantity)).map((_, index) => (
          <Tile
            key={index}
            index={index}
            columns={columns}
            rows={rows}
            size={TILE_SIZE}
          />
        ))}
      </TilesContainer>
      {children}
    </>
  );
};

export default Tiles;
