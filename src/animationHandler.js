import Coordinate from "./coordinate";
import { window } from "./browser";

export default (superclass) => class extends superclass {
    constructor() {
		super();
        this._raf = null;
		this._animateParam = null;
        this._animationEnd = this._animationEnd.bind(this);	// for caching
        this._restore = this._restore.bind(this);	// for caching
    }

    _grab(min, max, circular) {
		if (this._animateParam) {
			this.trigger("animationEnd");
            let orgPos = this.get();
			let pos = Coordinate.getCircularPos(this.get(), min, max, circular);
			if (pos[0] !== orgPos[0] || pos[1] !== orgPos[1]) {
				this._setPosAndTriggerChange(pos, true);
			}
			this._animateParam = null;
			this._raf && window.cancelAnimationFrame(this._raf);
			this._raf = null;
		}
	}

	_prepareParam(absPos, duration, hammerEvent) {
		let pos = this.get();
		let min = this.options.min; 
		let max = this.options.max;
		let circular = this.options.circular;
		let maximumDuration = this.options.maximumDuration;
		let destPos = Coordinate.getPointOfIntersection(pos, absPos, min, max, circular, this.options.bounce);
		destPos = Coordinate.isOutToOut(pos, destPos, min, max) ? pos : destPos;
		let distance = [
			Math.abs(destPos[0] - pos[0]),
			Math.abs(destPos[1] - pos[1])
		];
		duration = duration == null ? Coordinate.getDurationFromPos(distance, this.options.deceleration) : duration;
		duration = maximumDuration > duration ? duration : maximumDuration;
		return {
			depaPos: pos.concat(),
			destPos: destPos.concat(),
			isBounce: Coordinate.isOutside(destPos, min, max),
			isCircular: Coordinate.isCircular(absPos, min, max, circular),
			duration: duration,
			distance: distance,
			hammerEvent: hammerEvent || null,
			done: this._animationEnd
		};
	}

	_restore(complete, hammerEvent) {
		let pos = this.get();
		let min = this.options.min;
		let max = this.options.max;
		this._animate(this._prepareParam([
			Math.min(max[0], Math.max(min[0], pos[0])),
			Math.min(max[1], Math.max(min[1], pos[1]))
		], null, hammerEvent), complete);
	}

	_animationEnd() {
		this._animateParam = null;
		let orgPos = this.get();
        let nextPos = Coordinate.getCircularPos([
			Math.round(orgPos[0]),
			Math.round(orgPos[1])
        ], this.options.min, this.options.max, this.options.circular);
        this.setTo(...nextPos);
		this._setInterrupt(false);
		/**
		 * This event is fired when animation ends.
		 * @ko 에니메이션이 끝났을 때 발생한다.
		 * @name eg.MovableCoord#animationEnd
		 * @event
		 */
		this.trigger("animationEnd");
	}

	_animate(param, complete) {
		param.startTime = new Date().getTime();
		this._animateParam = param;
		if (param.duration) {
			let info = this._animateParam;
			let self = this;
			(function loop() {
				self._raf = null;
				if (self._frame(info) >= 1) {
					// deferred.resolve();
					complete();
					return;
				} // animationEnd
                self._raf = window.requestAnimationFrame(loop);
			})();
		} else {
			this._setPosAndTriggerChange(param.destPos, false);
			complete();
		}
	}

	_animateTo(absPos, duration, hammerEvent) {
		let param = this._prepareParam(absPos, duration, hammerEvent);
		let retTrigger = this.trigger("animationStart", param);

		// You can't stop the 'animationStart' event when 'circular' is true.
		if (param.isCircular && !retTrigger) {
			throw new Error(
				"You can't stop the 'animation' event when 'circular' is true."
			);
		}

		if (retTrigger) {
			let self = this;
			let queue = [];
			let dequeue = function() {
				let task = queue.shift();
				task && task.call(this);
			};
			if (param.depaPos[0] !== param.destPos[0] ||
				param.depaPos[1] !== param.destPos[1]) {
				queue.push(function() {
					self._animate(param, dequeue);
				});
			}
			if (Coordinate.isOutside(param.destPos, this.options.min, this.options.max)) {
				queue.push(function() {
					self._restore(dequeue, hammerEvent);
				});
			}
			queue.push(function() {
				self._animationEnd();
			});
			dequeue();
		}
	}

	// animation frame (0~1)
	_frame(param) {
		let curTime = new Date() - param.startTime;
		let easingPer = this._easing(curTime / param.duration);
		let pos = [ param.depaPos[0], param.depaPos[1] ];

		for (let i = 0; i < 2 ; i++) {
			(pos[i] !== param.destPos[i]) &&
			(pos[i] += (param.destPos[i] - pos[i]) * easingPer);
		}
		pos = Coordinate.getCircularPos(pos, this.options.min, this.options.max, this.options.circular);
		this._setPosAndTriggerChange(pos, false);
		return easingPer;
	}

    // trigger 'change' event
	_setPosAndTriggerChange(position, holding, e) {
		/**
		 * This event is fired when coordinate changes.
		 * @ko 좌표가 변경됐을 때 발생하는 이벤트
		 * @name eg.MovableCoord#change
		 * @event
		 *
		 * @param {Object} param The object of data to be sent when the event is fired <ko>이벤트가 발생할 때 전달되는 데이터 객체</ko>
		 * @param {Array} param.position departure coordinate  <ko>좌표</ko>
		 * @param {Number} param.position.0 The X coordinate <ko>x 좌표</ko>
		 * @param {Number} param.pos.1 The Y coordinate <ko>y 좌표</ko>
		 * @param {Boolean} param.holding Indicates whether a user holds an element on the screen of the device.<ko>사용자가 기기의 화면을 누르고 있는지 여부</ko>
		 * @param {Object} param.hammerEvent The event information of Hammer.JS. It returns null if the event is fired through a call to the setTo() or setBy() method.<ko>Hammer.JS의 이벤트 정보. setTo() 메서드나 setBy() 메서드를 호출해 이벤트가 발생했을 때는 'null'을 반환한다.</ko>
		 *
		 */
        this._pos = position.concat();
		this.trigger("change", {
			pos: position.concat(),
			holding: holding,
			hammerEvent: e || null
		});
	}

    _easing(p) {
		return p > 1 ? 1 : this.options.easing(p);
	}
};