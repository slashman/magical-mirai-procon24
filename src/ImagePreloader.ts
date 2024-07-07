class ImagePreloader {
	counter: number;
	total: number;
	resolvePreload: any;

	async preload() {
		var urls = [
			'img/miku2/mikub1.png',
			'img/miku2/mikub2.png',
			'img/miku2/mikub3.png',
			'img/miku2/mikub4.png',
			'img/miku2/mikub5.png',
			'img/miku2/mikub6.png',
			'img/miku2/mikub7.png',
			'img/miku2/mikub8.png',
			'img/miku2/mikub9.png',
			'img/miku2/mikub10.png',
			'img/miku2/mikub11.png',
			'img/miku2/eyes1.png',
			'img/miku2/eyes2.png',
			'img/miku2/eyes3.png',
			'img/miku2/bocas0001.png',
			'img/miku2/bocas0002.png',
			'img/miku2/bocas0003.png',
			'img/miku2/bocas0004.png',
			'img/miku2/bocas0005.png',
		];
		this.counter = 0;
		this.total = urls.length;
		for(var i=0; i < this.total; i++){
			var img = new Image();
			img.onload = () => this.loaded();
			img.src = urls[i];
		}
		return new Promise((resolve) => {
			this.resolvePreload = resolve;
		});
	}

	loaded(){
		console.log("one more")
		if(++this.counter >= this.total){
			console.log("done preloading")
			this.resolvePreload();
		}
	}
}

const imagePreloader = new ImagePreloader();

export default imagePreloader;