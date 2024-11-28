const factions = {
    red: { colour: '#FF0000' },
    blue: { colour: '#0000FF' },
};

function getFactionColour(faction) {
    return factions[faction]?.colour || '#CCCCCC'; // Default unclaimed colour
}

module.exports = { factions, getFactionColour };
