const TILE_WIDTH = 64;
const TILE_HEIGHT = 64;

const BLACK = "0x000000"
const WHITE = "0xffffff"
const GREY = "0x63666a"
const ORANGE = "0xed8b00"
const PETROL = "0x208ca3"

const WHITE_HASH = "#ffffff"
const GREY_HASH = "#63666a"
const ORANGE_HASH = "#ed8b00"
const MINT_HASH = "#aaf0d1"


class Level extends Phaser.Scene
{
    constructor (key)
    {
        super({ "key": key });

        
    }

    init (data)
    {
        this.gameOver = false
        this.numberOfBeans = 4
        this.numberOfRows = 4
        this.round = 0
        this.maxRounds = 12

        this.answer = "0111"
    }

    preload ()
    {
        this.load.image('bg', 'assets/sprites/headquarter.png')
        this.load.spritesheet('match3Sprite', 'assets/tiles/match3.png', { frameWidth: TILE_WIDTH, frameHeight: TILE_HEIGHT });
    }

    create ()
    {
        this.beans = new Object()

        this.colorCount = Object()
        for (let i=0; i < this.numberOfBeans; i++) {
            this.colorCount[i] = this.answer.split(i).length - 1;
        }

        const bg = this.add.image(CANVAS_WIDTH/2, CANVAS_HEIGHT/2, "bg").setScale(5).setAlpha(0.2)

        // increase and decrease buttons
        this.initButtons()

        // submit button
        this.initSubmitButton()

        // beans
        this.initBeans()

        this.answerBlockX = CANVAS_WIDTH - 300
        this.answerBlockY = 80
        for (let i=0; i < this.maxRounds; i++){
            this.add.rectangle(this.answerBlockX + 75, this.answerBlockY - 20 + i * 75, 200, 75, GREY, 0.1)
                .setOrigin(0.5)
                .setStrokeStyle(5, GREY, 0.5)
        }
        this.add.rectangle(100, 23, 825, 250, GREY, 0.1)
            .setOrigin(0)
            .setStrokeStyle(5, GREY, 0.5);

        this.add.rectangle(100, 323, 825, 300, GREY, 0.1)
            .setOrigin(0)
            .setStrokeStyle(5, GREY, 0.5);

        this.add.rectangle(100, 673, 825, 250, GREY, 0.1)
            .setOrigin(0)
            .setStrokeStyle(5, GREY, 0.5);
        
        let style1 = { color: ORANGE_HASH, fontSize: "120px", stroke: GREY_HASH, strokeThickness: 8}
        let style2 = { color: MINT_HASH, fontSize: "120px", stroke: GREY_HASH, strokeThickness: 8}
        this.add.text(360, 150, "MASTER", style1).setOrigin(0.5)
        this.add.text(730, 150, "MINT", style2).setOrigin(0.5)

    }

    initBeans() { 
        for (let i=0; i < this.numberOfRows; i++) 
        {
            let x = 200 + i * 200;
            let y = CANVAS_HEIGHT/2;
            
            let beanIndex = 0
            this.beans[i] = this.createBean(beanIndex, x, y)
        }
    }

    initSubmitButton() {
        let rec = this.add.rectangle(CANVAS_WIDTH/2 - 100, CANVAS_HEIGHT - 170, 400, 100, ORANGE, 1)
            .setOrigin(0.5)
            .setInteractive()
        
        rec.on('pointerdown', function (pointer)
        {
            rec.setFillStyle(PETROL, 1)
            this.submit()
        }, this);
        rec.on('pointerup', function (pointer)
        {
            rec.setFillStyle(ORANGE, 1)
        }, this);

        let style1 = { color: WHITE_HASH, fontSize: "100px"}
        this.add.text(CANVAS_WIDTH/2 - 100, CANVAS_HEIGHT - 170, "SUBMIT", style1).setOrigin(0.5)
    }

    initButtons() {
        // decrease buttons
        for (let i=0; i < this.numberOfRows; i++) 
        {
            let x = 200 + i * 200;
            let y = CANVAS_HEIGHT/2 + 100;

            let tri = this.add.triangle(x, y, 0, 0, 100, 0, 50, 50, ORANGE, 1)
                .setOrigin(0.5)
                .setStrokeStyle(5, ORANGE, 0.5)
                .setInteractive()

            this.updateButton(tri, i, -1)
        }

        // increase buttons
        for (let i=0; i < this.numberOfRows; i++) 
        {
            let x = 200 + i * 200;
            let y = CANVAS_HEIGHT/2 - 100;

            let tri = this.add.triangle(x, y, 0, 50, 100, 50, 50, 0, ORANGE, 1)
                .setOrigin(0.5)
                .setStrokeStyle(5, ORANGE, 0.5)
                .setInteractive()

            this.updateButton(tri, i, 1)
        }
    }

    updateButton(tri, buttonIndex, direction) {
        tri.on('pointerdown', function (pointer)
        {
            tri.setFillStyle(PETROL, 1)

            let currentBeanIndex = this.beans[buttonIndex].beanIndex
            let newBeanIndex = (this.numberOfBeans + currentBeanIndex + direction) % this.numberOfBeans
            let x = this.beans[buttonIndex].x
            let y = this.beans[buttonIndex].y

            this.beans[buttonIndex].destroy()
            this.beans[buttonIndex] = this.createBean(newBeanIndex, x, y)
            
        }, this);
        tri.on('pointerup', function (pointer)
        {
            tri.setFillStyle(ORANGE, 1)
        }, this);
        tri.on('pointerover', function (pointer)
        {
            tri.setStrokeStyle(5, GREY, 0.5)
        }, this);
        tri.on('pointerout', function (pointer)
        {
            tri.setStrokeStyle(5, ORANGE, 0.5)
        }, this);

        return tri
    }

    createBean(beanIndex, x, y, scale=2) {
        let bean = this.physics.add.sprite(x, y, 'match3Sprite', beanIndex)
                .setOrigin(0.5)
                .setScale(scale)
        bean.beanIndex = beanIndex
        return bean
    }

    submit() {
        if (this.gameOver) {
            console.log("game over")
            return
        }


        let blacks = Object()
        let whites = Object()
        let counter = Object()

        for (let i=0; i < this.numberOfRows; i++) { 
            blacks[i] = false
            whites[i] = false
        }

        for (let i=0; i < this.numberOfBeans; i++) { 
            counter[i] = 0
        }

        // Get all the correct matches
        let allCorrect = true;
        for (let i=0; i < this.numberOfRows; i++) {
            blacks[i] = this.answer[i] == this.beans[i].beanIndex.toString()
            
            if (blacks[i] == true){ 
                // increase counter
                counter[this.beans[i].beanIndex]++;
            } 
            else {
                allCorrect = false
            }
        }

        // get all the correct colors
        for (let i=0; i < this.numberOfRows; i++) {
            // if this pos is already correct we don't need to look at it again
            if (blacks[i] == true){ 
                continue
            } 
        

            let beanIndex = this.beans[i].beanIndex
            // check if there is a match in general
            // Note:
            // If there are duplicate colors in the guess, they cannot all be awarded a key peg 
            // unless they correspond to the same number of duplicate colors in the hidden code. For 
            // example, if the hidden code is red-red-blue-blue and the player guesses red-red-red-blue, 
            // the codemaker will award two colored key pegs for the two correct reds, nothing for the third 
            // red as there is not a third red in the code, and a colored key peg for the blue. No 
            // indication is given of the fact that the code also includes a second blue
            if (this.answer.includes(beanIndex.toString())) {
                if (counter[beanIndex] < this.colorCount[beanIndex]) {
                    whites[i] = true
                    counter[this.beans[i].beanIndex]++;
                }
            }
        }

        // Give Answer
        for (let i=0; i < this.numberOfRows; i++){
            this.createBean(this.beans[i].beanIndex, this.answerBlockX  + 50 * i, 50 + this.round * 75, 0.5)
            if (blacks[i]) {
                this.add.circle(this.answerBlockX + 50 * i, this.answerBlockY + this.round * 75, 10, ORANGE, 1)
                    .setOrigin(0.5)
            }
            if (whites[i]) {
                this.add.circle(this.answerBlockX  + 50 * i, this.answerBlockY + this.round * 75, 10, GREY, 1)
                    .setOrigin(0.5)
            }
        }

        this.round++;

        if (allCorrect) {
            console.log("You have found the right answer")
            this.gameOver = true
        }

        if (this.round >= this.maxRounds) {
            this.gameOver = true
        }
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

