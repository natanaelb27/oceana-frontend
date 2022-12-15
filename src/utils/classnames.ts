const ClassNames = (classNames: []) => {
  let classString = '';
  classNames.forEach((data) => {
    classString += ` ${data}`;
  });
  return classString;
};

export default ClassNames;
