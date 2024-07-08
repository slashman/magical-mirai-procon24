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

import pencil from "./Pencil";
import pencilControls from "./PencilControls";
import resizer from "./Resizer";
import imagePreloader from "./ImagePreloader";
import introPanel from "./IntroPanel";
import animationController from "./AnimationController";

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

animationController.init(player);

resizer.init(document.getElementById("tabletContainer"));
window.addEventListener("resize", () => resizer.resizeCanvas());
window.addEventListener("load", () => resizer.resizeCanvas());

function onThrottledTimeUpdate(position) {}
function onPlay() {}
function onPause() {}
function onStop() {}