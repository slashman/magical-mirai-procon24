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

class ImagePreloader {
	private preloadedImages: Map<string, string> = new Map();

	async preload() {
		const promises = urls.map(u => this.toDataURL(u));
		const b64Strings = await Promise.all(promises);
		urls.forEach((u,i) => this.preloadedImages.set(u, b64Strings[i]));
	}

	getImageData(originalURL: string) {
		return this.preloadedImages.get(originalURL) ?? originalURL;
	}

	private async toDataURL(url: string): Promise<string> {
		return new Promise (resolve => {
			const xhr = new XMLHttpRequest();
			xhr.onload = function() {
				const reader = new FileReader();
				reader.onloadend = function() {
					resolve(reader.result as string);
				}
				reader.readAsDataURL(xhr.response);
			};
			xhr.open('GET', url);
			xhr.responseType = 'blob';
			xhr.send();
		});
	}
}

const imagePreloader = new ImagePreloader();

export default imagePreloader;