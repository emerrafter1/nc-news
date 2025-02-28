const db = require("../../db/connection");

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
