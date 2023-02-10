var express = require('express');
var router = express.Router();

var testToken = 'tokenTest123';
var acceptedShopId = '5';

/*
These are the cards I would be getting from the hypothetical database
I decided they would only be counted once if there's only one instance of the number to stay as close as possible to
the initial list I was given*/
var possibleCards = [
    15, 20, 20, 22, 25, 26, 35, 35, 45
];
// leaving that open-ended could create performance issues. Limited to 2 here to stay close to original.
var maxCombinationSize = 2;
//This function lists all the possible combinations given a list of possible cards
function generateCombinations(possibleCards, selectedCards = [], result = []) {
    //No point in an 'empty' combination
    if (selectedCards.length >= 1 && selectedCards.length <= maxCombinationSize) {
        result.push({ value: selectedCards.reduce((sum, value) => sum + value, 0), cards: selectedCards });
    }

    for (let i = 0; i < possibleCards.length; i++) {
        const card = possibleCards[i];
        generateCombinations(possibleCards.slice(i + 1), selectedCards.concat(card), result);
    }

    /*
    I had the result be sorted based on value to fix an error I was getting because of the way lower equal and upper
    indexes are determined in the router.get
    */
    return result.sort((a, b) => a.value - b.value);
}


var possibleCombinations = generateCombinations( possibleCards )

/*var possibleCombinations = [
    { value: 20, cards: [20] },
    { value: 22, cards: [22] },
    { value: 25, cards: [25] },
    { value: 26, cards: [26] },
    { value: 35, cards: [35] },
    { value: 40, cards: [20, 20] },
    { value: 40, cards: [15, 25] },
    { value: 42, cards: [22, 20] },
    { value: 45, cards: [45] },
    { value: 51, cards: [26, 25] },
    { value: 55, cards: [35, 20] },
    { value: 57, cards: [35, 22] },
    { value: 70, cards: [35, 35] }
];
*/

/* GET home page. */
router.get('/shop/:shopId/search-combination', function(req, res, next) {
  if (req.header('Authorization') !== testToken) {
    res.status(401).json({ status: 401, message: 'Invalid token!' });
    return;
  }

  if (req.params.shopId !== acceptedShopId) {
    res.status(400).json({ status: 400, message: 'Shop not found!' });
    return;
  }

  var desiredAmount = req.query.amount;
  if (desiredAmount === undefined || isNaN(desiredAmount)) {
    res.status(400).json({ status: 400, message: 'Invalid amount!' });
    return;
  }

  desiredAmount = +desiredAmount;

  var lowerIndex;
  var equalIndex;
  var upperIndex;
  possibleCombinations.forEach((combination, index) => {
    if (combination.value <= desiredAmount) {
      lowerIndex = index;
    }
    if (combination.value >= desiredAmount && upperIndex === undefined) {
      upperIndex = index;
    }
    if (combination.value === desiredAmount) {
      equalIndex = index;
    }
  });
  res.json({
    equal: equalIndex !== undefined ? possibleCombinations[equalIndex] : undefined,
    floor: lowerIndex !== undefined ? possibleCombinations[lowerIndex] : undefined,
    ceil: upperIndex !== undefined ? possibleCombinations[upperIndex] : undefined
  });
});

module.exports = router;
