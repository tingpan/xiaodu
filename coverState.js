var coverState = {
	create : function(){
        this.dialog
		this.game.add.sprite(0,0,'cover');
		this.logo = this.game.add.sprite(58,128,'logo');
		this.logo.alpha = 0.5;
		this.game.add.tween(this.logo).to( {alpha:1} , 1000).to({alpha:0.5} ,1000).loop().start();
        this.game.add.button(114,410,'gameStart',this.startGame,this,1,0,2);
        this.game.add.button(137,500,'gameIntro',this.gameIntro,this,1,0,2);
        bgm.loop = true;
        bgm.play();
	},

    startGame: function(){
        if(!this.dialog) {
            enterFx.play();
            game.state.start('modeState');
        }
    },

    gameIntro: function() {
        if (!this.dialog) {
            this.dialog = new Dialog("游戏简介", "在游戏中，玩家扮演对抗毒品的英雄。 在玩家面前会出现被毒品感染的小动物。 玩家所要做的就是通过消除方块来净化 小动物。在游戏中，玩家有一个防护槽， 一旦防护槽为空，则游戏结束。");
            this.dialog.body.inputEnabled = true;
            this.dialog.body.events.onInputDown.add(this.mouseDown, this);
        }
    },

    mouseDown: function(){
      if(this.dialog){
          this.dialog.dismiss();
          this.dialog = null;
      }
    }
}