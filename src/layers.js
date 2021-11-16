const fs = require('fs')
const { basePath } = require('../lib/PathHelper')
const layersDir = `${basePath}/layers`;


const getElements = (path) => {
    return fs
        .readdirSync(path)
        .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
        .map((i) => {
            let parsedName = i.split('-')
            return {
                name: parsedName[3].trim(),
                parent: parsedName[1].trim(),
                elements_directory_name: i,
                path: `${path}${i}`,
            }
        })
};

const layersSetup = (layersOrder) => {
    const layers = layersOrder.map((layerObj, index) => ({
        id: index,
        name: layerObj.name,
        elements: getElements(`${layersDir}/${layerObj.name}/`),
    }))

    return layers
};

const constructLayerToDna = (_dna = [], _layers = []) => {
    let mappedDnaToLayers = _layers.map((layer, index) => {
        let selectedElement = layer.elements[_dna[index]];
        return {
            name: layer.name,
            selectedElement: selectedElement,
        };
    });
    return mappedDnaToLayers;
};

module.exports = {
    layersSetup,
    constructLayerToDna,
}