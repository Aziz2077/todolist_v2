module.exports = exists;

// function to check if collection exists in data base
function exists(collections, collectionName) {
  for (let i = 0; i < collections.length; i++) {
    if (collectionName === collections[i].name) {
      return true;
    }
  }
  return false;
}
