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

const songs = {
  superHero: {
    url: "https://piapro.jp/t/hZ35/20240130103028",
    corrections: { 
      // Music map correction history
      beatId : 4592293 , 
      chordId : 2727635 , 
      repetitiveSegmentId : 2824326 , 
      // Lyrics timing correction history: https://textalive.jp/lyrics/piapro.jp%2Ft%2FhZ35%2F20240130103028
      lyricId : 59415 , 
      lyricDiffId : 13962 
    }
  },
  theFutureISpoke: {
    url: "https://piapro.jp/t/--OD/20240202150903",
    corrections: {
        beatId: 4592296,
        chordId: 2727636,
        repetitiveSegmentId: 2824327,
        // Lyric timing correction history: https://textalive.jp/lyrics/piapro.jp%2Ft%2F--OD%2F20240202150903
        lyricId: 59416,
        lyricDiffId: 13963
    }
  },
  futureNotes: {
    url: "https://piapro.jp/t/XiaI/20240201203346",
    corrections: {
      beatId: 4592297,
      chordId: 2727637,
      repetitiveSegmentId: 2824328,
      // Lyrics timing correction history: https://textalive.jp/lyrics/piapro.jp%2Ft%2FXiaI%2F20240201203346
      lyricId: 59417,
      lyricDiffId: 13964
    }
  },
  futureSymphony: {
    url: "https://piapro.jp/t/Rejk/20240202164429",
    corrections: {
      beatId: 4592298,
      chordId: 2727638,
      repetitiveSegmentId: 2824329,
      // Lyric timing correction history: https://textalive.jp/lyrics/piapro.jp%2Ft%2FRejk%2F20240202164429
      lyricId: 59418,
      lyricDiffId: 13965
    }
  }
};

const selectedSong = songs.futureNotes;

const animateWord = function (now, unit) {
  if (unit.contains(now) && !unit.spent) {
    unit.spent = true;
    console.log(unit.previous.endTime - unit.startTime);
    if (unit.previous.endTime - unit.startTime < -60) {
      clearText();
    }
    addText(unit.text);
    if (unit.language === "en") {
      addText(" ");
    }    
  }
};

/*
let textCount = 0;
function addText(str) {
  textCount++;
  if (textCount > 11) {
    clearText();
  }
  document.getElementById("svgText").innerHTML += str;
}

function clearText() {
  // document.querySelector("#text").textContent = ''; 
  document.getElementById("svgText").innerHTML = '';
  textCount = 0;
}
*/

let textCount = 0;
const cursorStart = 10;
let cursorX = cursorStart;
let lineY = 1;
function addText(str) {
  textCount++;
  if (textCount > 19) {
    // All text used sorry
    return;
  }
  const txElement = document.getElementById("tx" + textCount);
  txElement.innerHTML = str;
  const charWidth = 64; // getTextWidth(str, "Arial 64pt");
  console.log("charWidth", charWidth);
  cursorX += charWidth;
  cursorX += Math.floor(Math.random() * 15) - 7;
  if (cursorX > 700) {
    lineY++;
    cursorX = cursorStart + charWidth + Math.floor(Math.random() * 20) - 10;
  }
  const cursorY = (lineY * (80 + 10)) + Math.floor(Math.random() * 10) - 5;
  txElement.setAttribute("x", cursorX);
  txElement.setAttribute("y", cursorY);
}

function getTextWidth(text, font) {
  // re-use canvas object for better performance
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

function clearText() {
  for (let i = 1; i <= 19; i++) {
    const txElement = document.getElementById("tx" + i);
    txElement.innerHTML = "";
  }
  textCount = 0;
  cursorX = 40;
  lineY = 1;
}

let flipped = false;
function flipMiku () {
  flipped = !flipped;
  if (flipped) {
    document.getElementById("svgMiku").setAttribute('transform', "scale(-1,1) translate(-880, 0)");
  } else {
    document.getElementById("svgMiku").setAttribute('transform', "scale(1,1) translate(0, 0)");
  }
}

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
const jumpBtn = document.querySelector("#jump");
const pauseBtn = document.querySelector("#pause");
const rewindBtn = document.querySelector("#rewind");
const positionEl = document.querySelector("#position strong");

const artistSpan = document.querySelector("#artist span");
const songSpan = document.querySelector("#song span");

/**
 * TextAlive App が初期化されたときに呼ばれる
 *
 * @param {IPlayerApp} app - https://developer.textalive.jp/packages/textalive-app-api/interfaces/iplayerapp.html
 */
function onAppReady(app) {
  // TextAlive ホストと接続されていなければ再生コントロールを表示する
  // Show control if this app is launched standalone (not connected to a TextAlive host)
  if (!app.managed) {
    document.querySelector("#control").style.display = "block";

    // 再生ボタン / Start music playback
    playBtns.forEach((playBtn) =>
      playBtn.addEventListener("click", () => {
        player.video && player.requestPlay();
      })
    );

    // 歌詞頭出しボタン / Seek to the first character in lyrics text
    jumpBtn.addEventListener(
      "click",
      () =>
        player.video &&
        player.requestMediaSeek(player.video.firstChar.startTime)
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

  // 楽曲URLが指定されていなければ マジカルミライ 2020テーマ曲を読み込む
  // Load a song when a song URL is not specified
  if (!app.songUrl) {
    player.createFromSongUrl(selectedSong.url, { 
      video: selectedSong.corrections
    });
  }
  
}

/**
 * 動画オブジェクトの準備が整ったとき（楽曲に関する情報を読み込み終わったとき）に呼ばれる
 *
 * @param {IVideo} v - https://developer.textalive.jp/packages/textalive-app-api/interfaces/ivideo.html
 */
function onVideoReady(v) {
  // メタデータを表示する
  // Show meta data
  artistSpan.textContent = player.data.song.artist.name;
  songSpan.textContent = player.data.song.name;

  // 定期的に呼ばれる各単語の "animate" 関数をセットする
  // Set "animate" function
  let w = player.video.firstWord;
  /*while (w) {
    w.animate = animateWord;
    w = w.next;
  }*/
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
    document
      .querySelectorAll("button")
      .forEach((btn) => (btn.disabled = false));
  }

  // 歌詞がなければ歌詞頭出しボタンを無効にする
  // Disable jump button if no lyrics is available
  jumpBtn.disabled = !player.video.firstChar;
}

function step(timeStamp) {
  update(timeStamp);
  window.requestAnimationFrame(step);
}

let currentIndex = -1;
let previousProgress = -1;
let resetBeat = false;
let spaceRendered = false;
let previousWord;

function update() {
  const position = player.timer.position;
  positionEl.textContent = String(Math.floor(position));
  if (!player.video) {
    return;
  }
  const beat = player.findBeat(position);
  if (beat) {
    const progress = beat.progress(position);
    if (progress < 0.1) {
      resetBeat = true;
    }
    //document.getElementById("beat") .style.height = (progress * 200) + "px";
    if (progress > 0.9 && resetBeat) {
      resetBeat = false;
      flipMiku();
    }
  }
  const char = player.video.findChar(position, { loose: false });
  if (!char) {
    if (!spaceRendered) {
      addText(" ");
      spaceRendered = true;
    }
    return;
  }
  spaceRendered = false;
  const phrase = player.video.findPhrase(position);
  // if (phrase && phrase.progress(position) > 0.95) {
  if (phrase.progress(position) < previousProgress) {
    clearText();
  }
  previousProgress = phrase.progress(position);
  const word = player.video.findWord(position);
  if (previousWord && word != previousWord) {
    console.log(previousWord.language);
    if (previousWord.language == "en") {
      addText(" ");
    }
  }
  previousWord = word;
  const index = player.video.findIndex(char);
  if (index === currentIndex) {
    return;
  }
  currentIndex = index;
  
  /*if (unit.previous.endTime - unit.startTime < -60) {
    clearText();
  }*/
  addText(char.text);
  // さらに精確な情報が必要な場合は `player.timer.position` でいつでも取得できます
}

window.requestAnimationFrame(step);

/**
 * 動画の再生位置が変更されたときに呼ばれる（あまりに頻繁な発火を防ぐため一定間隔に間引かれる）
 *
 * @param {number} position - https://developer.textalive.jp/packages/textalive-app-api/interfaces/playereventlistener.html#onthrottledtimeupdate
 */
function onThrottledTimeUpdate(position) {
  // 再生位置を表示する
  // Update current position
  //positionEl.textContent = String(Math.floor(position));

  // さらに精確な情報が必要な場合は `player.timer.position` でいつでも取得できます
  // More precise timing information can be retrieved by `player.timer.position` at any time
}

// 再生が始まったら #overlay を非表示に
// Hide #overlay when music playback started
function onPlay() {
  document.querySelector("#overlay").style.display = "none";
}

function onPause() {}
function onStop() {}
