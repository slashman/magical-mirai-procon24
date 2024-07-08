import songData from "./SongData";

class IntroPanel {
	private player: any;
	private language: string;

	private initSongButton (elementClass: string, buttonSongData: any): void {
		document.querySelectorAll("." + elementClass).forEach(b => b.addEventListener(
			"click",
			() => this.songSelected(buttonSongData)
		));
	}

	init (player: any) {
		this.player = player;
		this.language = 'jp';
		this.initSongButton("songSuperHero", songData.superHero);
		this.initSongButton("songTheFutureISpoke", songData.theFutureISpoke);
		this.initSongButton("songFutureNotes", songData.futureNotes);
		this.initSongButton("songFutureSymphony", songData.futureSymphony);
		this.initSongButton("songReality", songData.reality);
		this.initSongButton("songTheMarks", songData.theMarks);
		
		document.querySelector("#languageBtn").addEventListener(
			"click",
			() => {
				document.getElementById(`${this.language}Instructions` ).style.display = "none";
				document.getElementById(`${this.language}Songs` ).style.display = "none";
				this.language = this.language === 'jp' ? 'en' : 'jp';
				document.getElementById(`${this.language}Instructions` ).style.display = "block";
				document.getElementById(`${this.language}Songs` ).style.display = "block";
				document.getElementById(`languageBtn`).innerHTML = this.language === 'jp' ? 'English' : '日本人';
				if (document.getElementById(`loadingTxt`)) {
					document.getElementById(`loadingTxt`).innerHTML = this.language === 'jp' ? '読み込み中...' : 'Loading...';
				}
			}
		);
	}

	onAppReady(songURL: string) {
		if (songURL) {
			this.player.createFromSongUrl(songURL);
			this.dismiss();
		} else {
			document.querySelectorAll(".startBtn")
				.forEach((btn) => ((btn as HTMLButtonElement).disabled = false));
		}
	}

	songSelected(selectedSongData: any) {
		document.querySelectorAll(".startBtn")
				.forEach((btn) => ((btn as HTMLButtonElement).disabled = true));
		this.player.createFromSongUrl(selectedSongData.url, { 
			video: selectedSongData.corrections
		});
	}

	private dismiss(): void {
		(document.querySelector("#overlay") as HTMLElement).style.display = "none";
	}
}

const introPanel = new IntroPanel();

export default introPanel;