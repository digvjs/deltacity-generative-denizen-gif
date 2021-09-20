const Canvas = require('canvas')
const GifEncoder = require('gifencoder')
const fs = require('fs')
const {basePath} = require('./PathHelper')
const buildDir = `${basePath}/build`
const {dimensions} = require('../config')

class GifGenerator {
    constructor () {
        this.setUpBuildDir();
        this.initCanvas()
        this.initGifEncoder()
    }

    setUpBuildDir() {
        if (fs.existsSync(buildDir)) {
            fs.rmdirSync(buildDir, { recursive: true });
        }
        fs.mkdirSync(buildDir);
    }

    initCanvas() {
        this.canvas = new Canvas.createCanvas()
        this.canvas.height = dimensions.height
        this.canvas.width = dimensions.width
        this.context = this.canvas.getContext('2d')
    }

    initGifEncoder() {
        this.gifEncoder = new GifEncoder(dimensions.width, dimensions.height)
        this.gifEncoder.setQuality(100)
        this.gifEncoder.setRepeat(0)
        this.gifEncoder.setDelay(200)
    }

    drawCanvas(color) {
        // selectedLayers.forEach((layer) => {
        //     this.context.drawImage(layer, 0, 0, WIDTH, HEIGHT);
        // });
        this.context.fillStyle = color
        this.context.fillRect(0, 0, dimensions.width, dimensions.height)
        this.gifEncoder.addFrame(this.context)
    }

    create(filename) {
        //
        this.gifEncoder.createReadStream().pipe(fs.createWriteStream(`${buildDir}/${filename}`))
        this.gifEncoder.start()
        this.drawCanvas('red');
        this.drawCanvas('blue');
        this.drawCanvas('yellow');
        this.drawCanvas('orange');
        this.drawCanvas('green');
        this.drawCanvas('purple');
        this.gifEncoder.end()
    }
}

const createGif = (filename) => {
    const gifGenerator = new GifGenerator();
    gifGenerator.create(filename);
}

createGif('happy.gif');


// module.exports = createGif;