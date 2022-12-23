type SectionHeadingProps = {
  title: string;
  description?: string;
  icon?: JSX.Element;
};

const SectionHeading = ({ title, description, icon }: SectionHeadingProps) => {
  return (
    <div className='flex gap-4 items-center'>
      {icon !== undefined && (
        <div className='text-primary text-6xl'>{icon}</div>
      )}
      <div>
        <h5 className='font-bold text-2xl text-primary'>
          <span className='flex gap-4'>{title}</span>
        </h5>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
};

export default SectionHeading;
