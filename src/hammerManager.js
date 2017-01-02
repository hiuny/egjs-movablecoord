import HM from "hammerjs";
import { utils } from "./utils";
import { DIRECTION, UNIQUEKEY, SUPPORT_TOUCH } from "./consts";

export default class HammerManager {
    constructor() {
        this._hammers = {};
    }

    _createHammer(el, bindOptions, inputClass, handler) {
		try {
			// create Hammer
			return this._attachHammerEvents(new HM.Manager(el, {
					recognizers: [
						[
							HM.Pan, {
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
					inputClass: inputClass
				}), bindOptions, handler);
		} catch (e) {}
	}

    add(element, options, handler) {
		let el = utils.getElement(element);
		let keyValue = el[UNIQUEKEY];
		let bindOptions = Object.assign({
			direction: DIRECTION.DIRECTION_ALL,
			scale: [ 1, 1 ],
			thresholdAngle: 45,
			interruptable: true,
			inputType: [ "touch", "mouse" ]
		}, options);

		let inputClass = this._convertInputType(bindOptions.inputType);
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
			el: el,
			options: bindOptions
		};
		el[UNIQUEKEY] = keyValue;
	}

    remove(element) {
        let el = utils.getElement(element);
		let key = el[UNIQUEKEY];
		if (key) {
			this._hammers[key].hammer.destroy();
			delete this._hammers[key];
			delete el[UNIQUEKEY];
		}
    }

    getHammer(element) {
		let data = this.get(element);
        return data ? data.hammer : null;
	}

    get(element) {
        let el = utils.getElement(element);
		let key = el[UNIQUEKEY];
		if (key && this._hammers[key]) {
			return this._hammers[key];
		} else {
			return null;
		}
    }

    _attachHammerEvents(hammer, options, handler) {
		return hammer
			.on("hammer.input", e => {
				if (e.isFirst) {
					// apply options each
					handler._setCurrentTarget(this.get(e.target));
                    handler._start(e);
				} else if (e.isFinal) {
					// substitute .on("panend tap", this._panend); Because it(tap, panend) cannot catch vertical(horizontal) movement on HORIZONTAL(VERTICAL) mode.
                    handler._end(e);
				}
			}).on("panstart panmove", e => handler._move(e)); 
	}

	_detachHammerEvents(hammer) {
		hammer.off("hammer.input panstart panmove panend");
	}

    _convertInputType(inputType = []) {
		let hasTouch = false;
		let hasMouse = false;
		// inputType = inputType || [];
		inputType.forEach( v => {
			switch (v) {
				case "mouse" : hasMouse = true; break;
				case "touch" : hasTouch = SUPPORT_TOUCH;
			}
		});

		return hasTouch && HM.TouchInput || hasMouse && HM.MouseInput || null;
	}

    destroy() {
		for (let p in this._hammers) {
			this._hammers[p].hammer.destroy();
			delete this._hammers[p].el[UNIQUEKEY];
			delete this._hammers[p];
		}
	}
};
