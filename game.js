window.onload = function() {
    var game = new Phaser.Game(600,600);
    var tileSize = 100;
    var playSound;
    var numCols = 5;
    var numRows = 4;
    var tileSpacing = 10;
    var selectedArray= [];
    var score=0;

    var  preloadAssets = function(game){}
    preloadAssets.prototype = {
        preload: function(){
            game.load.spritesheet("tiles","assets/sheets/tiles.png",tileSize,tileSize);
            game.load.spritesheet("soundicons","assets/sheets/soundicons.png", tileSize,tileSize);
            game.load.audio("select",["assets/sounds/select.mp3","assets/sounds/select.ogg"]);
            game.load.audio("right",["assets/sounds/right.mp3","assets/sounds/right.ogg"]);           
        },
        create: function(){
            game.state.start("TitleScreen");
        }
    }

    var titleScreen = function(game){}
    titleScreen.prototype = {
        create: function(){
            var style = {
                font: "48px Monospace",
                fill: "#00ff00",
                align: "center"
            }

            var text = game.add.text(game.width/2,game.height/2-100,"Find matching flowers",style);
            text.anchor.set(0.5);

            var soundButton = game.add.button(game.width/2 - 100, game.height/2 + 100,"soundicons",this.startGame,this);
            soundButton.anchor.set(0.5);
            soundButton = game.add.button(game.width/2 + 100, game.height/2 + 100,"soundicons",this.startGame,this);
            soundButton.frame = 1;
            soundButton.anchor.set(0.5);
        },
        startGame:  function(context){
            if(context.frame == 0)
                playSound = true;        
            else
                playSound = false;
            game.state.start("PlayScreen");
        }

    }
    var playScreen = function(game){}
    playScreen.prototype ={
        soundArray : [],
        scoreText:null,
        timeLeft :30,
        timeLeftText:null,

        create: function(){

            game.stage.disableVisibilityChange = true; // if user changes the focus, timer will continue counting
            this.placeTiles();
            if(playSound){
                this.soundArray[0] = game.add.audio("select",1);
                this.soundArray[1] = game.add.audio("right",1);
            }
            var style = {
                font: "48px Monospace",
                fill: "#00ff00",
                align: "center"
            }
            this.scoreText = game.add.text(5,5,"Score: "+score,style);
            this.timeLeftText = game.add.text(5,game.height-52,"Time left: "+this.timeLeft,style);            
            game.time.events.loop(Phaser.Timer.SECOND,this.decreaseTime,this);

        },
        decreaseTime:function(){
            this.timeLeft--;
            this.timeLeftText.text = "Time left: " + this.timeLeft;
            if(this.timeLeft == 0){
                game.state.start("GameOver");
            }
        }
        ,
        placeTiles:function(){
            //tilesLeft = numCols*numRows;
            var leftSpace = (game.width - (numCols * tileSize) - ((numCols - 1) * tileSpacing))/2;
            var topSpace = (game.height - (numRows * tileSize) - ((numRows - 1) * tileSpacing))/2;
            var tilesArray = [0,0,1,1,2,2,4,4,5,5,6,6,7,7,8,8,9,9,10,10];


            for(i=0;i<numCols;i++){
                for(var j =0;j<numRows;j++){
                    var placingTile = game.add.button(leftSpace +i*(tileSize+tileSpacing),topSpace + j*(tileSize+tileSpacing),"tiles",this.showTile,this);              
                    placingTile.frame = 3;
                    placingTile.mValue = tilesArray[j * numCols + i];
                }
            }
        }
        ,
        showTile:function(context){           
            if(selectedArray.length < 2 && selectedArray.indexOf(context) == -1 ){
                if(playSound)
                    this.soundArray[0].play();

                selectedArray.push(context);
                context.frame = context.mValue;
            }

            if(selectedArray.length == 2){
                // this timer lasts half sec
                game.time.events.add(Phaser.Timer.HALF, this.checkTiles, this);

            }

        },

        checkTiles:function(){
            if(selectedArray[0].mValue == selectedArray[1].mValue){ //match

                if(playSound)
                    this.soundArray[1].play();

                selectedArray[0].destroy();
                selectedArray[1].destroy();
                score++;
                this.scoreText.text = "Score: "+score;

            }
            else{ // do not match
                selectedArray[0].frame = 3;
                selectedArray[1].frame = 3;
            }

            selectedArray.length = 0;
        }

    }

    var gameOver = function(game){}
    gameOver.prototype = {
        create:function(){
            var style = {
                font: "32px Monospace",
                fill: "#00ff00",
                align: "center"
            }
            var text = game.add.text(game.width/2,game.height/2 - 100, "Game Over",style);
            text.anchor.set(0.5);
            text = game.add.text(game.width/2,game.height/2, "Your score is: "+score,style);
            text.anchor.set(0.5);
        }
    }

    game.state.add("GameOver",gameOver);
    game.state.add("PreloadAssets",preloadAssets);
    game.state.add("TitleScreen",titleScreen);
    game.state.add("PlayScreen",playScreen);
    game.state.start("PreloadAssets");
}
