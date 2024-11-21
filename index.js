import Playground from "./scripts/canvas.js"

function init() {

	const canvas = new Playground(document.getElementById("my_canvas"));
	window.addEventListener("resize", () => {
		canvas.updateCanvasDimensions();
	})

}

init();
