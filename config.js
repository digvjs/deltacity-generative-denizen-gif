const description = "This is the description of your NFT project.";

const baseUri = "https://google.com/nft";


// const layersOrder = [
//   { name: "Legs" },
//   { name: "Body" },
//   { name: "Head" },
//   { name: "Hands" },
// ];

const layersOrder = [
  // { name: "Backgrounds" },
  { name: "Head" },
  { name: "Left Arm" },
  { name: "Body" },
  { name: "Eyes" },
  { name: "Right Arm" },
  { name: "Legs" },
];


const dimensions = {
    width: 250,
    height: 250,
};

const uniqueDnaTorrance = 10000;

const editionSize = 10;

const numOfFramesForGif = 90;

module.exports = {
    description,
    baseUri,
    layersOrder,
    dimensions,
    uniqueDnaTorrance,
    editionSize,
    numOfFramesForGif,
}