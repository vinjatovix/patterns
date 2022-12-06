const chance = require("chance").Chance();

const arrayElement = (array = []) => chance.pickone(array);

const description = (words = 5) => chance.sentence({ words });

const name = () => chance.sentence().replace(/\s|\./g, "-");

const uuid = (isV4 = true) => chance.guid({ version: isV4 ? 4 : 5 });

const word = (length = 10) => chance.word({ length });

module.exports = {
  arrayElement,
  description,
  name,
  uuid,
  word
};
