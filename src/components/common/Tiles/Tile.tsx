import anime from 'animejs';
import { DELAY_ANIMATION } from '../../../constants';
import { StyledTile } from './style';

// const colors = [
//   'rgb(229, 57, 53)',
//   'rgb(253, 216, 53)',
//   'rgb(244, 81, 30)',
//   'rgb(76, 175, 80)',
//   'rgb(33, 150, 243)',
//   'rgb(156, 39, 176)',
// ];

// let count = -1;
let toggled = false;

type TileProps = {
  index: number;
  columns: number;
  rows: number;
  size: number;
};
const Tile = ({ index, columns, rows, size }: TileProps) => {
  const handleClick = (index: number) => {
    toggled = !toggled;
    // count = count + 1;

    anime({
      targets: '.tile',
      // backgroundColor: colors[count & (colors.length - 1)],
      opacity: toggled ? 0 : 1,
      delay: anime.stagger(DELAY_ANIMATION, {
        grid: [columns, rows],
        from: index,
      }),
    });
  };
  return (
    <StyledTile
      className={`tile w-[${size}px] h-[${size}px]`}
      onClick={() => handleClick(index)}
    />
  );
};

export default Tile;
