PlayState = {};
function Hero(game, x, y) {
	Phaser.Sprite.call(this, game, x, y, 'hero');
	this.anchor.set(0.5, 0.5);
	this.game.physics.enable(this);
	this.body.collideWorldBounds = true;
}

Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;
Hero.prototype.move = function (direction) {
	const SPEED = 1000;
	this.body.velocity.x = direction * SPEED; //per frame
};
Hero.prototype.jump = function () {
	const JUMP_SPEED = 4000;
	let canJump = this.body.touching.down;

	if (canJump) {
		this.body.velocity.y= -JUMP_SPEED;
	}

	return canJump;
};

Hero.prototype.bounce = function () {
	const BOUNCE_SPEED = 200;
	this.body.velocity.y = -BOUNCE_SPEED;
};

function Spider(game, x, y) {
	Phaser.Sprite.call(this, game, x, y, 'spider');

	//anchor
	this.anchor.set(0.5);
	// animation
	this.animations.add('crawl', [0, 1, 2], 8, true);
	this.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12);
	this.animations.play('crawl');

	//physics
	this.game.physics.enable(this);
	this.body.collideWorldBounds = true;
	this.body.velocity.x = Spider.SPEED;	
}
Spider.SPEED = 500

Spider.prototype = Object.create(Phaser.Sprite.prototype);
Spider.prototype.constructor = Spider;
Spider.prototype.update = function () {
	if(this.body.touching.right || this.body.blocked.right) {
		this.body.velocity.x = -Spider.SPEED;
	} else if (this.body.touching.left || this.body.blocked.left) {
		this.body.velocity.x = Spider.SPEED;
	}
}
Spider.prototype.die = function () {
	this.body.enable = false;

	this.animations.play('die').onComplete.addOnce(function () {
		this.kill();
	},this);
}
PlayState.init = function () {
	this.game.renderer.renderSession.roundPixels = true;
	this.keys = this.game.input.keyboard.addKeys({
		left: Phaser.KeyCode.LEFT,
		right: Phaser.KeyCode.RIGHT,
		up: Phaser.KeyCode.UP,
	});
	this.keys.up.onDown.add(function() {
		let didJump = this.hero.jump();
		if (didJump) {
			this.sfx.jump.play();
		}
	},this);
	this.coinPickupCount = 0;
};
PlayState.update = function () {
	this._handleInput();
	this._handleCollisions();
	this.coinFont.text = `x${this.coinPickupCount}`;
};
PlayState._handleCollisions = function () {
	this.game.physics.arcade.collide(this.spiders, this.platforms);
	this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
	this.game.physics.arcade.collide(this.hero, this.platforms);
	this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin,
		null, this);
	this.game.physics.arcade.overlap(this.hero, this.spiders,
		this._onHeroVsEnemy, null, this);
};
PlayState._onHeroVsCoin = function (hero, coin) {
	this.sfx.coin.play();
	coin.kill();
	this.coinPickupCount++;
}
PlayState._onHeroVsEnemy = function (hero, enemy) {
	if (hero.body.velocity.y > 0) {
		hero.bounce();	
		enemy.die();
		this.sfx.stomp.play();
	} else {
		this.sfx.stomp.play();
		this.game.state.restart();
	}
}
PlayState._handleInput = function () {
	if (this.keys.left.isDown) {
		this.hero.move(-1);
	}
	else if (this.keys.right.isDown) {
		this.hero.move(1);
	} else {
		this.hero.move(0);
	}
};
PlayState.preload = function() {
	this.game.load.image('background', 'images/background.jpg');
	this.game.load.json('level:1', 'data/level01.json');
	this.game.load.image('ground', 'images/ground.png');
	this.game.load.image('grass:8x1', 'images/grass_8x1.png');
	this.game.load.image('grass:6x1', 'images/grass_6x1.png');
	this.game.load.image('grass:4x1', 'images/grass_4x1.png');
	this.game.load.image('grass:2x1', 'images/grass_2x1.png');
	this.game.load.image('grass:1x1', 'images/grass_1x1.png');
	this.game.load.image('hero', 'images/hero_stopped.png');
	this.game.load.image('invisible-wall', 'images/invisible_wall.png');
	this.game.load.image('icon:coin','images/coin_icon.png');
	this.game.load.audio('sfx:jump', 'audio/jump.wav');
	this.game.load.spritesheet('coin','images/coin_animated.png', 22, 22);
	this.game.load.audio('sfx:coin', 'audio/coin.wav');
	this.game.load.spritesheet('spider','images/spider.png', 42, 32);
	this.game.load.audio('sfx:stomp','audio/stomp.wav');
	this.game.load.image('font:numbers', 'images/numbers.png');
};

PlayState.create = function () {
	this.game.add.image(0, 0, 'background');
	this._loadLevel(this.game.cache.getJSON('level:1'));
	this.sfx = {
		jump: this.game.add.audio('sfx:jump'),
		coin: this.game.add.audio('sfx:coin'),
		stomp:this.game.add.audio('sfx:stomp'),
	};
	this._createHud();
};
PlayState._loadLevel = function (data) {
	this.platforms = this.game.add.group();
	this.coins = this.game.add.group();
	this.spiders = this.game.add.group();
	this.enemyWalls = this.game.add.group();
	this.enemyWalls.visible = false;	

	data.platforms.forEach(this._spawnPlatform, this);
	this._spawnCharacters({hero: data.hero, spiders: data.spiders});
	//Gravity
	const GRAVITY = 5000;
	this.game.physics.arcade.gravity.y = GRAVITY;
	data.coins.forEach(this._spawnCoin, this);

};
PlayState._spawnCharacters = function(data) {
	data.spiders.forEach(function (spider) {
		let sprite = new Spider(this.game, spider.x, spider.y);
		this.spiders.add(sprite);
	},this);
	this.hero = new Hero(this.game, data.hero.x, data.hero.y);
	this.game.add.existing(this.hero);
	
};
PlayState._spawnPlatform = function (platform) {
	let sprite = this.platforms.create(
		platform.x, platform.y, platform.image);
	this.game.physics.enable(sprite);
	sprite.body.allowGravity = false;
	sprite.body.immovable = true;

	this._spawnEnemyWall(platform.x, platform.y, 'left');
	this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
};
PlayState._spawnEnemyWall = function (x, y, side) {
	let sprite = this.enemyWalls.create(x, y, 'invisible-wall');
	sprite.anchor.set(side === 'left' ? 1 : 0, 1);

	this.game.physics.enable(sprite);
	sprite.body.immovable = true;
	sprite.body.allowGravity = false;
};
PlayState._spawnCoin = function (coin) {
	let sprite = this.coins.create(coin.x, coin.y, 'coin');
	sprite.anchor.set(0.5, 0.5);
	sprite.animations.add('rotate', [0, 1, 2, 1], 6, true);
	sprite.animations.play('rotate');
	this.game.physics.enable(sprite);
	sprite.body.allowGravity = false; 
};
PlayState._createHud = function () {
	const NUMBERS_STR = '0123456789X ';
	this.coinFont = this.game.add.retroFont('font:numbers', 20, 26,
		NUMBERS_STR, 6);
	let coinIcon = this.game.make.image(0, 0, 'icon:coin');
	let coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width,
		coinIcon.height / 2, this.coinFont);
	coinScoreImg.anchor.set(0, 0.5);

	this.hud = this.game.add.group();
	this.hud.add(coinIcon);
	this.hud.position.set(10, 10);
	this.hud.add(coinScoreImg);
};



window.onload = function() {
	let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
	game.state.add('play', PlayState);
	game.state.start('play');
};
