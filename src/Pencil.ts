class Pencil {
	private lastX: number;
	private lastY: number;
	private drawString: string;
	private isDrawing: boolean;

	private offX: number;
	private offY: number;

	private currentPath: SVGPathElement;

	constructor() {
		this.offY = document.getElementById("tabletMask").getBoundingClientRect().top;
		this.offX = document.getElementById("tabletMask").getBoundingClientRect().left;
	}

	public down(e: MouseEvent): void {
		this.lastX = e.clientX - this.offX;
		this.lastY = e.clientY - this.offY;
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
		this.currentPath = newPath as SVGPathElement;
	}

	public move(e: MouseEvent): void {
		if (!this.isDrawing) {
			return;
		}
		if (this.distance(e.clientX, e.clientY) > 5) {
			this.lastX = e.clientX - this.offX;
			this.lastY = e.clientY - this.offY;
			this.drawString += ` L ${this.lastX} ${this.lastY}`;
			this.currentPath.setAttribute("d", this.drawString);
		}
	}

	private distance(x: number, y: number): number {
		return Math.sqrt((Math.pow(x - this.offX - this.lastX,2))+(Math.pow(y - this.offY -this.lastY,2)))
	}

	public up(e: MouseEvent): void {
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