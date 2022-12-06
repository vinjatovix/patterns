const validateNumber = number => {
  if (isNaN(+number)) {
    throw new Error(`"${number}" is not a number`);
  }

  return +number;
};

module.exports = { validateNumber };
