module.exports = exportModel;

// function to export custom route model to global scope
function exportModel(localModel, globalModel) {
  globalModel = localModel;
  console.log(globalModel);
  return globalModel;
}
