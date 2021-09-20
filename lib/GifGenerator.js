const Canvas = require('canvas')
const GifEncoder = require('gifencoder')
const fs = require('fs')
const {basePath} = require('./PathHelper')
const buildDir = `${basePath}/build`
const {dimensions} = require('../config')
const delay = 50;
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
        this.gifEncoder.setDelay(delay)
    }

    async drawCanvas(color, id) {
        // selectedLayers.forEach((layer) => {
        //     this.context.drawImage(layer, 0, 0, WIDTH, HEIGHT);
        // });
        id = id.toString();
        if (id.length  == 1) {
            id = "0" + id.toString()
        } else if(id === 0) {
            id = "00"
        }

        let body = await Canvas.loadImage(`${basePath}/layers/Body/Comp 1_000${id}.png`)
        let hand = await Canvas.loadImage(`${basePath}/layers/Hands/Comp 1_000${id}.png`)
        let head = await Canvas.loadImage(`${basePath}/layers/Head/Comp 1_000${id}.png`)
        let legs = await Canvas.loadImage(`${basePath}/layers/Legs/Legs_000${id}.png`)

        this.context.fillStyle = color
        this.context.fillRect(0, 0, dimensions.width, dimensions.height)
        this.context.drawImage(body, 0, 0, dimensions.width, dimensions.height)
        this.context.drawImage(hand, 0, 0, dimensions.width, dimensions.height)
        this.context.drawImage(head, 0, 0, dimensions.width, dimensions.height)
        this.context.drawImage(legs, 0, 0, dimensions.width, dimensions.height)
        this.gifEncoder.addFrame(this.context)
    }

    async create(filename) {
        //
        this.gifEncoder.createReadStream().pipe(fs.createWriteStream(`${buildDir}/${filename}`))
        this.gifEncoder.start()
        for (let i = 0; i < 90; i++) {
            await this.drawCanvas('yellow', i);
        }
        // this.drawCanvas('blue');
        // this.drawCanvas('red');
        // this.drawCanvas('orange');
        // this.drawCanvas('green');
        // this.drawCanvas('purple');
        this.gifEncoder.end()
    }
}

const createGif = (filename) => {
    const gifGenerator = new GifGenerator();
    gifGenerator.create(filename);
}

createGif('happy.gif');


// module.exports = createGif;