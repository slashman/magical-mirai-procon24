import dancingMiku from "./DancingMiku";
import imagePreloader from "./ImagePreloader";
import lyricsRenderer from "./LyricsRenderer";

class AnimationController {
	private currentIndex = -1;
	private previousProgress = -1;
	private lastFrame = -1;
	private spaceRendered = false;
	private animationSpeed = 4; // Frame per beat

	private previousWord: any;
	private previousBeat: any;
	private player: any;

	init (player: any) {
		this.player = player;
		window.requestAnimationFrame(ts => this.step());
	}
	step() {
		this.update();
		window.requestAnimationFrame(ts => this.step());
	}

	private update() {
		const position = this.player.timer.position;
		if (!this.player.video) {
			return;
		}
		const beat = this.player.findBeat(position);
		if (beat) {
			if (beat != this.previousBeat) {
				this.previousBeat = beat;
			}
			const progress = beat.progress(position);
			const frame = Math.floor(progress * this.animationSpeed)
			if (frame != this.lastFrame) {
				dancingMiku.flipMiku();
				this.lastFrame = frame;
			}
		}
		const char = this.player.video.findChar(position, { loose: false });
		if (!char) {
			if (!this.spaceRendered) {
				lyricsRenderer.addText(" ");
				this.spaceRendered = true;
			}
			dancingMiku.setMouth(4);
			document.getElementById("svgMikuEyes").setAttribute('href', imagePreloader.getImageData("img/miku2/eyes1.png"));
			return;
		}
		this.spaceRendered = false;
		const phrase = this.player.video.findPhrase(position);
		if (phrase.progress(position) < this.previousProgress) {
			dancingMiku.changeEyes();
			lyricsRenderer.clearText();
		}
		this.previousProgress = phrase.progress(position);
		const word = this.player.video.findWord(position);
		if (this.previousWord && word != this.previousWord) {
			if (this.previousWord.language == "en") {
				lyricsRenderer.addText(" ");
			}
		}
		this.previousWord = word;
		const index = this.player.video.findIndex(char);
		if (index !== this.currentIndex) {
			lyricsRenderer.addText(char.text);
			word.uttered = false;
			word.finished = false;
		}
		this.currentIndex = index;
		if (!word.uttered) {
			dancingMiku.changeMouth();
			word.uttered = true;
		}
	}
}

const animationController = new AnimationController();

export default animationController;