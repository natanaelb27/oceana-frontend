type SealabsPayImgProps = {
  className?: string;
};
const SealabsPayImg = ({ className }: SealabsPayImgProps) => {
  return (
    <img
      className={className}
      src='https://slp.air-sipp.com/user/static/brand/sealabs.svg'
      alt='Sealabs Pay Image'
    />
  );
};

export default SealabsPayImg;
