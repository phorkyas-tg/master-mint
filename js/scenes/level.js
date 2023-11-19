const TILE_WIDTH = 64;
const TILE_HEIGHT = 64;


class Level extends Phaser.Scene
{
    constructor (key)
    {
        super({ "key": key });

        
    }

    init (data)
    {
        this.timer = null;
        this.updateTime = 120
        this.animationTime = 500
        this.candrag = false;
        this.numberOfBeans = 6
        this.moves = 1
        this.gameOver = false

        this.collect = {"numberOfCollectibles": 3, 
                        "0": {"spriteIndex": 0, "collected": 0, "collect": 200, "bean": null, "txt": null},
                        "1": {"spriteIndex": 1, "collected": 0, "collect": 200, "bean": null, "txt": null},
                        "2": {"spriteIndex": 2, "collected": 0, "collect": 200, "bean": null, "txt": null}}
    }

    preload ()
    {
        this.load.image('match3_tiles', 'assets/tiles/match3.png')
        this.load.image('bg', 'assets/sprites/headquarter.png')
        this.load.image('beanContour', 'assets/sprites/coffee_bean_contour.png')
        this.load.image('beanOrange', 'assets/sprites/coffee_bean_orange.png')
        this.load.image('hand', 'assets/sprites/hand_touch.png')
        this.load.spritesheet('match3Sprite', 'assets/tiles/match3.png', { frameWidth: TILE_WIDTH, frameHeight: TILE_HEIGHT });

        this.load.tilemapTiledJSON('tilemap', 'assets/tiles/level5.json')
    }

    create ()
    {
        const bg = this.add.image(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, "bg").setScale(5).setAlpha(0.2)
        // const map = this.make.tilemap({ key: 'tilemap' })
        // const tileset = map.addTilesetImage('match3', 'match3_tiles')

        // const mapLayer = map.createLayer('map', tileset)
        // const genLayer = map.createLayer('generator', tileset)
        // const beanLayer = map.createLayer('beans', tileset)


        // this.gameBoard = new Object()
        // this.generators = new Object()
        // this.beans = new Object()
    }



    // The maximum is inclusive and the minimum is inclusive
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1) + min); 
    }


    update (time, delta)
    {

    }
}

