const TILE_WIDTH = 64;
const TILE_HEIGHT = 64;

const WHITE = "0xffffff"
const GREY = "0x63666a"
const ORANGE = "0xed8b00"
const PETROL = "0x208ca3"


class Level extends Phaser.Scene
{
    constructor (key)
    {
        super({ "key": key });

        
    }

    init (data)
    {
        this.gameOver = false
        this.numberOfBeans = 6
    }

    preload ()
    {
        // this.load.image('match3_tiles', 'assets/tiles/match3.png')
        this.load.image('bg', 'assets/sprites/headquarter.png')
        // this.load.image('beanContour', 'assets/sprites/coffee_bean_contour.png')
        // this.load.image('beanOrange', 'assets/sprites/coffee_bean_orange.png')
        // this.load.image('hand', 'assets/sprites/hand_touch.png')
        this.load.spritesheet('match3Sprite', 'assets/tiles/match3.png', { frameWidth: TILE_WIDTH, frameHeight: TILE_HEIGHT });

        // this.load.tilemapTiledJSON('tilemap', 'assets/tiles/level5.json')

    }

    create ()
    {
        this.beans = new Object()
        
        const bg = this.add.image(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, "bg").setScale(5).setAlpha(0.2)

        // decrease buttons
        for (let i=0; i < 4; i++) 
        {
            let x = 200 + i * 200;
            let y = CANVAS_HEIGHT/2 + 100;

            let rec = this.add.triangle(x, y, 0, 0, 100, 0, 50, 50, 0xed8b00, 1)
                .setOrigin(0.5)
                .setStrokeStyle(5, ORANGE, 0.5)
                .setInteractive()

            this.updateButton(rec, i, -1)
        }

        // increase buttons
        for (let i=0; i < 4; i++) 
        {
            let x = 200 + i * 200;
            let y = CANVAS_HEIGHT/2 - 100;

            let rec = this.add.triangle(x, y, 0, 50, 100, 50, 50, 0, 0xed8b00, 1)
                .setOrigin(0.5)
                .setStrokeStyle(5, ORANGE, 0.5)
                .setInteractive()

            this.updateButton(rec, i, 1)
        }

        this.initBeans()

    }

    initBeans() { 
        for (let i=0; i < 4; i++) 
        {
            let x = 200 + i * 200;
            let y = CANVAS_HEIGHT/2;
            
            let beanIndex = 0
            this.beans[i] = this.createBean(beanIndex, x, y)
        }
    }

    updateButton(rec, buttonIndex, direction) {
        rec.on('pointerdown', function (pointer)
        {
            rec.setFillStyle(PETROL, 1)

            let currentBeanIndex = this.beans[buttonIndex].beanIndex
            let newBeanIndex = (this.numberOfBeans + currentBeanIndex + direction) % this.numberOfBeans
            let x = this.beans[buttonIndex].x
            let y = this.beans[buttonIndex].y

            this.beans[buttonIndex].destroy()
            this.beans[buttonIndex] = this.createBean(newBeanIndex, x, y)
            
        }, this);
        rec.on('pointerup', function (pointer)
        {
            rec.setFillStyle(ORANGE, 1)
        }, this);
        rec.on('pointerover', function (pointer)
        {
            rec.setStrokeStyle(5, GREY, 0.5)
        }, this);
        rec.on('pointerout', function (pointer)
        {
            rec.setStrokeStyle(5, ORANGE, 0.5)
        }, this);

        return rec
    }

    createBean(beanIndex, x, y) {
        let bean = this.physics.add.sprite(x, y, 'match3Sprite', beanIndex)
                .setOrigin(0.5)
                .setScale(2)
        bean.beanIndex = beanIndex
        return bean
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

