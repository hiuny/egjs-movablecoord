import MovableCoord from '../../src/movableCoord.js';

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
        style="position:relative; border:5px solid #444; width:300px; height:400px; color:#aaa; margin:0;box-sizing:content-box; z-index:9;"></div>
        <div id="hmove" style="position:relative; border:5px solid #888; background-color:yellowgreen;width:300px; height:80px;"></div>
        <div id="vmove" style="position:relative; border:5px solid #888; background-color:skyblue;width:80px; height:400px; left:310px; top:-500px;"></div>`;
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
