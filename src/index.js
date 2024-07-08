/**
 * Based on TextAlive App API basic example
 * https://github.com/TextAliveJp/textalive-app-basic
 *
 * API チュートリアル「1. 開発の始め方」のサンプルコードです。
 * 発声中の歌詞を単語単位で表示します。
 * また、このアプリが TextAlive ホストと接続されていなければ再生コントロールを表示します。
 * https://developer.textalive.jp/app/
 */

import { Player } from "textalive-app-api";

import animations from "./Animations";
import pencil from "./Pencil";
import PencilLayer from "./PencilLayer";
import pencilControls from "./PencilControls";
import resizer from "./Resizer";
import imagePreloader from "./ImagePreloader";
import introPanel from "./IntroPanel";
import lyricsRenderer from "./LyricsRenderer";

const animationSpeed = 4; // Frame per beat
let bopIndex = 0;
let flipped = false;
const mikuAnimation = animations[0];

function flipMiku () {
  bopIndex++;
  mikuAnimation.step();
  const baseX = 200;
  let baseY = 60;
  let bopped = false;
  if (bopIndex > 1) {
    flipped = !flipped;
    if (flipped) {
      baseY -= 9;
      bopped = true;
    }
    bopIndex = 0;
  }
  document.getElementById("svgMikuBody").setAttribute('href', imagePreloader.getImageData(mikuAnimation.frameName));
  document.getElementById("svgMikuBody").setAttribute('y', baseY);
  document.getElementById("svgMikuEyes").setAttribute('x', baseX + mikuAnimation.trackEyeX);
  document.getElementById("svgMikuEyes").setAttribute('y', baseY + mikuAnimation.trackEyeY);
  document.getElementById("svgMikuMouth").setAttribute('x', baseX + mikuAnimation.trackEyeX);
  document.getElementById("svgMikuMouth").setAttribute('y', baseY + mikuAnimation.trackEyeY);

  pencil.moveLayer(
    PencilLayer.LEFT_HAND,
    mikuAnimation.trackLeftHandX,
    mikuAnimation.trackLeftHandY + (bopped ? -9 : 0)
  );

  pencil.moveLayer(
    PencilLayer.RIGHT_HAND,
    mikuAnimation.trackRightHandX,
    mikuAnimation.trackRightHandY + (bopped ? -9 : 0)
  );

  pencil.moveLayer(
    PencilLayer.HEAD,
    mikuAnimation.trackEyeX,
    mikuAnimation.trackEyeY + (bopped ? -9 : 0)
  );
}

let flippedMouth = false;
function changeMouth () {
  flippedMouth = !flippedMouth;
  if (flippedMouth) {
    document.getElementById("svgMikuMouth").setAttribute('href', imagePreloader.getImageData("img/miku2/bocas0002.png"));
  } else {
    document.getElementById("svgMikuMouth").setAttribute('href', imagePreloader.getImageData("img/miku2/bocas0005.png"));
  }
}

function setMouth (type) {
  document.getElementById("svgMikuMouth").setAttribute('href', imagePreloader.getImageData("img/miku2/bocas000"+type+".png"));
}

let flippedEyes = false;
function changeEyes () {
  if (Math.random() > 0.8) {
    return;
  }
  flippedEyes = !flippedEyes;
  if (flippedEyes) {
    document.getElementById("svgMikuEyes").setAttribute('href', imagePreloader.getImageData("img/miku2/eyes1.png"));
  } else {
    document.getElementById("svgMikuEyes").setAttribute('href', imagePreloader.getImageData("img/miku2/eyes3.png"));
  }
}

pencil.initForElement(document.getElementById('tabletMask'));

pencilControls.init();

// TextAlive Player を作る
// Instantiate a TextAlive Player instance
const player = new Player({
  app: {
    token: "POkMoJfIxhpi4vhO",
  },
  mediaElement: document.querySelector("#media"),
});

// TextAlive Player のイベントリスナを登録する
// Register event listeners
player.addListener({
  onAppReady,
  onVideoReady,
  onTimerReady,
  onThrottledTimeUpdate,
  onPlay,
  onPause,
  onStop,
});

const playBtns = document.querySelectorAll(".play");
const pauseBtn = document.querySelector("#pause");
const rewindBtn = document.querySelector("#rewind");

const artistSpan = document.querySelector("#artist span");
const songSpan = document.querySelector("#song span");

introPanel.init(player);


/**
 * TextAlive App が初期化されたときに呼ばれる
 *
 * @param {IPlayerApp} app - https://developer.textalive.jp/packages/textalive-app-api/interfaces/iplayerapp.html
 */
function onAppReady(app) {
  // TextAlive ホストと接続されていなければ再生コントロールを表示する
  // Show control if this app is launched standalone (not connected to a TextAlive host)
  if (!app.managed) {
    // 再生ボタン / Start music playback
    playBtns.forEach((playBtn) =>
      playBtn.addEventListener("click", () => {
        pencilControls.hidePointerElements();
        player.video && player.requestPlay();
      })
    );

    // 一時停止ボタン / Pause music playback
    pauseBtn.addEventListener(
      "click",
      () => player.video && player.requestPause()
    );

    // 巻き戻しボタン / Rewind music playback
    rewindBtn.addEventListener(
      "click",
      () => player.video && player.requestMediaSeek(0)
    );

    document
      .querySelector("#header a")
      .setAttribute(
        "href",
        "https://developer.textalive.jp/app/run/?ta_app_url=https%3A%2F%2Ftextalivejp.github.io%2Ftextalive-app-basic%2F&ta_song_url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DygY2qObZv24"
      );
  } else {
    document
      .querySelector("#header a")
      .setAttribute(
        "href",
        "https://textalivejp.github.io/textalive-app-basic/"
      );
  }

  introPanel.onAppReady(app.songURL);
 
}

function onVideoReady(v) {
  artistSpan.textContent = player.data.song.artist.name;
  songSpan.textContent = player.data.song.name;
}

/**
 * 音源の再生準備が完了した時に呼ばれる
 *
 * @param {Timer} t - https://developer.textalive.jp/packages/textalive-app-api/interfaces/timer.html
 */
function onTimerReady(t) {
  // ボタンを有効化する
  // Enable buttons
  if (!player.app.managed) {
    imagePreloader.preload().then(() => {
      resizer.resizeCanvas();
      document.getElementById("loadingTxt").remove();
      introPanel.dismiss();
      document
        .querySelectorAll("button")
        .forEach((btn) => (btn.disabled = false));
    });
  }
}

function step(timeStamp) {
  update(timeStamp);
  window.requestAnimationFrame(step);
}

let currentIndex = -1;
let previousProgress = -1;
let lastFrame = -1;
let spaceRendered = false;
let previousWord;
let previousBeat;

function update() {
  const position = player.timer.position;
  if (!player.video) {
    return;
  }
  const beat = player.findBeat(position);
  if (beat) {
    if (beat != previousBeat) {
      previousBeat = beat;
    }
    const progress = beat.progress(position);
    const frame = Math.floor(progress * animationSpeed)
    if (frame != lastFrame) {
      flipMiku();
      lastFrame = frame;
      
    }
  }
  const char = player.video.findChar(position, { loose: false });
  if (!char) {
    if (!spaceRendered) {
      lyricsRenderer.addText(" ");
      spaceRendered = true;
    }
    setMouth(4);
    document.getElementById("svgMikuEyes").setAttribute('href', imagePreloader.getImageData("img/miku2/eyes1.png"));
    return;
  }
  spaceRendered = false;
  const phrase = player.video.findPhrase(position);
  if (phrase.progress(position) < previousProgress) {
    changeEyes();
    lyricsRenderer.clearText();
  }
  previousProgress = phrase.progress(position);
  const word = player.video.findWord(position);
  if (previousWord && word != previousWord) {
    if (previousWord.language == "en") {
      lyricsRenderer.addText(" ");
    }
  }
  previousWord = word;
  const index = player.video.findIndex(char);
  if (index !== currentIndex) {
    lyricsRenderer.addText(char.text);
    word.uttered = false;
    word.finished = false;
  }
  currentIndex = index;
  if (!word.uttered) {
    changeMouth();
    word.uttered = true;
  }
}

window.requestAnimationFrame(step);

resizer.init(document.getElementById("tabletContainer"));
window.addEventListener("resize", () => resizer.resizeCanvas());
window.addEventListener("load", () => resizer.resizeCanvas());

function onThrottledTimeUpdate(position) {}
function onPlay() {}
function onPause() {}
function onStop() {}