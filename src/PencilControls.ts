import pencil from "./Pencil";
import PencilLayer from "./PencilLayer";

class PencilControls {
	init() {
		document.getElementById("leftHandBtn").addEventListener(
			"click",
			() => this.setLayer(PencilLayer.LEFT_HAND)
		);
		document.getElementById("rightHandBtn").addEventListener(
			"click",
			() => this.setLayer(PencilLayer.RIGHT_HAND)
		);
		document.getElementById("headBtn").addEventListener(
			"click",
			() => this.setLayer(PencilLayer.HEAD)
		);
		document.getElementById("stageBtn").addEventListener(
			"click",
			() => this.setLayer(PencilLayer.STAGE)
		);
		document.getElementById("clearBtn").addEventListener(
			"click",
			() => pencil.clear()
		);
	}

	hidePointerElements() {
		document.getElementById("leftHandCircle").style.display = "none";
		document.getElementById("rightHandCircle").style.display = "none";
		document.getElementById("headCircle").style.display = "none";
	}

	private setLayer(layer: PencilLayer) {
		this.hidePointerElements();
		const pointerElement = this.getPointerElement(layer)
		if (pointerElement) {
			document.getElementById(pointerElement).style.display = "block";
		}
		pencil.setLayer(layer)
	}

	private getPointerElement(layer: PencilLayer): string {
		switch (layer) {
			case PencilLayer.HEAD: return "headCircle";
			case PencilLayer.LEFT_HAND: return "leftHandCircle";
			case PencilLayer.RIGHT_HAND: return "rightHandCircle";
		}
		return null;
	}
	
}

const pencilControls = new PencilControls();

export default pencilControls;