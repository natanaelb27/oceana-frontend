import { useEffect, useState } from 'react';
import { TILE_SIZE } from '../../constants';
import { TilesContainer } from './style';

type TileProps = {
  // index: number;
  size: number;
};
const Tile = ({ size }: TileProps) => (
  <div
    className={`w-[${size}px] h-[${size}px] border border-base-100 bg-accent`}
  />
);

const Tiles = () => {
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
    <TilesContainer id='container'>
      {Array.from(Array(quantity)).map((_, index) => (
        <Tile key={index} size={TILE_SIZE} />
      ))}
    </TilesContainer>
  );
};

export default Tiles;
