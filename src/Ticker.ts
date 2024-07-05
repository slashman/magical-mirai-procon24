export default class Ticker {
	private max: number;
	private current: number;

	constructor (max: number) {
		this.max = max;
		this.current = -1;
	}

	public step(): void {
		this.current++;
		if (this.current === this.max) {
			this.current = 0;
		}
	}

	public onCycle(): boolean {
		return this.current == this.max - 1;
	}

	public almostCycle(): boolean {
		return this.current == this.max - 2;
	}
}