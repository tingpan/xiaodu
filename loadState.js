var loadState = {
    preload: function () {

        game.stage.disableVisibilityChange = true;
        game.scale.setMinMax(320, 480);

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignVertically = true;
        this.scale.pageAlignHorizontally = true;

        game.load.spritesheet('box', 'assets/spritesheet/box.png', 54, 54);
        game.load.spritesheet('rabbit', 'assets/monster/rabbit.png', 237, 237);
        game.load.spritesheet('box', 'assets/spritesheet/box.png', 54, 54);
        game.load.spritesheet('charasHead', 'assets/spritesheet/charasHead.png', 53, 53);
        game.load.spritesheet('personBar', 'assets/spritesheet/player_health.png', 125, 10);
        game.load.spritesheet('chanmode','assets/spritesheet/chanmode.png',151,159);
        game.load.spritesheet('gameStart','assets/spritesheet/kaishiyouxi.png',252,85);
        game.load.spritesheet('gameIntro','assets/spritesheet/youxijianjie.png',206,70);

        game.load.image('cover', 'assets/img/startPage.png');
        game.load.image('logo', 'assets/img/logo.png');
        game.load.image('diamond', 'assets/img/diamond.png');
        game.load.image('stroke', 'assets/img/back1.png');
        game.load.image('iconBack', 'assets/img/back2.png');
        game.load.image('monsterBack', 'assets/img/monsterBack.png');
        game.load.image('monsterBar', 'assets/img/monster_health.png');
        game.load.image('gameOver', 'assets/img/gameOver.png');
        game.load.image('dialog','assets/img/dialog.png');

        game.load.audio('bgm', 'assets/se/music/bgm.mp3');
        game.load.audio('remove', 'assets/se/remove.wav');
        game.load.audio('select', 'assets/se/select.wav');
        game.load.audio('hurt', 'assets/se/hurt.wav');
        game.load.audio('bunnyHurt', 'assets/se/bunnyHurt.wav');
        game.load.audio('bunnyAttack', 'assets/se/bunnyAttack.wav');
        game.load.audio('removeMulti', 'assets/se/removeMulti.wav');
        game.load.audio('enter', 'assets/se/enter.wav');

        game.load.bitmapFont('luminari-white', 'assets/fonts/luminari-white/luminari-white.png', 'assets/fonts/luminari-white/luminari-white.xml');
        game.load.bitmapFont('luminari-dark', 'assets/fonts/luminari-dark/luminari-dark.png', 'assets/fonts/luminari-dark/luminari-dark.xml');
        game.load.bitmapFont('luminari-title', 'assets/fonts/luminari-title/luminari-title.png', 'assets/fonts/luminari-title/luminari-title.xml');
        game.load.bitmapFont('luminari-yellow', 'assets/fonts/luminari-yellow/luminari-yellow.png', 'assets/fonts/luminari-yellow/luminari-yellow.xml');
        game.load.bitmapFont('luminari-pink', 'assets/fonts/luminari-pink/luminari-pink.png', 'assets/fonts/luminari-pink/luminari-pink.xml');
        game.load.bitmapFont('luminari-green', 'assets/fonts/luminari-green/luminari-green.png', 'assets/fonts/luminari-green/luminari-green.xml');
        game.load.bitmapFont('luminari-red', 'assets/fonts/luminari-red/luminari-red.png', 'assets/fonts/luminari-red/luminari-red.xml');
        enterFx = this.game.add.audio('enter');
        bgm = this.game.add.audio('bgm');
        selectFx = this.game.add.audio('select');
    },
    create: function () {
        game.state.start('coverState');
    }

}