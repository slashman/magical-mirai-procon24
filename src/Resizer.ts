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
		const widthScale = innerWidth / 1262;
		const heightScale = innerHeight / 892;
		const scale = widthScale > heightScale ? heightScale : widthScale;
		this.container.style.transform = `scale(${scale})`;
		const tabletContainer = document.getElementById('tabletContainer');
		pencil.updateScale(tabletContainer.getBoundingClientRect().width / tabletContainer.offsetWidth);
	}
}

const resizer = new Resizer();

export default resizer;

