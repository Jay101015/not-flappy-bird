g = new Phaser.Scene('g')

g.init = function(){
  gameover = false
  speedUp = -200
  start = false
  jumped = 0
  pos = [500,550,600,650,700]

};

g.preload = function(){
    this.load.image('bg', 'bg.png')
    this.load.image('pole', 'pole.png')
    this.load.image('ground', 'ground.png')
    this.load.spritesheet('player', 'player.png', {frameWidth:100,frameHeight:100})
 
}

g.create = function(){
   bg = this.add.tileSprite(0,0,800,600,'bg').setOrigin(0)
    bg.setInteractive()
    bg.depth = -2
    bg.on('pointerdown',function(){
        start = true
        playGame.visible = false
        if(gameover === false){
            poles[0].setVelocityX(speedUp)
            poles[1].setVelocityX(speedUp)
            player.setVelocityY(-300)
            player.play('flapping')
        }else{
            gameover=false
            speedUp= -200
            player.y = 300
            poles[0].x=800
            poles[0].setVelocityX(-200)
            poles[1].x = 800
            player.angle = 0
            jumped= 0
            polesJumped.setText('Poles Jumped:'+jumped)
        }

    })
//ghostground wont sink due to gravity being false
    playGame = this.add.text(100,0,'Click\nTo\nStart!',{fontSize:'68px'})
    polesJumped = this.add.text(600,0,'Poles Jumped:'+ jumped,{fontSize:'20px'})
    ghostground = this.physics.add.sprite(800,565,'ghostground').setOrigin()
    ghostground.setScale(100,0,5)
    ghostground.body.allowGravity = false
    ghostground.setImmovable(true)
    ground = this.add.tileSprite(400,565,800,150,'ground').setOrigin()
    ground.setScale(1,0.5)
    player = this.physics.add.sprite(150,300, 'player')
    // hitmarker size, if possible set difficulty and increase hitmarker?
    player.setSize(50,50)
    player.setCollideWorldBounds(true)
    //creating a loop of poles
    pole = this.physics.add.group({
        key: 'pole',
        repeat: 1
    })
    //Must then be a plural
    poles = pole.getChildren()
    for(var i=0;i<poles.length;i++){
        poles[i].body.allowGravity=false
        poles[i].body.setImmovable = true
        poles[i].setOrigin()
        poles[i].flipY = true
        poles[i].depth = -1
        poles[i].setVelocityX(-300)
        poles[0].y = pos[Phaser.Math.Between(0,4)]
        poles[0].x = 800
        poles[1].y = poles[0].y-650
        poles[1].x = poles[0].x
    }
    this.physics.add.collider(ghostground,player,this.hitGround,null,this)
    this.physics.add.collider(pole,player,this.hitThePole,null,this)
    // flying animation
    this.anims.create({
        key: 'flapping',
        frames:this.anims.generateFrameNumbers('player', {start:0,end:4}),
        repeat: -1,
        frameRate:20,
        yoyo:true
    })
    //getting hit animation
    this.anims.create({
        key: 'hit',
        frames:this.anims.generateFrameNumbers('player', {start:5,end:5}),
        repeat: -1,
        frameRate:20,
        yoyo:true
    })
   
};
//calling endgame function
g.hitGround = function(p1,p2){
    if (p2===player){
        gameover = true
    }
}
g.hitThePole = function(){
    gameover = true
    player.play('hit')
}
//helps background to move
g.update = function(){
    if(start===false){
        player.y=300
        player.setVelocityY(0)
        poles[0].setVelocityX(0)
        poles[1].setVelocityX(0)
    }else{
        if (gameover===false){
            bg.tilePositionX+=0.1
            ground.tilePositionX+=5
            poles[1].y = poles[0].y -650
            poles[1].x = poles[0].x

            if(poles[0].x<=-50){
                speedUp -= 50
                poles[0].x=850
                poles[0].y = pos[Phaser.Math.Between(0,4)]
                poles[0].setVelocityX(speedUp)
                jumped+=1
                polesJumped.setText('Poles Jumped: '+jumped)

            }
        }
    }

}


var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 700 },
            debug: true
        }
    },
    scene: g
};

var game = new Phaser.Game(config)