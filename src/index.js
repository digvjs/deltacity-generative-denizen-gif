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
    rarityDelimiter,
    namePrefix,
    set,
    numOfFramesForGif,
    framesDelay,
    gifQuality
} = require('../config.js')
const {
    classesMapping
} = require('../constants.js')
const { config } = require('process')

var metadataList = [];
var attributesList = [];

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
    if (id.length == 1) {
        id = "0" + id.toString()
    } else if (id === 0) {
        id = "00"
    }

    return id;
}

const getBodyLayer = (layers) => {
    for (let i = 0; i < layers.length; i++) {
        if (layers[i].name == 'Body') {
            return layers[i];
        }
    }
    return {};
}

const addAttributes = (_element) => {
    if (_element.name != 'Legs') {
        let selectedElement = _element.selectedElement;
        if (selectedElement.name != 'none') {
            attributesList.push({
                trait_type: _element.name,
                value: selectedElement.name,
            });
        }
    }
};

const addMetadata = (_dna, _edition) => {
    let tempMetadata = {
        name: `${namePrefix} #${_edition}`,
        description: description,
        image: `${baseUri}/${_edition}.png`,
        edition: _edition,
        attributes: attributesList,
    };
    metadataList.push(tempMetadata);
    attributesList = [];
};

const saveMetaDataSingleFile = (_editionCount) => {
    fs.writeFileSync(
        `${buildDir}/${_editionCount}.json`,
        JSON.stringify(metadataList.find((meta) => meta.edition == _editionCount))
    );
};

const updateDNAFile = (newDNA) => {
    let dnaPath = `${basePath}/dna`
    if (fs.existsSync(dnaPath)) {
        fs.rmdirSync(dnaPath, { recursive: true });
    }
    fs.mkdirSync(dnaPath)

    fs.writeFileSync(
        `${dnaPath}/dna.json`,
        JSON.stringify(newDNA)
    )
}

const getBgPath = (layers) => {
    let bodyLayer = getBodyLayer(layers);
    return `${basePath}/layers/Background/${classesMapping[bodyLayer.selectedElement.parent]}.png`;
    // for (let i = 0; i < layers.length; i++) {
    //     if (layers[i].name == 'Body') {
    //         let nameElements = parsedName(layers[i].selectedElement.name);
    //         return `${basePath}/layers/Background/${classesMapping[layers[i].selectedElement.parent]}.png`;
    //     }
    // }
}

/**
 * Script execution starts here
 */
const startExecution = async () => {
    let editionIndex = 20;
    let counter = 0;
    let failedCount = 0;
    let dnaList = JSON.parse(fs.readFileSync(`${basePath}/dna/dna.json`, 'utf8'));
    // console.log('dnaList', dnaList);
    const layers = await layersSetup(layersOrder);
    // console.log(layers);

    while (counter < editionSize) {
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
            gifEncoder.setQuality(gifQuality)
            gifEncoder.setRepeat(0)
            gifEncoder.setDelay(framesDelay)

            console.log(`Creating edition ${editionIndex} with DNA ${newDna.join(' ')}`);

            let t1 = new Date();

            gifEncoder.createReadStream().pipe(fs.createWriteStream(`${buildDir}/${editionIndex}.gif`))
            gifEncoder.start()

            let bgImagePath = getBgPath(results);

            for (let i = 0; i < numOfFramesForGif; i++) {
                id = idToString(i);
                // context.fillStyle = "yellow"
                context.fillRect(0, 0, dimensions.width, dimensions.height)

                // Draw background
                let bgImg = await Canvas.loadImage(bgImagePath)
                context.drawImage(bgImg, 0, 0, dimensions.width, dimensions.height)


                for (let j = 0; j < results.length; j++) {
                    // let loadedImg = await Canvas.loadImage(`${results[j].selectedElement.path}/Comp 1_000${id}.png`)
                    let loadedImg = await Canvas.loadImage(`${results[j].selectedElement.path}/${results[j].name.toLowerCase()}_000${id}.png`)
                    context.drawImage(loadedImg, 0, 0, dimensions.width, dimensions.height)

                    if (i === 0) {
                        addAttributes(results[j])
                    }
                }
                gifEncoder.addFrame(context)
            }
            gifEncoder.end()

            let t2 = new Date();
            let dif = t2.getTime() - t1.getTime();
            console.log(`Generation time : ${dif} ms`);

            // Add addtional attributes to metadata
            let bodyLayer = getBodyLayer(results)
            attributesList.push({ trait_type: "Background", value: classesMapping[bodyLayer.selectedElement.parent] });
            attributesList.push({ trait_type: "Set", value: set });
            attributesList.push({ trait_type: "Class", value: classesMapping[bodyLayer.selectedElement.parent] });

            // Metdata
            addMetadata(newDna, editionIndex);
            saveMetaDataSingleFile(editionIndex);

            dnaList.push(newDna);
            editionIndex++;
            counter++;

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

    // update DNA file
    // updateDNAFile(dnaList);
}

module.exports = {
    startExecution,
}