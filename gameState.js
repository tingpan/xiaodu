var gameState = {

    create: function() {
        this.dropping = false;
        this.boxSize = 54;
        this.matrixHeight = 7;
        this.matrixWidth = 8;
        this.margin = 24;
        this.matrix = [];
        this.active = false;
        this.activeTween = false;
        this.myCharacter = null;
        this.game.add.sprite(24, 318, 'iconBack');
        this.boxGroup = game.add.group();
        this.game.add.sprite(0, 0, 'monsterBack');
        this.currentHealth = 0;
        this.totalHealth = 0;
        this.game.add.sprite(25, 226, 'personBar', 2);
        this.healthBar = this.game.add.sprite(25, 226, 'personBar', 0);
        this.healthTag = this.game.add.bitmapText(25, 215, "luminari-white", "225/225", 20);
        this.monsters = game.add.group();
        this.monster = new Monster(0);
        this.loadCharacter();
        this.game.add.sprite(0, 291, 'stroke');
        this.attackGroup = game.add.group();
        this.healGroup = game.add.group();
        this.expGroup = game.add.group();
        this.magicGroup = game.add.group();
        this.createMatrix();
        this.damageTags = this.game.add.group();
        this.teamAttacks = this.game.add.group();

        this.monster.setMonsterLevel(this.myCharacter.level);

        this.game.time.events.add((2 + Math.random() * 10) * 1000, function() {
            var attackTime = Math.floor(1 + Math.random() * 3);
            var damage = this.monster.getDamage(attackTime);
            this.monsterAttack(attackTime, damage);
        }, this)


        this.attackGroup.emitter = this.addEmitter();
        this.healGroup.emitter = this.addEmitter();
        this.expGroup.emitter = this.addEmitter();
        this.magicGroup.emitter = this.addEmitter();

        this.selectFx = this.game.add.audio('select');
        this.removeFx = this.game.add.audio('remove');
        this.removeMultiFx = this.game.add.audio('removeMulti');
        this.hurtFx = this.game.add.audio('hurt');
        this.removeMultiFx.volume = 0.4;
        this.selectFx.volume = 0.2;
    },

    update: function() {
        this.damageTags.forEach(function(tag) {
            if (tag && tag.alpha == 0) {
                this.damageTags.remove(tag);
                this.game.world.remove(tag);
            };
        }.bind(this));

        this.teamAttacks.forEach(function(attack) {
            if (attack && attack.alpha == 0) {
                this.damageTags.remove(attack);
                this.game.world.remove(attack);
            };
        }.bind(this));

        if (this.monster.alive == false) {
            this.monster = new Monster(0);
            this.monster.setMonsterLevel(this.myCharacter.level);
            this.monsters.removeAll();
            this.monsters.add(this.monster.body);
        };
        //console.log("" + this.dropping + this.monster.status);

        if (this.game.input.enabled == false && this.currentHealth > 0 && this.dropping == false && this.monster.monsterStatus=="normal"){
            this.game.input.enabled = true;
        };
    },

    addEmitter: function() {
        var emitter = game.add.emitter(0, 0, 100);
        emitter.makeParticles('diamond');
        emitter.bringToTop = true;
        emitter.setAlpha(1, 0, 1000);
        emitter.setScale(1, 0.5, 1, 0.5, 1000, Phaser.Easing.Sinusoidal.InOut, true);
        return emitter;
    },

    createMatrix: function() {
        for (var i = 0; i < this.matrixHeight; i++) {
            this.matrix[i] = [];
            for (var j = 0; j < this.matrixWidth; j++) {
                var x = this.margin + this.boxSize / 2 + j * this.boxSize;
                var y = this.boxSize / 2 + 720 - this.margin - this.matrixHeight * this.boxSize + i * this.boxSize;
                var d1 = [];
                var d2 = [];
                var leftPattern = -1;
                var upPattern = -1;
                var type = -1;

                if (i > 0) {
                    d1 = this.scanUp(i - 1, j, [{
                        "row": i - 1,
                        "column": j
                    }]);
                };

                if (j > 0) {
                    d2 = this.scanLeft(i, j - 1, [{
                        "row": i,
                        "column": j - 1
                    }]);
                }

                if (d1.length > 1) {
                    upPattern = this.matrix[i - 1][j].type;
                }

                if (d2.length > 1) {
                    leftPattern = this.matrix[i][j - 1].type;
                }

                while (type < 0 || type == upPattern || type == leftPattern) {
                    type = Math.floor(Math.random() * 4);
                }

                var pic = this.game.add.sprite(x, y, 'box', type);
                this.boxGroup.add(pic);
                pic.anchor.setTo(0.5, 0.5);
                pic.type = type;
                pic.row = i;
                pic.column = j;
                pic.inputEnabled = true;
                pic.events.onInputDown.add(this.mouseDown, this);
                this.matrix[i][j] = pic;
            }
        }
    },


    scanWhole: function() {
        var remove = [];
        for (var i = 0; i < this.matrixHeight; i++) {
            for (var j = 0; j < this.matrixWidth; j++) {
                var obj = {
                    "row": i,
                    "column": j
                };
                remove = remove.concat(this.scanBox(i, j));
            };
        };

        // for(var i = 0 ; i < remove.length ; i++){
        // 	console.log("remove:" + remove[i].row + "," + remove[i].column);
        // }
        return remove;
    },


    scanLeft: function(row, column, duplicate) {
        var thisBox = this.matrix[row][column];
        var leftBox = false;
        var result = false;

        if (!column - 1 < 0) {
            leftBox = this.matrix[row][column - 1];
            result = (thisBox.type == leftBox.type);
        };

        if (!leftBox || !result) {
            // if(duplicate.length > 2){
            // 	console.log("Left:" + duplicate[0].row + "," + duplicate[0].column);
            // }
            return duplicate;
        };

        var obj = {
            "row": row,
            "column": column - 1
        };
        duplicate.push(obj);
        return this.scanLeft(row, column - 1, duplicate);
    },

    scanRight: function(row, column, duplicate) {

        var thisBox = this.matrix[row][column];
        var rightBox = false;
        var result = false;

        if (column + 1 < this.matrixWidth) {
            rightBox = this.matrix[row][column + 1];
            result = (thisBox.type == rightBox.type);
        };

        if (!rightBox || !result) {
            // if(duplicate.length > 2){
            // 	console.log("Right: " + duplicate[0].row + "," + duplicate[0].column);
            // }
            return duplicate;
        };

        var obj = {
            "row": row,
            "column": column + 1
        };
        duplicate.push(obj);
        return this.scanRight(row, column + 1, duplicate);
    },


    scanUp: function(row, column, duplicate) {

        var thisBox = this.matrix[row][column];
        var upBox = false;
        var result = false;

        if (!row - 1 < 0) {
            upBox = this.matrix[row - 1][column];
            result = (thisBox.type == upBox.type);
        };

        if (!upBox || !result) {
            // if(duplicate.length> 2){
            // 	console.log("top: " + duplicate[0].row + "," + duplicate[0].column);
            // }
            return duplicate;
        };

        var obj = {
            "row": row - 1,
            "column": column
        };

        duplicate.push(obj);
        return this.scanUp(row - 1, column, duplicate);
    },

    scanBotton: function(row, column, duplicate) {

        var thisBox = this.matrix[row][column];
        var botBox = false;
        var result = false;

        if (row + 1 < this.matrixHeight) {
            botBox = this.matrix[row + 1][column];
            result = (thisBox.type == botBox.type);
        };

        if (!botBox || !result) {
            // if(duplicate.length> 2){
            // 	console.log("bot: " + duplicate[0].row + "," + duplicate[0].column);
            // }
            return duplicate;
        };

        var obj = {
            "row": row + 1,
            "column": column
        };
        duplicate.push(obj);
        return this.scanBotton(row + 1, column, duplicate);

    },

    mouseDown: function(sprite, pointer) {
        this.selectFx.play();
        var inputX = pointer.x;
        var inputY = pointer.y;
        var i = sprite.row;
        var j = sprite.column;
        // console.log(i + "," + j);
        if (this.adjacentActive(i, j)) {
            game.tweens.remove(this.activeTween);
            this.matrix[this.active.row][this.active.column].scale.setTo(1, 1);
            this.swapEmit(this.active.row, this.active.column, i, j);
            this.active = false;
        } else {
            if (this.active) {
                game.tweens.remove(this.activeTween);
                this.matrix[this.active.row][this.active.column].scale.setTo(1, 1);
            };
            this.active = {
                "row": i,
                "column": j
            }
            var activeBox = this.matrix[i][j];
            activeBox.bringToTop();
            this.activeTween = game.add.tween(activeBox.scale).to({
                x: 1.2,
                y: 1.2
            }, 500, Phaser.Easing.Quadratic.InOut, false, 0, 100000, true).start();
            // console.log("active");
        }
    },

    adjacentActive: function(i, j) {
        if (!this.active) {
            return false;
        }
        if (this.active.row == i) {
            return (this.active.column - j == 1 || this.active.column - j == -1);
        };
        if (this.active.column == j) {
            return (this.active.row - i == 1 || this.active.row - i == -1);
        };
        return false;
    },

    swap: function(i1, j1, i2, j2) {
        var temp = this.matrix[i1][j1];
        var x1 = this.matrix[i1][j1].x;
        var y1 = this.matrix[i1][j1].y;
        var x2 = this.matrix[i2][j2].x;
        var y2 = this.matrix[i2][j2].y;
        this.matrix[i1][j1] = this.matrix[i2][j2];
        this.matrix[i2][j2] = temp;
        var pic1 = this.matrix[i1][j1];
        pic1.row = i1;
        pic1.column = j1;
        var pic2 = this.matrix[i2][j2];
        pic2.row = i2;
        pic2.column = j2;
        game.add.tween(pic1).to({
            x: x1,
            y: y1
        }, 400, Phaser.Easing.Quadratic.InOut).start();
        game.add.tween(pic2).to({
            x: x2,
            y: y2
        }, 400, Phaser.Easing.Quadratic.InOut).start();
    },

    swapEmit: function(i1, j1, i2, j2) {
        game.input.enabled = false;
        this.dropping = true;
        this.swap(i1, j1, i2, j2);
        game.time.events.add(500, function() {
            var remove = this.scanBox(i1, j1).concat(this.scanBox(i2, j2));
            if (remove.length > 0) {
                // for (var i = 0 ; i < remove.length ; i++) {
                // 	console.log("remove: "+ remove[i].row + ","+ remove[i].column);
                // };
                this.removeBox(remove);
            } else {
                this.dropping = false;
                this.swap(i1, j1, i2, j2);
            }

        }, this);
    },

    scanBox: function(i, j) {
        var remove = [];
        var hori = this.scanLeft(i, j, []).concat(this.scanRight(i, j, []));
        var vert = this.scanUp(i, j, []).concat(this.scanBotton(i, j, []));
        if (hori.length >= 2) {
            remove = remove.concat(hori);
            // console.log(remove);
        }
        if (vert.length >= 2) {
            remove = remove.concat(vert);
            // console.log(remove);
        };
        if (remove.length >= 2) {
            remove.push({
                "row": i,
                "column": j
            });
            if (remove.length > 3) {
                var result = true;
                for (var k = 0; k < remove.length; k ++) {
                    var row = remove[k].row;
                    var column = remove[k].column;
                    if ( this.matrix[row][column].bonusCount > 0) {
                        result = false;
                        this.matrix[row][column].bonusCount = Math.max(remove.length, 
                            this.matrix[row][column].bonusCount);
                    };
                };
                if (result) {
                    this.matrix[i][j].bonusCount = 1;
                    this.matrix[i][j].bonus = remove.length;
                };
            };
        };
        return remove;
    },

    removeBox: function(remove) {
        if (remove.length == 0) {
            this.dropping = false;
            return;
        }
        var emitters = [];
        var drop = [];
        var removeNum = 0;
        for (var i = 0; i < remove.length; i++) {
            var row = remove[i].row;
            var column = remove[i].column;
            var diebox = this.matrix[row][column];
            if (diebox) {
                if (diebox.bonusCount && diebox.bonusCount > 0) { 
                    this.matrix[row][column].bonusCount --;
                    //TODO: add bonus animation
                    this.matrix[row][column].rotation = 3.14; 
                    continue; 
                };
                removeNum++;
                switch (diebox.type) {
                    case 0:
                        this.attackGroup.add(diebox);
                        break;
                    case 1:
                        this.healGroup.add(diebox);
                        break;
                    case 2:
                        this.magicGroup.add(diebox);
                        break;
                    case 3:
                        this.expGroup.add(diebox);
                        break;
                }
                this.boxGroup.remove(diebox);
                var emitter = game.add.emitter(diebox.x, diebox.y, 100);
                emitters.push(emitter);
                emitter.makeParticles('diamond');
                emitter.bringToTop = true;
                emitter.setAlpha(1, 0, 1000);
                emitter.setScale(1, 0.5, 1, 0.5, 1000, Phaser.Easing.Sinusoidal.InOut, true);
                emitter.start(true, 1000, null, 10);
                game.add.tween(diebox).to({
                    alpha: 0.5
                }, 400, Phaser.Easing.Linear.None).start();
                game.add.tween(diebox.scale).to({
                    x: 1.5,
                    y: 1.5
                }, 400, Phaser.Easing.Linear.None).start();
                this.matrix[row][column] = false;
                drop[column] = true;
            }
        }
        if (removeNum == 3) {
            this.removeFx.play();
        };
        if (removeNum > 3) {
            this.removeMultiFx.play();
        };

        game.time.events.add(400, function() {
            for (var i = 0; i < emitters.length; i++) {
                game.world.remove(emitters[i]);
            };
            var moveX = Math.random() * 120 + this.monster.body.x - 60;
            var moveY = Math.random() * 120 + this.monster.body.y - 60;
            this.dropBox(drop);
            this.reactBox(this.attackGroup, moveX, moveY, this.sendPhysic);
            this.reactBox(this.healGroup, 100, 226, this.sendHeal);
            this.reactBox(this.magicGroup, moveX, moveY, this.sendMagic);
            this.reactBox(this.expGroup, 100, 280, this.sendExp);
        }, this);
    },

    dropBox: function(drop) {
        for (var i = 0; i < drop.length; i++) {
            if (drop[i]) {
                var dropSize = 0;
                for (var j = this.matrix.length - 1; j >= 0; j--) {
                    var box = this.matrix[j][i];
                    if (!box) {
                        dropSize++;
                        continue;
                    }
                    if (dropSize == 0) {
                        continue;
                    }
                    this.matrix[j + dropSize][i] = box;
                    this.matrix[j + dropSize][i].row = j + dropSize;
                    this.matrix[j][i] = false;
                    var movey = this.matrix[j + dropSize][i].y + dropSize * this.boxSize;
                    game.add.tween(this.matrix[j + dropSize][i]).to({
                        x: "+0",
                        y: movey
                    }, 400, Phaser.Easing.Quadratic.InOut).start();
                };

                for (var s = 1; s <= dropSize; s++) {
                    var row = dropSize - s;
                    var x = this.margin + this.boxSize / 2 + i * this.boxSize;
                    var y = this.boxSize / 2 + 720 - this.margin - this.matrixHeight * this.boxSize - s * this.boxSize;
                    var d1 = [];
                    var d2 = []
                    var leftType = -1;
                    var botType = -1;
                    var type = -1;

                    if (row + 1 < this.matrixHeight) {
                        d1 = this.scanBotton(row + 1, i, [{
                            "row": row + 1,
                            "column": i
                        }])
                    };

                    if (i > 0) {
                        d2 = this.scanLeft(row, i - 1, [{
                            "row": row,
                            "column": i - 1
                        }]);
                    };

                    if (d1.length > 1) {
                        botType = this.matrix[row + 1][i].type;
                    }

                    if (d2.length > 1) {
                        leftType = this.matrix[row][i - 1].type;
                    };

                    while (type < 0 || type == botType || type == leftType) {
                        type = Math.floor(Math.random() * 4);
                    };

                    var pic = this.game.add.sprite(x, y, 'box', type);
                    this.boxGroup.add(pic);
                    pic.anchor.setTo(0.5, 0.5);
                    pic.type = type
                    pic.row = row;
                    pic.column = i;
                    pic.inputEnabled = true;
                    pic.events.onInputDown.add(this.mouseDown, this);
                    this.matrix[row][i] = pic;
                    var movey = y + dropSize * this.boxSize;
                    game.add.tween(this.matrix[row][i]).to({
                        x: "+0",
                        y: movey
                    }, 500, Phaser.Easing.Quadratic.InOut).start();
                }

            };
        }
        game.time.events.add(500, function() {
            this.removeBox(this.scanWhole());
        }, this);
    },

    reactBox: function(group, moveX, moveY, callBack) {
        if (group.length > 0) {
            var bonusRate = 1.0;
            group.forEach(function(diebox) {
                game.add.tween(diebox).to({
                    x: moveX,
                    y: moveY
                }, 400, Phaser.Easing.Quadratic.InOut).start();
                game.add.tween(diebox).to({
                    alpha: 0.2
                }, 400, Phaser.Easing.Quadratic.InOut).start();
                if (diebox.bonus > 0) {
                    bonusRate += diebox.bonus/10;
                };
            }, this);
            game.time.events.add(400, function() {
                group.emitter.x = moveX;
                group.emitter.y = moveY;
                group.emitter.start(true, 1000, null, 10);
                callBack.bind(this)(moveX, moveY, group.length * bonusRate);
                group.removeAll();
            }, this);
        }
    },


    monsterAttack: function(attackTime, damage) {
        if (this.monster.alive && this.currentHealth > 0) {
            game.input.enabled = false;
            this.monster.attack(attackTime);
            this.currentHealth -= damage;
            if (this.currentHealth <= 0) {
                this.currentHealth=0;
                this.gameOver();
            };
            this.refreshHealth();
            this.displayDamage("-" + damage, "luminari-red", 20, 220, 290, 150);
        };
        this.game.time.events.add((2 + Math.random() * 10) * 1000, function() {
                var attackTime = Math.floor(1 + Math.random() * 3);
                var damage = this.monster.getDamage(attackTime);
                this.monsterAttack(attackTime, damage);
        }, this);
    },



    sendHeal: function(x, y, size) {
        var heal = this.myCharacter.healAmount(size);
        this.displayDamage("+" + heal, "luminari-green", 10, x, y, 40);
        this.currentHealth += heal
        if (this.currentHealth > this.totalHealth) {
            this.currentHealth = this.totalHealth;
        };
        this.refreshHealth();

    },

    sendPhysic: function(x, y, size) {
        var damage = this.myCharacter.pAttack(size);
        this.hurtFx.play();
        this.displayDamage("-" + damage, "luminari-red", 10, x, y, 60);
        if (this.monster.alive) {
            this.monster.attacked(damage);
        }
    },

    sendMagic: function(x, y, size) {
        this.hurtFx.play();
        var damage = this.myCharacter.mAttack(size);
        this.displayDamage("-" + damage, "luminari-pink", 10, x, y, 60);
        if (this.monster.alive) {
            this.monster.attacked(damage);
        }
    },

    sendExp: function(x, y, size) {
        var exp = this.monster.giveExp(size)
        this.myCharacter.gainExp(exp);
        this.displayDamage("+" + exp, "luminari-yellow", 10, x, y, 40);
    },

    displayDamage: function(damage, font, size, x, y, moveY) {
        var text = game.add.bitmapText(x, y, font, damage, size);
        this.damageTags.add(text);
        var moveX = Math.floor(Math.random() * 50 - 40);
        game.add.tween(text).to({
            alpha: 0
        }, 500, Phaser.Easing.Quadratic.InOut, false, 1000).start();
        game.add.tween(text).to({
            x: "" + moveX,
            y: "-" + moveY
        }, 1200, Phaser.Easing.Quadratic.InOut).start();
        game.add.tween(text.scale).to({
            x: 2,
            y: 2
        }, 1200, Phaser.Easing.Quadratic.InOut).start();
    },

    refreshHealth: function() {
        this.healthTag.text = this.currentHealth + "/" + this.totalHealth;
        game.add.tween(this.healthBar.scale).to({
            x: (this.currentHealth / this.totalHealth)
        }, 1200, Phaser.Easing.Quadratic.InOut).start();
    },

    gameOver: function(){
    	this.game.input.enabled = false;
        game.add.sprite(0,0,"gameOver");
        new Dialog("游戏结束","你被砍死了！");

    	//gameOverImg.alpha = 0;
    	//this.game.add.tween(gameOverImg).to({
         //           alpha: 1
         //       }, 400, Phaser.Easing.Linear.None).start();
    	//this.game.time.events.add(2000,function(){
    	//	this.game.input.enabled = true;
    	//	this.game.state.start('waitState');
    	//})
    },
    

    loadCharacter: function(){
        this.myCharacter = new Character(0,0,"name",0);
        this.game.add.sprite(64, 270, "personBar", 2).scale.x = 0.7;
        var chaImg = this.game.add.sprite(64, 241, "charasHead", this.myCharacter.job);
        var personBar = this.game.add.sprite(64, 270, "personBar", 1);
        var lvTag = this.game.add.bitmapText(64, 250, "luminari-white", "Lv:" + this.myCharacter.level, 20);
        this.myCharacter.levelTag = lvTag;
        this.myCharacter.head = chaImg;
        this.myCharacter.expBar = personBar;
        this.myCharacter.gainExp(0);
        chaImg.scale.x = -1;
        this.totalHealth = this.myCharacter.health;
        this.currentHealth = this.myCharacter.health;
        return;
    }
}