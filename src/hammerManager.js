import Hammer from "hammerjs";
import {utils} from "./utils";
import {DIRECTION, UNIQUEKEY, SUPPORT_TOUCH} from "./consts";

if (typeof Hammer === "undefined") {
	throw new Error(`The Hammerjs must be loaded before eg.MovableCoord.\nhttp://hammerjs.github.io/`);
}

export default class HammerManager {
	constructor() {
		this._hammers = {};
	}

	_createHammer(el, bindOptions, inputClass, handler) {
		try {
			// create Hammer
			return this._attachHammerEvents(new Hammer.Manager(el, {
				recognizers: [
					[
						Hammer.Pan, {
							direction: bindOptions.direction,
							threshold: 0
						}
					]
				],

				// css properties were removed due to usablility issue
				// http://hammerjs.github.io/jsdoc/Hammer.defaults.cssProps.html
				cssProps: {
					userSelect: "none",
					touchSelect: "none",
					touchCallout: "none",
					userDrag: "none"
				},
				inputClass
			}), bindOptions, handler);
		} catch (e) {
			return null;
		}
	}

	add(element, options, handler) {
		const el = utils.getElement(element);
		let keyValue = el.getAttribute(UNIQUEKEY);
		const bindOptions = Object.assign({
			direction: DIRECTION.DIRECTION_ALL,
			scale: [1, 1],
			thresholdAngle: 45,
			interruptable: true,
			inputType: ["touch", "mouse"]
		}, options);
		const inputClass = this.convertInputType(bindOptions.inputType);

		if (!inputClass) {
			return;
		}

		if (keyValue) {
			this._hammers[keyValue].hammer.destroy();
		} else {
			keyValue = Math.round(Math.random() * new Date().getTime());
		}
		this._hammers[keyValue] = {
			hammer: this._createHammer(
				el,
				bindOptions,
				inputClass,
				handler
			),
			el,
			options: bindOptions
		};
		el.setAttribute(UNIQUEKEY, keyValue);
	}

	remove(element) {
		const el = utils.getElement(element);
		const key = el.getAttribute(UNIQUEKEY);

		if (key) {
			this._hammers[key].hammer.destroy();
			delete this._hammers[key];
			el.removeAttribute(UNIQUEKEY);
		}
	}

	getHammer(element) {
		const data = this.get(element);

		return data ? data.hammer : null;
	}

	get(element) {
		const el = utils.getElement(element);
		const key = el ? el.getAttribute(UNIQUEKEY) : null;

		if (key && this._hammers[key]) {
			return this._hammers[key];
		} else {
			return null;
		}
	}

	_attachHammerEvents(hammer, options, handler) {
		const enable = hammer.get("pan").options.enable;

		/* eslint-disable no-underscore-dangle */
		return hammer
			.on("hammer.input", e => {
				if (e.isFirst) {
					// apply options each
					handler._setCurrentTarget(hammer, options);
					enable && handler._start(e);
				} else if (e.isFinal) {
					// substitute .on("panend tap", this._panend); Because it(tap, panend) cannot catch vertical(horizontal) movement on HORIZONTAL(VERTICAL) mode.
					enable && handler._end(e);
				}
			}).on("panstart panmove", e => handler._move(e));
		/* eslint-enable no-underscore-dangle */
	}

	_detachHammerEvents(hammer) {
		hammer.off("hammer.input panstart panmove panend");
	}

	convertInputType(inputType = []) {
		let hasTouch = false;
		let hasMouse = false;
		const inputs = inputType || [];

		inputs.forEach(v => {
			switch (v) {
				case "mouse" : hasMouse = true; break;
				case "touch" : hasTouch = SUPPORT_TOUCH;
			}
		});

		return hasTouch && Hammer.TouchInput || hasMouse && Hammer.MouseInput || null;
	}

	inputControl(isEnable, element) {
		const option = {
			enable: isEnable
		};

		if (element) {
			const hammer = this.getHammer(element);

			hammer && hammer.get("pan").set(option);
		} else { // for multi
			for (const p in this._hammers) {
				this._hammers[p].hammer.get("pan").set(option);
			}
		}
		return this;
	}

	destroy() {
		for (const p in this._hammers) {
			this._hammers[p].hammer.destroy();
			this._hammers[p].el.removeAttribute(UNIQUEKEY);
			delete this._hammers[p];
		}
		this._hammers = {};
	}
}
