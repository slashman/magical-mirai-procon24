import animations from "./Animations";
import imagePreloader from "./ImagePreloader";
import pencil from "./Pencil";
import PencilLayer from "./PencilLayer";

class DancingMiku {
	private bopIndex = 0;
	private flipped = false;
	private mikuAnimation = animations[0];
	private flippedMouth = false;
	private flippedEyes = false;

	flipMiku () {
		this.bopIndex++;
		this.mikuAnimation.step();
		const baseX = 200;
		let baseY = 60;
		let bopped = false;
		if (this.bopIndex > 1) {
			this.flipped = !this.flipped;
			if (this.flipped) {
				baseY -= 9;
				bopped = true;
			}
			this.bopIndex = 0;
		}
		document.getElementById("svgMikuBody").setAttribute('href', imagePreloader.getImageData(this.mikuAnimation.frameName));
		document.getElementById("svgMikuBody").setAttribute('y', baseY + "");
		document.getElementById("svgMikuEyes").setAttribute('x', (baseX + this.mikuAnimation.trackEyeX).toString());
		document.getElementById("svgMikuEyes").setAttribute('y', (baseY + this.mikuAnimation.trackEyeY).toString());
		document.getElementById("svgMikuMouth").setAttribute('x', (baseX + this.mikuAnimation.trackEyeX).toString());
		document.getElementById("svgMikuMouth").setAttribute('y', (baseY + this.mikuAnimation.trackEyeY).toString());

		pencil.moveLayer(
			PencilLayer.LEFT_HAND,
			this.mikuAnimation.trackLeftHandX,
			this.mikuAnimation.trackLeftHandY + (bopped ? -9 : 0)
		);
		pencil.moveLayer(
			PencilLayer.RIGHT_HAND,
			this.mikuAnimation.trackRightHandX,
			this.mikuAnimation.trackRightHandY + (bopped ? -9 : 0)
		);
		pencil.moveLayer(
			PencilLayer.HEAD,
			this.mikuAnimation.trackEyeX,
			this.mikuAnimation.trackEyeY + (bopped ? -9 : 0)
		);
	}

	changeMouth () {
		this.flippedMouth = !this.flippedMouth;
		if (this.flippedMouth) {
			document.getElementById("svgMikuMouth").setAttribute('href', imagePreloader.getImageData("img/miku2/bocas0002.png"));
		} else {
			document.getElementById("svgMikuMouth").setAttribute('href', imagePreloader.getImageData("img/miku2/bocas0005.png"));
		}
	}

	setMouth (type: number) {
		document.getElementById("svgMikuMouth").setAttribute('href', imagePreloader.getImageData("img/miku2/bocas000"+type+".png"));
	}

	changeEyes () {
		if (Math.random() > 0.8) {
			return;
		}
		this.flippedEyes = !this.flippedEyes;
		if (this.flippedEyes) {
			document.getElementById("svgMikuEyes").setAttribute('href', imagePreloader.getImageData("img/miku2/eyes1.png"));
		} else {
			document.getElementById("svgMikuEyes").setAttribute('href', imagePreloader.getImageData("img/miku2/eyes3.png"));
		}
	}
}

const dancingMiku = new DancingMiku();

export default dancingMiku;