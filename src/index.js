const Canvas = require('canvas')
const GifEncoder = require('gifencoder')
const { basePath } = require('../lib/PathHelper')
const { layersSetup, constructLayerToDna } = require('./layers')
const buildDir = `${basePath}/build`
const fs = require('fs')
const {
    layersOrder,
    dimensions,
    baseUri,
    description,
    uniqueDnaTorrance,
    editionSize,
    numOfFramesForGif,
} = require('../config.js')


const createDna = (_layers) => {
    let randNum = [];
    _layers.forEach((layer) => {
        let num = Math.floor(Math.random() * layer.elements.length);
        randNum.push(num);
    });

    return randNum;
};

const isDnaUnique = (_DnaList = [], _dna = []) => {
    let foundDna = _DnaList.find((i) => i.join("") === _dna.join(""));
    return foundDna == undefined ? true : false;
};

const idToString = (id) => {
    id = id.toString();
    if (id.length  == 1) {
        id = "0" + id.toString()
    } else if(id === 0) {
        id = "00"
    }

    return id;
}

/**
 * Script execution starts here
 */
const startExecution = async () => {
    let editionIndex = 1;
    let failedCount = 0;
    let dnaList = [];
    const layers = await layersSetup(layersOrder);

    while (editionIndex <= editionSize) {
        let newDna = createDna(layers);

        if (isDnaUnique(dnaList, newDna)) {
            let results = constructLayerToDna(newDna, layers);
            // console.log(results);
            let loadedElements = [];

            let canvas = new Canvas.createCanvas()
            canvas.height = dimensions.height
            canvas.width = dimensions.width
            let context = canvas.getContext('2d')

            let gifEncoder = new GifEncoder(dimensions.width, dimensions.height)
            gifEncoder.setQuality(100)
            gifEncoder.setRepeat(0)
            gifEncoder.setDelay(50)

            console.log(`Creating edition ${editionIndex} with DNA ${newDna.join(' ')}`);

            gifEncoder.createReadStream().pipe(fs.createWriteStream(`${buildDir}/${editionIndex}.gif`))
            gifEncoder.start()
            for (let i = 0; i < numOfFramesForGif; i++) {
                id = idToString(i);
                // context.fillStyle = "yellow"
                context.fillRect(0, 0, dimensions.width, dimensions.height)
                for (let j = 0; j < results.length; j++){
                    // let loadedImg = await Canvas.loadImage(`${results[j].selectedElement.path}/Comp 1_000${id}.png`)
                    let loadedImg = await Canvas.loadImage(`${results[j].selectedElement.path}/${results[j].name.toLowerCase()}_000${id}.png`)
                    context.drawImage(loadedImg, 0, 0, dimensions.width, dimensions.height)
                }
                gifEncoder.addFrame(context)
            }
            gifEncoder.end()

            //
            //


            dnaList.push(newDna);
            editionIndex++;

        } else {
            console.log("DNA exists!");
            failedCount++;
            if (failedCount >= uniqueDnaTorrance) {
                console.log(
                    `You need more layers or elements to generate ${editionSize} artworks!`
                );
                process.exit();
            }
        }
    }
}

module.exports = {
    startExecution,
}