const ClassNames = (classNames: string[]): string => {
  let classString = '';
  classNames.forEach((data) => {
    classString += ` ${data}`;
  });
  return classString;
};

export default ClassNames;
