var game = new Phaser.Game(480, 720, Phaser.AUTO, '');
game.state.add('loadState', loadState); 
game.state.add('gameState',gameState);
game.state.add('coverState',coverState);
game.state.add('modeState',modeState);
game.state.start('loadState');

game.stateList = {
	"coverState" : 0,
	"modeState" : 1,
	"gameState"  : 2
}


// socket.on('getConnected',function(data){
// 	if(!id){
// 		id = data.clientID;
// 	}
// 	game.state.start('chooseState');
// 	//if(data.gameState==0){
// 	//	game.state.start('loadState');
// 	//}
// });


