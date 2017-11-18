window.onload = function() {
    var game = new Phaser.Game(600,600);
    var tileSizeX = 100;
    var tileSizeY = 100;

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
            console.log("clicked");

        }

    }
    var  preloadAssets = function(game){}
    preloadAssets.prototype = {
        preload: function(){
            game.load.spritesheet("tiles","assets/sheets/tiles.png",tileSizeX,tileSizeY);
            game.load.spritesheet("soundicons","assets/sheets/soundicons.png", tileSizeX,tileSizeY);

            game.state.start("TitleScreen");

        }
    }
    game.state.add("PreloadAssets",preloadAssets);
    game.state.add("TitleScreen",titleScreen);
    game.state.start("PreloadAssets");
}
