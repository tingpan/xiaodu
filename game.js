var game = new Phaser.Game(480, 720, Phaser.AUTO, '');
var storageSys = new StorageSystem();
var myCharacter;
game.state.add('loadState', loadState); 
game.state.add('gameState',gameState);
game.state.add('coverState',coverState);
game.state.add('chooseState',chooseState);
game.state.add('startState',startState);
game.state.add('nameState',nameState);
game.state.add('mapState',mapState);
game.state.start('loadState');

game.stateList = {
	"startState" : 0,
	"mapState" 	 : 1,
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


