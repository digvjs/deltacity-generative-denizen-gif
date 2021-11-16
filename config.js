const description = "Denizens are the lifeblood of Delta City. Each one unique, and each one deadly.";

const baseUri = "ipfs://QmYoppeaGY41GeNZmk8CTjzy1ncmXyUmKnQVBmr52RoeKG";

const layersOrder = [
  // { name: "Backgrounds" },
  { name: "Head" },
  { name: "Left Arm" },
  { name: "Body" },
  { name: "Eyes" },
  { name: "Legs" },
  { name: "Right Arm" },
];


const dimensions = {
  width: 150,
  height: 150,
};

const uniqueDnaTorrance = 10000;

const editionSize = 5;

const rarityDelimiter = '-';

const namePrefix = 'Denizen';

const set = 'OCP Farm';

// GIF settings
const numOfFramesForGif = 90;
const framesDelay = 33.33;
const gifQuality = 100  // 1-highest, 30- lowest, 10-default
// gifQuality = 1 - creation time - 103442 ms
// gifQuality = 2 - creation time -
// gifQuality = 3 - creation time - 46536 ms
// gifQuality = 4 - creation time -
// gifQuality = 5 - creation time - 29870 ms
// gifQuality = 6 - creation time -
// gifQuality = 7 - creation time -
// gifQuality = 8 - creation time -
// gifQuality = 9 - creation time -
// gifQuality = 10 - creation time - 17978 ms

module.exports = {
  description,
  baseUri,
  layersOrder,
  dimensions,
  uniqueDnaTorrance,
  editionSize,
  rarityDelimiter,
  namePrefix,
  set,
  numOfFramesForGif,
  framesDelay,
  gifQuality,
}