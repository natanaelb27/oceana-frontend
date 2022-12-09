import { ReactNode, useEffect, useState } from 'react';
import { MOBILE_WIDTH, TILE_SIZE } from '../../../constants';
import { TilesContainer } from './style';
import Tile from './Tile';

type TilesProps = {
  children?: ReactNode;
};

const Tiles = ({ children }: TilesProps) => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight);
  const size = windowWidth > MOBILE_WIDTH ? TILE_SIZE : TILE_SIZE / 2;
  const columns = Math.floor(windowWidth / size);
  const rows = Math.floor(windowHeight / size);
  const quantity = columns * rows;

  useEffect(() => {
    const containerTiles = document.getElementById('container-tiles');
    containerTiles?.style.setProperty('--columns', String(columns));
    containerTiles?.style.setProperty('--rows', String(rows));

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
      <TilesContainer id='container-tiles'>
        {Array.from(Array(quantity)).map((_, index) => (
          <Tile
            key={index}
            index={index}
            columns={columns}
            rows={rows}
            size={size}
          />
        ))}
      </TilesContainer>
      {children}
    </>
  );
};

export default Tiles;
