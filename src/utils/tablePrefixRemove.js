function removeTablePrefixes(results) {
  return results.map((item) => {
    const newItem = {};
    for (const key in item) {
      if (key.includes(".")) {
        const newKey = key.split(".")[1];
        newItem[newKey] = item[key];
      } else {
        newItem[key] = item[key];
      }
    }
    return newItem;
  });
}
export default removeTablePrefixes;
