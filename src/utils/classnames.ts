const ClassNames = (classNames: string[]): string => {
  let classString = '';
  classNames.forEach((data) => {
    console.log(data);
    classString += ` ${data}`;
  });
  return classString;
};

export default ClassNames;
