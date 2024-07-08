import { IPlayerApp, Player, Timer } from "textalive-app-api";
import pencilControls from "./PencilControls";
import introPanel from "./IntroPanel";
import imagePreloader from "./ImagePreloader";
import resizer from "./Resizer";

/**
 * Based on TextAlive App API basic example
 * https://github.com/TextAliveJp/textalive-app-basic
 *
 * API チュートリアル「1. 開発の始め方」のサンプルコードです。
 * 発声中の歌詞を単語単位で表示します。
 * また、このアプリが TextAlive ホストと接続されていなければ再生コントロールを表示します。
 * https://developer.textalive.jp/app/
 */

class TextAliveAdapter {
	init(): Player {
		const player = new Player({
			app: { token: "POkMoJfIxhpi4vhO" },
			mediaElement: document.querySelector("#media") as HTMLElement,
		});
		
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

		function onThrottledTimeUpdate() {}
		function onPlay() {}
		function onPause() {}
		function onStop() {}
		function onAppReady(app: IPlayerApp) {
			if (!app.managed) {
				playBtns.forEach((playBtn) =>
					playBtn.addEventListener("click", () => {
						pencilControls.hidePointerElements();
						player.video && player.requestPlay();
					})
				);
				pauseBtn.addEventListener(
					"click",
					() => player.video && player.requestPause()
				);
				rewindBtn.addEventListener(
					"click",
					() => player.video && player.requestMediaSeek(0)
				);

				document.querySelector("#header a").setAttribute("href",
					"https://developer.textalive.jp/app/run/?ta_app_url=https%3A%2F%2Ftextalivejp.github.io%2Ftextalive-app-basic%2F&ta_song_url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DygY2qObZv24"
				);
			} else {
				document.querySelector("#header a").setAttribute("href",
					"https://textalivejp.github.io/textalive-app-basic/"
				);
			}
			introPanel.onAppReady(app.songUrl);
		}
		
		function onVideoReady() {
			artistSpan.textContent = player.data.song.artist.name;
			songSpan.textContent = player.data.song.name;
		}
		function onTimerReady(t: Timer) {
			if (!player.app.managed) {
				imagePreloader.preload().then(() => {
					resizer.resizeCanvas();
					document.getElementById("loadingTxt").remove();
					introPanel.dismiss();
					document.querySelectorAll("button").forEach((btn) => (btn.disabled = false));
				});
			}
		}
		return player;
	}
}

const textAliveAdapter = new TextAliveAdapter();

export default textAliveAdapter;