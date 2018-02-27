import * as C from '../Constants';

class Sprite {

  static explosionSpriteAnimFrames = [];
  static enemySprites = {};
  static bulletSprites = {};
  static playerShipSprite = null;
  static gameBg = null;

  static initializeStaticClass() {
    // explosion animation frames
    for (let i = 1; i <= 13; i++) {
      let explosionBg = new Image();
      explosionBg.src = 'assets/images/explosions/' + i + '.png';
      Sprite.explosionSpriteAnimFrames.push(explosionBg);
    }

    // enemy sprites
    let enemyBg = new Image();
    enemyBg.src = "assets/images/enemy.png";
    Sprite.enemySprites[C.ROTATING_UFO] = enemyBg;
    enemyBg = new Image();
    enemyBg.src = "assets/images/enemy_3.png";
    Sprite.enemySprites[C.ROTATING_UFO_2] = enemyBg;
    enemyBg = new Image();
    enemyBg.src = "assets/images/enemy_2.png";
    Sprite.enemySprites[C.BLUE_UFO] = enemyBg;
    enemyBg = new Image();
    enemyBg.src = "assets/images/a10003.png";
    Sprite.enemySprites[C.ASTEROID] = enemyBg;

    // bullet sprites
    let bulletBg = new Image();
    bulletBg.src = "assets/images/bullet_3.png";
    Sprite.bulletSprites[C.ROTATING_UFO] = bulletBg;
    bulletBg = new Image();
    bulletBg.src = "assets/images/bullet.png";
    Sprite.bulletSprites[C.ROTATING_UFO_2] = bulletBg;
    bulletBg = new Image();
    bulletBg.src = "assets/images/bullet.png";
    Sprite.bulletSprites[C.BLUE_UFO] = bulletBg;
    bulletBg = new Image();
    bulletBg.src = "assets/images/bullet_2.png";
    Sprite.bulletSprites[C.PLAYER_SHIP] = bulletBg;

    // player ship sprite
    let shipBg = new Image();
    shipBg.src = "assets/images/ship_1.png";
    Sprite.playerShipSprite = shipBg;

    // game's scrolling background
    let gameBg = new Image();
    gameBg.src = "assets/images/game_scroll_stars.png";
    Sprite.gameBg = gameBg;

  }

  static getLoadingStatusInfo = () => {
    let all = 0;
    let loaded = 0;

    for (let frame of Sprite.explosionSpriteAnimFrames) {
      all++;
      if (frame.complete === true) {
        loaded++;
      }
    }
    for (let type in Sprite.enemySprites) {
      all++;
      if (Sprite.enemySprites[type].complete === true) {
        loaded++;
      }
    }
    for (let type in Sprite.bulletSprites) {
      all++;
      if (Sprite.bulletSprites[type].complete === true) {
        loaded++;
      }
    }
    if (Sprite.playerShipSprite.complete === true) {
      all++;
      loaded++;
    }
    if (Sprite.gameBg.complete === true) {
      all++;
      loaded++;
    }
    
    return 'Images: ' + Math.floor((loaded/all)*100) + '%';
  }

  static spritesLoaded = () => {
    let loaded = true;

    for (let frame of Sprite.explosionSpriteAnimFrames) {
      if (frame.complete === false) {
        loaded = false;
      }
    }
    for (let type in Sprite.enemySprites) {
      if (Sprite.enemySprites[type].complete === false) {
        loaded = false;
      }
    }
    for (let type in Sprite.bulletSprites) {
      if (Sprite.bulletSprites[type].complete === false) {
        loaded = false;
      }
    }
    if (Sprite.playerShipSprite.complete === false) {
      loaded = false;
    }
    if (Sprite.gameBg.complete === false) {
      loaded = false;
    }

    return loaded;
  }

  static getExplosionSpriteAnimFrames = () => {
    return Sprite.explosionSpriteAnimFrames.slice(); // needs to return a copy of the array!
  }

  static getEnemySprite = (enemyType) => {
    return Sprite.enemySprites[enemyType];
  }

  static getBulletSprite = (type) => {
    return Sprite.bulletSprites[type];
  }

  static getPlayerShipSprite = () => {
    return Sprite.playerShipSprite;
  }

  static getGameBg = () => {
    return Sprite.gameBg;
  }

}
Sprite.initializeStaticClass();

export default Sprite;
