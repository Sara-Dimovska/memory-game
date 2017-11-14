window.onload = function() {
    var game = new Phaser.Game(600, 600);
    var playgame = function(game){}
    var tileSize = 100;
    var numRows = 4;
    var numCols = 5;
    var tileSpacing = 10;
    var tilesArray = [];
    var selectedArray =[];
    var playSound;
    var score;
    var timeLeft;
    var tilesLeft;
    var localStorageName = "flowers";
    var highScore;

    playgame.prototype = {
        scoreText:null,
        timeText:null,
        soundArray: [],     

        create: function() {
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
            // sets the scaling method,  SHOW_ALL shows the game at the largest scale possible
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            score = 0;
            timeLeft = 30;
            this.placeTiles();
            if(playSound){
                // populate the sound array
                // add.audio(key,volume), volume range 0-1
                this.soundArray[0] = game.add.audio("select", 1);
                this.soundArray[1] = game.add.audio("right", 1);
            }
            //this.soundArray[2] = game.add.audio("wrong", 1);
            var style = {
                font: "32px Monospace",
                fill: "#00ff00",
                align: "center"
            }
            this.scoreText = game.add.text(5, 5, "Score: " + score, style);
            this.timeText = game.add.text(5, game.height - 5,"Time left: " + timeLeft,style);
            this.timeText.anchor.set(0,1);
            game.time.events.loop(Phaser.Timer.SECOND,this.decreaseTime,this);

        },
        decreaseTime:function(){
            timeLeft--;
            this.timeText.text = "Time left: " + timeLeft;
            if(timeLeft == 0){
                game.state.start("GameOver");
            }

        },
        placeTiles: function(){
            tilesLeft = numCols*numRows;
            var leftSpace = (game.width - (numCols * tileSize) - ((numCols - 1) * tileSpacing))/2;
            var topSpace = (game.height - (numRows * tileSize) - ((numRows - 1) * tileSpacing))/2;

            tilesArray = [0,0,1,1,2,2,4,4,5,5,6,6,7,7,8,8,9,9,10,10];
            // shufle the array      
            /* for(i = 0; i < numRows * numCols; i++){
                // rnd.between(min, max)
                var from = game.rnd.between(0,tilesArray.length-1);
                var to = game.rnd.between(0, tilesArray.length-1);
                var temp = tilesArray[from];
                tilesArray[from] = tilesArray[to];
                tilesArray[to] = temp;
            }*/


            //console.log("tilesArray values:"+tilesArray);

            for(i=0;i<numCols;i++){
                for(var j =0;j<numRows;j++){
                    var placingTile = game.add.button(leftSpace +i*(tileSize+tileSpacing),topSpace + j*(tileSize+tileSpacing),"tiles",this.showTile,this);              
                    placingTile.frame = 3;
                    placingTile.value = tilesArray[j * numCols + i];
                }
            }
        },
        showTile: function(target){
            // if selected array has less than two elemets and there's no occurence of the selected tile
            if(selectedArray.length < 2 && selectedArray.indexOf(target) == -1){                
                if(playSound){
                    this.soundArray[0].play();
                }
                target.frame = target.value;
                selectedArray.push(target);
            }

            if(selectedArray.length == 2){
                // wait for 1 sec and then check
                game.time.events.add(Phaser.Timer.SECOND, this.checkTiles, this);              
            }

        },
        checkTiles: function(){     
            //console.log(selectedArray[0].value + " " + selectedArray[1].value);

            if(selectedArray[0].value == selectedArray[1].value){ // match
                if(playSound){
                    this.soundArray[1].play();
                }
                score ++;
                timeLeft +=2;
                this.timeText.text = "Time left: " + timeLeft;
                this.scoreText.text = "Score: " + score;
                selectedArray[0].destroy();
                selectedArray[1].destroy();
                tilesLeft -= 2;

                // reset
                if(tilesLeft == 0){
                    tilesArray.length = 0;
                    selectedArray.length = 0;
                    this.placeTiles();
                }
            }
            else{ // do not match
                //if(playSound){
                //   this.soundArray[2].play();
                // }
                selectedArray[0].frame = 3;
                selectedArray[1].frame = 3;
            }
            selectedArray.length = 0;
        }
    }


    var titleScreen = function(game){}
    titleScreen.prototype = {
        create: function(){
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
            // sets the scaling method,  SHOW_ALL shows the game at the largest scale possible
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            game.stage.disableVisibilityChange = true;
            var style = {
                font: "48px Monospace",
                fill: "#00ff00",
                align: "center"
            };
            var text  = game.add.text(game.width/2,game.height/2 - 100,"Find matching flowers",style);

            text.anchor.set(0.5);
            // Sound ON
            var soundButton = game.add.button(game.width/2 - 100, game.height/2 + 100,"soundicons",this.startGame,this);
            soundButton.anchor.set(0.5);
            // Sound OFF
            soundButton = game.add.button(game.width / 2 + 100 , game.height /2 + 100, "soundicons",this.startGame,this);
            soundButton.frame = 1;

            soundButton.anchor.set(0.5);
        },
        startGame: function(target){
            if(target.frame == 0){
                playSound = true;
            }
            else{
                playSound = false;
            }
            game.state.start("Playgame");

        }
    }
    var gameOver = function(game){}
    gameOver.prototype = {
        create: function(){
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
            // sets the scaling method,  SHOW_ALL shows the game at the largest scale possible
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            // set the highScore and save it to localStorage
            highScore = Math.max(score, highScore);
            localStorage.setItem(localStorageName, highScore);

            var style = {
                font: "32px Monospace",
                fill: "#00ff00",
                align: "center"
            }
            var text = game.add.text(game.width / 2, game.height / 2, "Game Over\n\n Your score: " + score + "\n Best score: "+ highScore+"\n\nTap to restart", style);
            text.anchor.set(0.5);


            game.input.onDown.add(this.restartGame, this);
        },
        restartGame: function(){
            tilesArray.length = 0;
            selectedArray.length = 0;
            game.state.start("TitleScreen");
        }
    }
    
    var preloadAssets = function(game){}
    preloadAssets.prototype = {
        preload: function(){
            game.load.spritesheet("tiles", "assets/sheets/tiles.png", tileSize, tileSize);
            game.load.audio("select", ["assets/sounds/select.mp3", "assets/sounds/select.ogg"]);
            game.load.audio("right", ["assets/sounds/right.mp3", "assets/sounds/right.ogg"]);
            //game.load.audio("wrong", ["assets/sounds/wrong.mp3","assets/sounds/wrong.ogg"]);
            game.load.spritesheet("soundicons", "assets/sheets/soundicons.png", 100,100);
        },
        create: function(){
            game.state.start("TitleScreen");
        }
    }
    
    game.state.add("PreloadAssets", preloadAssets);
    game.state.add("TitleScreen", titleScreen);
    game.state.add("Playgame",playgame);
    game.state.add("GameOver", gameOver);
    // get the highScore before launching
    highScore = localStorage.getItem(localStorageName) == null ? 0 :
    localStorage.getItem(localStorageName);

    game.state.start("PreloadAssets");

}
