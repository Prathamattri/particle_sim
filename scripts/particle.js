import ColorGenerator from "./random_color.js"
class Particle {
	/** @constructor
	* @param {number} xPos x coordinate of particle's initial position
	* @param {number} yPos y coordinate of particle's initial position
	*/
	constructor(xPos, yPos) {
		this.color = ColorGenerator.generate();
		this.size = 10;
		this.current_position = { x: xPos, y: yPos }
		this.last_position = { x: xPos, y: yPos };
		this.velocity = { x: 0, y: 0 };
		this.acc = { x: 0, y: 1000 };
		this.collided = 0;
		this.sound = new Audio(`../assets/bounce_sound.mp3`);
	}

	/**
	 * @method Update postion of particle
	 * @param {number} dt - Time difference 
	 */
	update(dt) {
		this.last_position = structuredClone(this.current_position);
		this.current_position.x += this.velocity.x * dt + this.acc.x * (dt * dt);
		this.current_position.y += this.velocity.y * dt + this.acc.y * (dt * dt);
		this.velocity.x += this.acc.x * dt
		this.velocity.y += this.acc.y * dt;
		this.acc = {
			x: 0,
			y: 0
		}
	}

	/**
	 * @typedef {Object} Boundary
	 * @property {{ x:number,y:number }} center
	 * @property {"circle"| "rectangle"} type 
	 * @property {number} size
	 */

	/**
	 * @method Checks collision of object with boundaries
	 * @param {Boundary} boundary 
	 */
	checkCollision(boundary) {
		const { x, y } = this.current_position;
		if (boundary.type === "circle") {
			const { x: centerX, y: centerY } = boundary.center
			const rX = x - centerX;
			const rY = y - centerY;
			const distanceFromBoundaryCenter = Math.sqrt(rX * rX + rY * rY)

			if (distanceFromBoundaryCenter + this.size <= boundary.size) {
				this.collided = 0;
				return;
			}
			// Collision response
			this.current_position.x = centerX + (rX / distanceFromBoundaryCenter) * (boundary.size - this.size);
			this.current_position.y = centerY + (rY / distanceFromBoundaryCenter) * (boundary.size - this.size);

			let tangentVectorNormalised = {
				x: -rY / distanceFromBoundaryCenter,
				y: rX / distanceFromBoundaryCenter,
			}

			let k = this.velocity.x * tangentVectorNormalised.x + this.velocity.y * tangentVectorNormalised.y;
			this.velocity.x = 2 * k * tangentVectorNormalised.x - this.velocity.x;
			this.velocity.y = 2 * k * tangentVectorNormalised.y - this.velocity.y;

			if (this.collided == 0) {

				this.sound.play();

				this.collided = 1;
			}
		} else {

			if (startX >= x - this.size) {
				this.current_position.x = startX + this.size;
				this.velocity.x *= -0.7888;
			} else if (x + this.size >= endX) {
				this.current_position.x = endX - this.size;
				this.velocity.x *= -0.7888;
			}

			if (startY >= y - this.size) {
				this.current_position.y = startY + this.size;
				this.velocity.y *= -0.7888;
			} else if (y + this.size >= endY) {
				this.current_position.y = endY - this.size;
				this.velocity.y *= -0.7888;
			}
		}
	}

	/**
	 * @method Accelerate particle
	 * @param {{ x: number , y: number} gravity 
	 */
	accelerate(gravity) {
		this.acc.x += gravity.x;
		this.acc.y += gravity.y;
	}

	/**
	* @function Draw self on given context
	* @param {CanvasRenderingContext2D} ctx Target context
	*/
	draw(ctx) {
		const { x, y } = this.current_position;
		ctx.fillStyle = this.color;
		ctx.strokeStyle = this.color;
		console.log(this.color)
		ctx.beginPath();
		ctx.arc(x, y, this.size, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
	}

}

export default Particle
