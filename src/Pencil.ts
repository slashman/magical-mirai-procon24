import PencilLayer from "./PencilLayer";

class Pencil {
	private lastX: number;
	private lastY: number;
	private drawString: string;
	private isDrawing: boolean;

	private offX: number;
	private offY: number;
	private scale: number;

	private currentPath: SVGPathElement;
	private currentLayer: PencilLayer = PencilLayer.LEFT_HAND;
	private layers: Map<PencilLayer, SVGPathElement[]> = new Map();

	constructor() {
	}

	private addToLayer(path: SVGPathElement): void {
		let paths = this.layers.get(this.currentLayer);
		if (!paths) {
			paths = [];
			this.layers.set(this.currentLayer, paths);
		}
		paths.push(path);
	}

	initForElement(element: HTMLElement, scale: number): void {
		this.offY = element.getBoundingClientRect().top;
		this.offX = element.getBoundingClientRect().left;
		this.scale = scale;
		//TODO: This on every resize
		element.addEventListener("mousedown", (e) => {
			this.down(e.clientX, e.clientY);
		});
		element.addEventListener("mousemove", (e) => {
			pencil.move(e.clientX, e.clientY);
		});
		element.addEventListener("mouseup", (e) => {
			pencil.up();
		});
		element.addEventListener("mouseleave", (e) => {
			pencil.up();
		});
		element.addEventListener("touchstart", (e) => {
			e.preventDefault();
			if (e.touches.length == 0) {
				return;
			}
			this.down(e.touches[0].clientX, e.touches[0].clientY);
		});
		element.addEventListener("touchmove", (e) => {
			e.preventDefault();
			if (e.touches.length == 0) {
				return;
			}
			pencil.move(e.touches[0].clientX, e.touches[0].clientY);
		});
		element.addEventListener("touchend", (e) => {
			pencil.up();
		});
		element.addEventListener("touchleave", (e) => {
			pencil.up();
		});
	}

	setLayer (layer: PencilLayer) {
		this.currentLayer = layer;
	}

	moveLayer (layer: PencilLayer, x: number, y: number) {
		const paths = this.layers.get(layer);
		if (!paths) {
			return;
		}
		paths.forEach(p => {
			p.setAttribute("transform", `translate(${x}, ${y})`);
		});
	}

	clear () {
		this.layers.get(PencilLayer.HEAD)?.forEach(p => {
			p.remove();
		});
		this.layers.get(PencilLayer.LEFT_HAND)?.forEach(p => {
			p.remove();
		});
		this.layers.get(PencilLayer.RIGHT_HAND)?.forEach(p => {
			p.remove();
		});
		this.layers.get(PencilLayer.STAGE)?.forEach(p => {
			p.remove();
		});
	}

	private markLast(x: number, y: number): void {
		this.lastX = this.transformX(x);
		this.lastY = this.transformY(y);
	}

	private transformX(clientX: number): number {
		return (clientX - this.offX) / this.scale;
	}

	private transformY(clientY: number): number {
		return (clientY - this.offY) / this.scale;
	}

	public down(x: number, y: number): void {
		this.markLast(x, y);
		this.drawString = `M ${this.lastX} ${this.lastY}`;
		this.isDrawing = true;

		const mask = document.getElementById("myText");
		const newPath = document.createElementNS(mask.namespaceURI, "path");
		newPath.setAttribute("d", this.drawString);
		newPath.setAttribute("filter", "url(#f1)");
		newPath.setAttribute("fill", "transparent");
		newPath.setAttribute("stroke", "black");
		newPath.setAttribute("stroke-width", "5px");
		mask.appendChild(newPath);
		this.addToLayer(newPath as SVGPathElement);
		this.currentPath = newPath as SVGPathElement;
	}

	public move(x: number, y: number): void {
		if (!this.isDrawing) {
			return;
		}
		if (this.distanceToLast(x, y) > 5) {
			this.markLast(x, y);
			this.drawString += ` L ${this.lastX} ${this.lastY}`;
			this.currentPath.setAttribute("d", this.drawString);
		}
	}

	private distanceToLast(x: number, y: number): number {
		const nextX = this.transformX(x);
		const nextY = this.transformY(y);
		return Math.sqrt((Math.pow(nextX - this.lastX,2))+(Math.pow(nextY - this.lastY,2)))
	}

	public up(): void {
		this.endSegment();
	}

	private endSegment(): void {
		this.lastX = -1; 
		this.lastY = -1;
		this.isDrawing = false;
	}
}

const pencil = new Pencil();

export default pencil;