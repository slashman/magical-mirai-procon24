const MAX_CHARACTER_INDEX = 25;
class LyricsRenderer {
	private textCount: number = 0;
	private cursorStart: number = 10;
	private cursorX: number = 10;
	private lineY: number = 1;
	
	addText(str: string) {
	  this.textCount++;
	  if (this.textCount > MAX_CHARACTER_INDEX) {
		// All text used sorry
		return;
	  }
	  const txElement = document.getElementById("tx" + this.textCount);
	  txElement.innerHTML = str;
	  const charWidth = 64;
	  this.cursorX += charWidth;
	  this.cursorX += Math.floor(Math.random() * 15) - 7;
	  if (this.cursorX > 900) {
		this.lineY++;
		this.cursorX = this.cursorStart + charWidth + Math.floor(Math.random() * 20) - 10;
	  }
	  const cursorY = (this.lineY * (80 + 10)) + Math.floor(Math.random() * 10) - 5;
	  txElement.setAttribute("x", this.cursorX + "");
	  txElement.setAttribute("y", cursorY + "");
	}
	
	clearText() {
	  for (let i = 1; i <= MAX_CHARACTER_INDEX; i++) {
		const txElement = document.getElementById("tx" + i);
		txElement.innerHTML = "";
	  }
	  this.textCount = 0;
	  this.cursorX = 40;
	  this.lineY = 1;
	}
}

const lyricsRenderer = new LyricsRenderer();

export default lyricsRenderer;