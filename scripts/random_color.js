class ColorGenerator {

	static generate() {
		let color = "#"
		for (let i = 0; i < 3; i++) {
			let num = Math.floor(Math.random() * 256)
			color += num.toString(16)
		}

		return color
	}
}

export default ColorGenerator
