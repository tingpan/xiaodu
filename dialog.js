/**
 * Created by TingPan on 4/14/15.
 */
var Dialog = function(title, message){
    this.body = game.add.sprite(0,0,'dialog');
    this.title = game.add.text(game.world.centerX, 210, title,{
        font:"30px STHeiti",
        align: 'center',
        fill: '#6B4200',
        wordWrap: true,
        wordWrapWidth: 450
    });
    this.title.anchor.setTo(0.5);


    this.message = game.add.text(game.world.centerX, 250, message, {
        font:"18px STHeiti",
        align: 'center',
        fill: '#6B4200',
        wordWrap: true,
        wordWrapWidth: 450
    });
    this.message.anchor.set(0.5,0);
}

Dialog.prototype.dismiss = function(){
    game.world.remove(this.body);
    game.world.remove(this.title);
    game.world.remove(this.message);
}