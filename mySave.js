module.exports = mySave;

function mySave(item) {
  item.save().catch((error) => {
    console.log(`save error: ${error}`);
  });
}
