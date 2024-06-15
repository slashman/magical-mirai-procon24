import AnimationFrame from "./AnimationFrame";

export default class Animation {
	prefix: string;
	suffix: string;
	startIndex: number;
	frames: AnimationFrame[];

	constructor (options: {prefix: string, suffix: string, startIndex: number, frames: AnimationFrame[]}) {
		this.prefix = options.prefix;
		this.suffix = options.suffix;
		this.startIndex = options.startIndex;
		this.frames = options.frames;

		this.currentIndex = this.startIndex;
	}

	private currentIndex: number;
	private yoyoDir: number = 1;

	get frameName() {
		return this.prefix + this.currentIndex + this.suffix;
	}

	get trackEyeX() {
		return this.frames[this.currentIndex - this.startIndex].eyeX;
	}

	get trackEyeY() {
		return this.frames[this.currentIndex - this.startIndex].eyeY;
	}

	step () {
		this.currentIndex += this.yoyoDir;
		if (this.yoyoDir === 1) {
			if (this.currentIndex === this.frames.length) {
				this.currentIndex = this.frames.length - 2;
				this.yoyoDir = -1;
			}
		} else {
			if (this.currentIndex === 0) {
				this.currentIndex = 1;
				this.yoyoDir = 1;
			}
		}
	}
}