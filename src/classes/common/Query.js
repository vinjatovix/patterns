class Query {
  constructor(name, whatToQuery, defaultResult) {
    this.name = name;
    this.whatToQuery = whatToQuery;
    this.result = defaultResult;
  }
}

module.exports = Query;
