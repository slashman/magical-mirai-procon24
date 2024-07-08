import pencil from "./Pencil";

class Resizer {
	private container: HTMLElement;
	
	init (container: HTMLElement) {
		this.container = container;
	}

	resizeCanvas () {
		if (!this.container) {
			return;
		}
		const referenceHeight = document.body.clientHeight;
		const referenceWidth = document.body.clientWidth;
		const widthScale = referenceWidth / 1262;
		const heightScale = referenceHeight / 892;
		const scale = widthScale > heightScale ? heightScale : widthScale;
		this.container.style.transform = `scale(${scale})`;
		const tabletSuperContainer = document.getElementById('tabletSuperContainer');
		tabletSuperContainer.style.width = `${1262 * scale}px`;
		tabletSuperContainer.style.height = `${892 * scale}px`;
		const tabletContainer = document.getElementById('tabletContainer');
		pencil.updateScale(tabletContainer.getBoundingClientRect().width / tabletContainer.offsetWidth);
	}
}

const resizer = new Resizer();

export default resizer;

