const db = require("../../db/connection");
const format = require("pg-format");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createLookupObject = (data, targetKey, targetValue) => {
  const lookupObject = {};

  data.forEach((dataRow) => {
    lookupObject[dataRow[targetKey]] = dataRow[targetValue];
  });

  return lookupObject;
};

exports.checkExists = (table, column, value) => {
  const query = format("SELECT * FROM %I WHERE %I = $1;", table, column);
  return db.query(query, [value]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return true;
  });
};
