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

    playgame.prototype = {
        scoreText:null,
        timeText:null,
        soundArray: [],     

        preload: function(){
            // load.spritesheet(key, url, frameWidth, frameHeight) 
            game.load.spritesheet("tiles","assets/sheets/tiles.png",tileSize,tileSize);
            game.load.spritesheet("question","assets/sheets/question.png",tileSize,tileSize);
            game.load.audio("select", ["assets/sounds/select.mp3", "select.ogg"]);
            game.load.audio("right", ["assets/sounds/right.mp3", "right.ogg"]);
            // game.load.audio("wrong", ["wrong.mp3", "wrong.ogg"]);

        },
        create: function() {
            score = 0;
            timeLeft = 30;
            this.placeTiles();
            if(playSound){
                // populate the sound array
                // add.audio(key,volume), volume range 0-1
                this.soundArray[0] = game.add.audio("select", 1);
                this.soundArray[1] = game.add.audio("right", 1);
                //this.soundArray[2] = game.add.audio("wrong", 1);
                var style = {
                    font: "32px Monospace",
                    fill: "#00ff00",
                    align: "center"
                }
                //this.scoreText = game.add.text(5, 5, "Score: " + score, style);
                //this.timeText = game.add.text(5, game.height - 5,"Time left: " + timeLeft,style);
                //this.timeText.anchor.set(0,1);
               // game.time.events.loop(Phaser.Timer.SECOND,this.decreaseTime,this);
            }
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

            for(var i=0;i<numCols*numRows;i++){
                tilesArray.push(Math.floor(i/2));
            }
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
                    // add.button(x, y, key, callback, callbackContext)
                     var placingTile = game.add.button(leftSpace +i*(tileSize+tileSpacing),topSpace + j*(tileSize+tileSpacing),"question",this.showTile,this);              
                    //placingTile.frame = 3;
                    placingTile.value = tilesArray[j * numCols + i];
                }
            }
        },
        showTile: function(target){
            // if selected array has less than two elemets and there's no occurence of the selected tile
            // show the tile 
            if(selectedArray.length < 2 && selectedArray.indexOf(target) == -1){                
                if(playSound){
                    this.soundArray[0].play();
                }
                target = game.add.button(leftSpace +i*(tileSize+tileSpacing),topSpace + j*(tileSize+tileSpacing),"tiles",this.showTile,this);
                target.frame = target.value;
                selectedArray.push(target);
            }
            
            // check the two shown tiles
            if(selectedArray.length == 2){
                // wait for 1 sec and then check
                console.log("Selected");
                //game.time.events.add(Phaser.Timer.SECOND, this.checkTiles, this);              
            }

        }
    }
    //game.state.add("TitleScreen", titleScreen);
    game.state.add("Playgame",playgame);
    //game.state.add("GameOver", gameOver);
    game.state.start("Playgame");
}