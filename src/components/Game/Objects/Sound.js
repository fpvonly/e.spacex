class Sound {

  static playerShipBulletSounds = [];
  static explosionSounds = [];
  static music = [];

  static initializeStaticClass() {

    // player's ship gun sounds
    for (let i = 0; i< 30; i++) {
      let gunBlast = new Audio("assets/sounds/aaj_0022_Lazer_Gun_02_SFX.mp3");
      gunBlast.volume = 0.2;
      gunBlast.preload = 'auto';
      gunBlast.addEventListener("ended", function() {
        gunBlast.currentTime = 0;
      });
      Sound.playerShipBulletSounds.push(gunBlast);
    }

    // explosion sounds
    for (let i = 0; i < 15; i++) {
      let blast = new Audio("assets/sounds/cc0_explosion_large_gas_001.mp3");
      blast.volume = 0.2;
      blast.preload = 'auto';
      blast.addEventListener("ended", function() {
        blast.currentTime = 0;
      });
      Sound.explosionSounds.push(blast);
    }

    // game music
    Sound.music = new Audio('assets/sounds/slackbaba_drink_more_tea.mp3');
    Sound.music.loop = true;
    Sound.music.volume = 0.3;
  }

  static playPlayerShipBulletSound = () => {
    let playSound = null;
    for (let sound of Sound.playerShipBulletSounds) {
      if (sound.currentTime === 0) {
        playSound = sound;
        break;
      }
    }
    playSound.play();
  }

  static playExplosionSound = () => {
    let playSound = null;
    for (let sound of Sound.explosionSounds) {
      if (sound.currentTime === 0) {
        playSound = sound;
        break;
      }
    }
    playSound.play();
  }

  static playMusic = () => {
    Sound.music.play();
  }

  static pauseMusic = () => {
    Sound.music.pause();
  }

}
Sound.initializeStaticClass();

export default Sound;
