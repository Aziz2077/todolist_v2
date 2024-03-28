module.exports = myDeleteById;

function myDeleteById(model, item) {
  model
    .findByIdAndDelete(item)
    .then(console.log("deleted item successfully"))
    .catch((error) => {
      console.log(`findByIdAndDelete error: ${error}`);
    });
}
