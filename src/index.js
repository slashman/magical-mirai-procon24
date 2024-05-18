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

const selectedSong = songs.futureSymphony;

const animateWord = function (now, unit) {
  if (unit.contains(now) && !unit.spent) {
    unit.spent = true;
    console.log(unit.previous.endTime - unit.startTime);
    if (unit.previous.endTime - unit.startTime < -60) {
      document.querySelector("#text").textContent = ''; 
    }
    document.querySelector("#text").textContent += unit.text;
    if (unit.language === "en") {
      document.querySelector("#text").textContent += " ";
    }
  }
};

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
  while (w) {
    debugger;
    w.animate = animateWord;
    w = w.next;
  }
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

/**
 * 動画の再生位置が変更されたときに呼ばれる（あまりに頻繁な発火を防ぐため一定間隔に間引かれる）
 *
 * @param {number} position - https://developer.textalive.jp/packages/textalive-app-api/interfaces/playereventlistener.html#onthrottledtimeupdate
 */
function onThrottledTimeUpdate(position) {
  // 再生位置を表示する
  // Update current position
  positionEl.textContent = String(Math.floor(position));

  // さらに精確な情報が必要な場合は `player.timer.position` でいつでも取得できます
  // More precise timing information can be retrieved by `player.timer.position` at any time
}

// 再生が始まったら #overlay を非表示に
// Hide #overlay when music playback started
function onPlay() {
  document.querySelector("#overlay").style.display = "none";
}

// 再生が一時停止・停止したら歌詞表示をリセット
// Reset lyrics text field when music playback is paused or stopped
function onPause() {
  document.querySelector("#text").textContent = "-";
}
function onStop() {
  document.querySelector("#text").textContent = "-";
}
