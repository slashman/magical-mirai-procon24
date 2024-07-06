import AnimationFrame from "./AnimationFrame";

export default class Animation {
	prefix: string;
	suffix: string;
	startIndex: number;
	frames: AnimationFrame[];
	private mainScale: number;

	constructor (options: {prefix: string, suffix: string, startIndex: number, frames: AnimationFrame[], mainScale: number}) {
		this.prefix = options.prefix;
		this.suffix = options.suffix;
		this.startIndex = options.startIndex;
		this.frames = options.frames;
		this.mainScale = options.mainScale;

		this.currentIndex = this.startIndex;
	}

	private currentIndex: number;
	private yoyoDir: number = 1;

	get frameName() {
		return this.prefix + this.currentIndex + this.suffix;
	}

	get trackEyeX() {
		return (this.frames[this.currentIndex - this.startIndex].eyeX - this.frames[0].eyeX) * this.mainScale;
	}

	get trackEyeY() {
		return (this.frames[this.currentIndex - this.startIndex].eyeY - this.frames[0].eyeY) * this.mainScale;
	}

	
	get trackRightHandX() {
		return (this.frames[this.currentIndex - this.startIndex].rightHandX - this.frames[0].rightHandX) * this.mainScale;
	}

	get trackRightHandY() {
		return (this.frames[this.currentIndex - this.startIndex].rightHandY - this.frames[0].rightHandY) * this.mainScale;
	}

	get trackLeftHandX() {
		return (this.frames[this.currentIndex - this.startIndex].leftHandX - this.frames[0].leftHandX) * this.mainScale;
	}

	get trackLeftHandY() {
		return (this.frames[this.currentIndex - this.startIndex].leftHandY - this.frames[0].leftHandY) * this.mainScale;
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