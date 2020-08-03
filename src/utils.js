export function pick_random(array) {
	const index = Math.floor(array.length * Math.random());
	return array[index];
}


export function sleep(ms) {
	return new Promise(fulfil => setTimeout(fulfil, ms))
}

export function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image()
		img.onload = () => resolve(img)
		img.onerror = reject;
		img.src = src;
	})
}