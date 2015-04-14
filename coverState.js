var coverState = {
	create : function(){
		this.game.add.sprite(0,0,'cover');
		this.logo = this.game.add.sprite(58,128,'logo');
		this.logo.alpha = 0.5;
		this.game.add.tween(this.logo).to( {alpha:1} , 1000).to({alpha:0.5} ,1000).loop().start();
        this.game.add.button(150,426,'kaishiyouxi',this.startGame,this);
        this.game.add.button(150,490,'youxijieshao',this.gameIntro,this);
        //bgm.loop = true;
        //bgm.play();
	},

    startGame: function(){
        enterFx.play();
        game.state.start('startState');
    },

    gameIntro: function(){

    }
}