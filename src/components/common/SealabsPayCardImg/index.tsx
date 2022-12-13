type SealabsPayCardImgProps = {
  className?: string;
};
const SealabsPayCardImg = ({ className }: SealabsPayCardImgProps) => {
  return (
    <img
      className={className}
      src='https://slp.air-sipp.com/user/static/icon/mastercard.svg'
      alt='Sealabs Pay Card Image'
    />
  );
};

export default SealabsPayCardImg;
