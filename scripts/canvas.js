/**
 * @typedef {Object} Boundary
 * @property {{ x:number,y:number }} center
 * @property {"circle"| "rectangle"} type 
 * @property {number} size
 */

import Particle from './particle.js';

export default class Playground {

	/**
	 * @private
	 *@type {HTMLCanvasElement}
	 */
	canvas;
	/** Canvas Context
	 *@type {CanvasRenderingContext2D}
	 */
	ctx;
	/** Canvas Width
	 *@type {number}
	 */
	canvasWidth;
	/** Canvas Height
	 *@type {number}
	 */
	canvasHeight;

	/** Particles Array
	 *@type {Particle[]} 
	 */
	particles;
	/** Boundary for the playground
	 * @type {Boundary}
	 */

	gravity = { x: 0, y: 1000 };
	/**
	* Create canvas instance
	* @constructor
	* @param {HTMLCanvasElement} canvasRef 
	*/

	constructor(canvasRef) {
		this.canvas = canvasRef;
		this.ctx = canvasRef.getContext("2d");

		this.particles = []
		this.updateCanvasDimensions();
		this.#renderBoundary();
		this.ctx.fillStyle = "#FFFFFF";
		this.ctx.strokeStyle = "#FFFFFF";
		this.ctx.font = "20px sans-serif";
		this.ctx.fillText("Tap anywhere in the black area ", 20, 60);

		this.canvas.addEventListener("click", (e) => {
			const newParticle = new Particle(e.offsetX, e.offsetY);
			this.addParticle(newParticle);
			if (this.particles.length == 1) this.update()
		})

	}

	/**
	 * @method Add particle to canvas
	 * @param {Particle} particle 
	*/
	addParticle(particle) {
		this.particles.push(particle)
	}

	/**
	 * @method Update the canvas dimension 
	 */
	updateCanvasDimensions() {
		this.canvasWidth = Math.ceil(window.innerWidth * 0.75);
		this.canvasHeight = Math.min(this.canvasWidth * (3 / 4), window.innerHeight - 4);

		this.canvas.width = this.canvasWidth;
		this.canvas.height = this.canvasHeight;

		this.boundary = {
			type: "circle",
			center: {
				x: this.canvasWidth / 2,
				y: this.canvasHeight / 2,
			},
			size: this.canvasHeight / 2
		}
	}

	/**
	 * @private Update Canvas function
	 */
	#updateCanvas(timeStamp) {
		this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		// for (let particle of this.particles) {
		// }
		this.#renderBoundary();
		this.particles.forEach(particle => {
			particle.accelerate(this.gravity)

			particle.update(1 / 60);
			particle.checkCollision(this.boundary);
			particle.draw(this.ctx)
		})
		requestAnimationFrame(this.#updateCanvas.bind(this));
	}

	/**
	* @method Paint canvas
	*/
	update() {
		requestAnimationFrame(this.#updateCanvas.bind(this))
	}

	/**
	 * @method Render canvas boundary
	 */
	#renderBoundary() {
		if (this.boundary.type == "circle") {
			this.ctx.beginPath();
			this.ctx.strokeStyle = "#FFFFFF";
			this.ctx.arc(this.boundary.center.x, this.boundary.center.y, this.boundary.size, 0, 2 * Math.PI);
			this.ctx.stroke();
		}
	}
}
