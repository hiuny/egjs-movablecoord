import MovableCoord from '../../src/movableCoord.js';
import { DIRECTION } from '../../src/consts.js';

describe("MovableCoord init Test", function() {
    beforeEach(() => {
		  this.inst = null;
    });
    afterEach(() => {
      if(this.inst) {
        this.inst.destroy();
        this.inst = null;
      }
    });
    
    it("should check a initialization empty value", () => {
        // Given
        // When
        this.inst = new MovableCoord();
        // Then
        expect(this.inst).to.be.exist;
    });

    it("should check a initialization position value", () => {
        // Given
        // When
        this.inst = new MovableCoord( {
          min : [ -100, 0 ],
          max : [ 300, 400 ]
        });
        // Then
        expect(this.inst.get()).to.deep.equal([-100, 0]);
    });    


    it("should check initialization status", () => {
      // Given
      // When
      this.inst = new MovableCoord( {
        bounce : [ 100, 200, 50, 30 ],
        margin : [ 0, 100, 0, 100 ],
        circular : [ true, false , true, false ]
      });
      this.inst.destroy();

      // Then
      expect(this.inst.options.bounce).to.deep.equal([100, 200, 50, 30]);
      expect(this.inst.options.margin).to.deep.equal([0, 100, 0, 100]);
      expect(this.inst.options.circular).to.deep.equal([true, false, true, false]);

      // When
      this.inst = new MovableCoord( {
        bounce : [ 100, 200 ],
        margin : [ 0, 100 ],
        circular : [ true, false ]
      });
      this.inst.destroy();

      // Then
      expect(this.inst.options.bounce).to.deep.equal([100, 200, 100, 200]);
      expect(this.inst.options.margin).to.deep.equal([0, 100, 0, 100]);
      expect(this.inst.options.circular).to.deep.equal([true, false, true, false]);

      // When
      this.inst = new MovableCoord( {
        bounce : 50,
        margin : 10,
        circular : false
      });
      this.inst.destroy();

      // Then
      expect(this.inst.options.bounce).to.deep.equal([50, 50, 50, 50]);
      expect(this.inst.options.margin).to.deep.equal([10, 10, 10, 10]);
      expect(this.inst.options.circular).to.deep.equal([false, false, false, false]);
    });
});
 
describe("MovableCoord methods Test", function() {
    beforeEach(() => {
		  this.inst = new MovableCoord( {
        min : [ 0, 0 ],
        max : [ 300, 400 ],
        bounce : 100,
        margin : 0,
        circular : false
      });
    });
    afterEach(() => {
      if(this.inst) {
        this.inst.destroy();
        this.inst = null;
      }
    });

    it("should check get method", () => {
      // Given
      // When
      var pos1 = this.inst.get();
      var pos2 = this.inst.get();
      // Then
      expect(pos1).to.not.equal(pos2);
      expect(pos1).to.deep.equal(pos2);
    });

    it("should check setTo method", () => {
      // Given
      var changeHandler = sinon.spy();
      this.inst.on("change", changeHandler);

      // When
      this.inst.setTo(0, 200);
      // Then
      expect(this.inst.get()).to.deep.equal([0, 200]);
      expect(changeHandler.getCall(0).args[0].pos).to.deep.equal([0, 200]);
      
      // When
      this.inst.setTo(-200, 500);
      // Then
      expect(this.inst.get()).to.deep.equal([0, 400]);
      expect(changeHandler.getCall(1).args[0].pos).to.deep.equal([0, 400]);

      // When
      this.inst.setTo(600, -900);
      // Then
      expect(this.inst.get()).to.deep.equal([300, 0]);
      expect(changeHandler.getCall(2).args[0].pos).to.deep.equal([300, 0]);
    });  

    it("should check setBy method", () => {
      // Given
      var changeHandler = sinon.spy();
      this.inst.on("change", changeHandler);

      // When
      this.inst.setBy(20, 20);
      // Then
      expect(this.inst.get()).to.deep.equal([20, 20]);
      expect(changeHandler.getCall(0).args[0].pos).to.deep.equal([20, 20]);
      
      // When
      this.inst.setBy(-10, -10);
      // Then
      expect(this.inst.get()).to.deep.equal([10, 10]);
      expect(changeHandler.getCall(1).args[0].pos).to.deep.equal([10, 10]);

      // When
      this.inst.setBy(-1000, -1000);
      // Then
      expect(this.inst.get()).to.deep.equal([0, 0]);
      expect(changeHandler.getCall(2).args[0].pos).to.deep.equal([0, 0]);

      // When
      this.inst.setBy(1000, 1000);
      // Then
      expect(this.inst.get()).to.deep.equal([300, 400]);
      expect(changeHandler.getCall(3).args[0].pos).to.deep.equal([300, 400]);      
    });          
});


describe("MovableCoord method Test when inputType is []", function() {
    beforeEach(() => {
		  this.inst = new MovableCoord( {
        min : [ 0, 0 ],
        max : [ 300, 400 ],
        bounce : 100,
        margin : 0,
        circular : false,
        inputType: []
      });
    });
    afterEach(() => {
      if(this.inst) {
        this.inst.destroy();
        this.inst = null;
      }
    });

    it("should check setTo method", () => {
      // Given
      var changeHandler = sinon.spy();
      this.inst.on("change", changeHandler);

      // When
      this.inst.setTo(0, 200);
      // Then
      expect(this.inst.get()).to.deep.equal([0, 200]);
      expect(changeHandler.getCall(0).args[0].pos).to.deep.equal([0, 200]);
      
      // When
      this.inst.setTo(-200, 500);
      // Then
      expect(this.inst.get()).to.deep.equal([0, 400]);
      expect(changeHandler.getCall(1).args[0].pos).to.deep.equal([0, 400]);

      // When
      this.inst.setTo(600, -900);
      // Then
      expect(this.inst.get()).to.deep.equal([300, 0]);
      expect(changeHandler.getCall(2).args[0].pos).to.deep.equal([300, 0]);
    });  

    it("should check setBy method", () => {
      // Given
      var changeHandler = sinon.spy();
      this.inst.on("change", changeHandler);

      // When
      this.inst.setBy(20, 20);
      // Then
      expect(this.inst.get()).to.deep.equal([20, 20]);
      expect(changeHandler.getCall(0).args[0].pos).to.deep.equal([20, 20]);
      
      // When
      this.inst.setBy(-10, -10);
      // Then
      expect(this.inst.get()).to.deep.equal([10, 10]);
      expect(changeHandler.getCall(1).args[0].pos).to.deep.equal([10, 10]);

      // When
      this.inst.setBy(-1000, -1000);
      // Then
      expect(this.inst.get()).to.deep.equal([0, 0]);
      expect(changeHandler.getCall(2).args[0].pos).to.deep.equal([0, 0]);

      // When
      this.inst.setBy(1000, 1000);
      // Then
      expect(this.inst.get()).to.deep.equal([300, 400]);
      expect(changeHandler.getCall(3).args[0].pos).to.deep.equal([300, 400]);      
    });          
});


describe("MovableCoord setTo method Test with Animation", function() {
    beforeEach(() => {
      this.animationStartHandler = sinon.spy();
      this.animationEndHandler = sinon.spy();
      this.changeHandler = sinon.spy();
		  this.inst = new MovableCoord( {
        min : [ 0, 0 ],
        max : [ 300, 400 ],
        bounce : 100,
        margin : 0,
        circular : false,
        maximumDuration : 200
      });
      this.inst.on({
        "change": this.changeHandler,
        "animationStart" : this.animationStartHandler,
        "animationEnd" : this.animationEndHandler,
      });
    });
    afterEach(() => {
      if(this.inst) {
        this.inst.destroy();
        this.inst = null;
      }
      this.animationStartHandler.reset();
      this.animationEndHandler.reset();
      this.changeHandler.reset();
    });

    it("should check event flow when maximumDuration(200ms) is bigger than a duration of setTo", (done) => {
      // Given
      // When
      this.inst.setTo(200, 200, 100);
      
      // Then
      setTimeout(() => {
        expect(this.animationStartHandler.calledOnce).to.be.true;      
        expect(this.changeHandler.called).to.be.true;      
        expect(this.animationEndHandler.calledOnce).to.be.true;      
        done();
      }, 150);
    });

    it("should check event flow when a duration of setTo is bigger than maximumDuration(200ms)", (done) => {
      // Given
      // When
      this.inst.setTo(200, 200, 3000);

      // Then
      setTimeout(() => {
        expect(this.animationEndHandler.called).to.be.false;
      }, 100);
      setTimeout(() => {
        expect(this.animationStartHandler.calledOnce).to.be.true;      
        expect(this.changeHandler.called).to.be.true;      
        expect(this.animationEndHandler.calledOnce).to.be.true;
        done();      
      }, 250);   
    });

    it("should check event flow when a duration of setTo is '0'", () => {
      // Given
      // When
      this.inst.setTo(200, 200, 0);

      // Then
      expect(this.animationStartHandler.called).to.be.false;      
      expect(this.changeHandler.called).to.be.true;      
      expect(this.animationEndHandler.called).to.be.false;
    });    
});

describe("MovableCoord Event Test", function() {
    this.timeout(10000);
    beforeEach(() => {
      this.inst = new MovableCoord( {
        min : [ 0, 0 ],
        max : [ 300, 400 ],
        bounce : 100,
        margin : 0,
        circular : false
      });
      var el = sandbox();
      var html = `<div id="area" 
        style="position:relative; border:5px solid #444; width:300px; height:400px; color:#aaa; margin:0;box-sizing:content-box; z-index:9;"></div>`;
      el.innerHTML = html;
      this.el = el;
    });
    afterEach(() => {
      if(this.inst) {
        this.inst.destroy();
        this.inst = null;
      }
      cleanup();
    });
    
    it("should check slow movement test (no-velocity)", (done) => {
      // Given
      var holdHandler = sinon.spy();
      var changeHandler = sinon.spy();
      var releaseHandler = sinon.spy();
      var animationStartHandler = sinon.spy();
      var animationEndHandler = sinon.spy();

      this.inst.on( {
        "hold": holdHandler,
        "change": changeHandler,
        "release": releaseHandler,
        "animationStart" : animationStartHandler,
        "animationEnd" : animationEndHandler
      });
      this.inst.bind(this.el);

      // When
      Simulator.gestures.pan(this.el, {
        pos: [30, 30],
        deltaX: 10,
        deltaY: 10,
        duration: 3000,
        easing: "linear"
      }, function() {
        // Then
        var holdEvent = holdHandler.getCall(0).args[0];
        expect(holdHandler.calledOnce).to.be.true;
        expect(holdEvent.pos).to.deep.equal([0,0]);
        expect(holdEvent.hammerEvent.isFirst).to.be.true;
        expect(changeHandler.called).to.be.true;
        for(var i=0, len = changeHandler.callCount; i <len; i++) {
          expect(changeHandler.getCall(i).args[0].holding).to.be.true;
        }
        expect(releaseHandler.calledOnce).to.be.true;
        expect(animationStartHandler.called).to.be.false;
        expect(animationEndHandler.called).to.be.false;
        done();
      });
    });

    it("should check slow movement test (no-velocity), release outside", (done) => {
      // Given
      var holdHandler = sinon.spy();
      var releaseHandler = sinon.spy();
      var animationStartHandler = sinon.spy();
      var animationEndHandler = sinon.spy();

      this.inst.on( {
        "hold": holdHandler,
        "change": function(e) {
          if(animationStartHandler.called) {
            expect(e.holding).to.be.false;
          } else {
            expect(e.holding).to.be.true;
          }
        },
        "release": releaseHandler,
        "animationStart" : animationStartHandler,
        "animationEnd" : animationEndHandler
      });
      this.inst.bind(this.el);

      // When
      Simulator.gestures.pan(this.el, {
        pos: [30, 30],
        deltaX: -50,
        deltaY: 10,
        duration: 3000,
        easing: "linear"
      }, function() {
        // Then
        // for test animation event
        setTimeout(function() {
          var holdEvent = holdHandler.getCall(0).args[0];
          expect(holdHandler.calledOnce).to.be.true;
          expect(holdEvent.pos).to.deep.equal([0,0]);
          expect(holdEvent.hammerEvent.isFirst).to.be.true;
          expect(releaseHandler.calledOnce).to.be.true;
          expect(animationStartHandler.calledOnce).to.be.true;
          expect(animationEndHandler.calledOnce).to.be.true;
          done();
        }, 1000);
      });
    });

    it("should check fast movement test (velocity)", (done) => {
      // Given
      var holdHandler = sinon.spy();
      var releaseHandler = sinon.spy();
      var animationStartHandler = sinon.spy();
      var animationEndHandler = sinon.spy();

      this.inst.on( {
        "hold": holdHandler,
        "change": function(e) {
          if(animationStartHandler.called) {
            expect(e.holding).to.be.false;
          } else {
            expect(e.holding).to.be.true;
          }
        },
        "release": releaseHandler,
        "animationStart" : animationStartHandler,
        "animationEnd" : animationEndHandler
      });
      this.inst.bind(this.el);

      // When
      Simulator.gestures.pan(this.el, {
        pos: [0, 0],
        deltaX: 100,
        deltaY: 100,
        duration: 500,
        easing: "linear"
      }, function() {
        // Then
        // for test animation event
        setTimeout(function() {
          var holdEvent = holdHandler.getCall(0).args[0];
          expect(holdHandler.calledOnce).to.be.true;
          expect(holdEvent.pos).to.deep.equal([0,0]);
          expect(holdEvent.hammerEvent.isFirst).to.be.true;
          expect(releaseHandler.calledOnce).to.be.true;
          expect(animationStartHandler.calledOnce).to.be.true;
          expect(animationEndHandler.calledOnce).to.be.true;
          done();
        }, 2000);
      });
    });    

    it("should check movement test when stop method was called in 'animationStart' event", (done) => {
      // Given
      var timer = null;
      var holdHandler = sinon.spy();
      var releaseHandler = sinon.spy();
      var animationStartHandler = sinon.spy(function(e) {
            e.stop();
            timer = setTimeout(function() {
              timer = null;
              e.done();
            }, e.duration);
          });
      var animationEndHandler = sinon.spy();

      this.inst.on( {
        "hold": holdHandler,
        "change": function(e) {
          if(animationStartHandler.called) {
            expect(e.holding).to.be.false;
          } else {
            expect(e.holding).to.be.true;
          }
        },
        "release": releaseHandler,
        "animationStart" : animationStartHandler,
        "animationEnd" : animationEndHandler
      });
      this.inst.bind(this.el);

      // When
      Simulator.gestures.pan(this.el, {
        pos: [30, 30],
        deltaX: 100,
        deltaY: 100,
        duration: 500,
        easing: "linear"
      }, function() {
        // Then
        // for test animation event
        setTimeout(function() {
          var holdEvent = holdHandler.getCall(0).args[0];
          expect(holdHandler.calledOnce).to.be.true;
          expect(holdEvent.pos).to.deep.equal([0,0]);
          expect(holdEvent.hammerEvent.isFirst).to.be.true;
          expect(releaseHandler.calledOnce).to.be.true;
          expect(animationStartHandler.calledOnce).to.be.true;
          expect(animationEndHandler.calledOnce).to.be.true;
          done();
        }, 1000);
      });
    }); 
});

describe("MovableCoord Direction Test", function() {
    this.timeout(10000);
    beforeEach(() => {
      this.inst = new MovableCoord( {
        min : [ 0, 0 ],
        max : [ 300, 400 ],
        bounce : 100,
        margin : 0,
        circular : false
      });
      var el = sandbox();
      var html = `<div id="area" 
        style="position:relative; border:5px solid #444; width:300px; height:400px; color:#aaa; margin:0;box-sizing:content-box; z-index:9;"></div>`;
      el.innerHTML = html;
      this.el = el;
    });
    afterEach(() => {
      if(this.inst) {
        this.inst.destroy();
        this.inst = null;
      }
      cleanup();
    });
    
    it("should check movement direction (DIRECTION_ALL)", (done) => {
      // Given
      var releaseHandler = sinon.spy();
      this.inst.on("release", releaseHandler);
      this.inst.bind(this.el, {
        direction : DIRECTION.DIRECTION_ALL
      });

      // When
      Simulator.gestures.pan(this.el, {
        pos: [0, 0],
        deltaX: 10,
        deltaY: 10,
        duration: 2000,
        easing: "linear"
      }, () => {
        expect(releaseHandler.getCall(0).args[0].depaPos).to.deep.equal([10, 10]);
        expect(this.inst._pos).to.deep.equal([10, 10]);
        done();
      });
    });

    it("should check movement direction (DIRECTION_HORIZONTAL)", (done) => {
      // Given
      var releaseHandler = sinon.spy();
      this.inst.on("release", releaseHandler);
      this.inst.bind(this.el, {
        direction : DIRECTION.DIRECTION_HORIZONTAL
      });

      // When
      Simulator.gestures.pan(this.el, {
        pos: [0, 0],
        deltaX: 10,
        deltaY: 10,
        duration: 2000,
        easing: "linear"
      }, () => {
        expect(releaseHandler.getCall(0).args[0].depaPos).to.deep.equal([10, 0]);
        expect(this.inst._pos).to.deep.equal([10, 0]);
        done();
      });
    });    

    it("should check movement direction (DIRECTION_VERTICAL)", (done) => {
      // Given
      var releaseHandler = sinon.spy();
      this.inst.on("release", releaseHandler);
      this.inst.bind(this.el, {
        direction : DIRECTION.DIRECTION_VERTICAL
      });

      // When
      Simulator.gestures.pan(this.el, {
        pos: [0, 0],
        deltaX: 3,
        deltaY: 10,
        duration: 2000,
        easing: "linear"
      }, () => {
        expect(releaseHandler.getCall(0).args[0].depaPos).to.deep.equal([0, 10]);
        expect(this.inst._pos).to.deep.equal([0, 10]);
        done();
      });
    });    

    it("should check cross movement (vertical movement on DIRECTION_HORIZONTAL)", (done) => {
      // Given
      var releaseHandler = sinon.spy();
      this.inst.on("release", releaseHandler);
      this.inst.bind(this.el, {
        direction : DIRECTION.DIRECTION_HORIZONTAL
      });

      // When
      Simulator.gestures.pan(this.el, {
        pos: [0, 0],
        deltaX: 0,
        deltaY: 10,
        duration: 1000,
        easing: "linear"
      }, () => {
        expect(releaseHandler.getCall(0).args[0].depaPos).to.deep.equal([0, 0]);
        expect(this.inst._pos).to.deep.equal([0, 0]);
        done();
      });
    });      

    it("should check cross movement test (horizontal movement on DIRECTION_VERTICAL", (done) => {
      // Given
      var releaseHandler = sinon.spy();
      this.inst.on("release", releaseHandler);
      this.inst.bind(this.el, {
        direction : DIRECTION.DIRECTION_VERTICAL
      });

      // When
      Simulator.gestures.pan(this.el, {
        pos: [0, 0],
        deltaX: 10,
        deltaY: 0,
        duration: 1000,
        easing: "linear"
      }, () => {
        expect(releaseHandler.getCall(0).args[0].depaPos).to.deep.equal([0, 0]);
        expect(this.inst._pos).to.deep.equal([0, 0]);
        done();
      });
    });      
});