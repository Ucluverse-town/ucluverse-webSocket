

const gaugeState = (state) => (state === 'mid' ? 'left' : state === 'left' ? 'right' : 'left');
const danceList = ['leftUp', 'rightMid', 'rightUp', 'leftMid'];

const danceState = (state) =>
  !danceList.includes(state)
    ? danceList[0]
    : state === danceList[0]
    ? danceList[1]
    : state === danceList[1]
    ? danceList[2]
    : state === danceList[2]
    ? danceList[3]
    : danceList[1];

const moveDistance = 20;

const direction = {
  ArrowRight: {
    background: function () {
      return { top: this.top, left: this.left - moveDistance };
    },
    character: function () {
      return {
        name: this.name,
        x: this.x + moveDistance,
        y: this.y,
        direction: 'right',
        state: gaugeState(this.state),
        cId: this.cId,
      };
    },
  },
  ArrowLeft: {
    background: function () {
      return { top: this.top, left: this.left + moveDistance };
    },
    character: function () {
      return {
        name: this.name,
        x: this.x - moveDistance,
        y: this.y,
        direction: 'left',
        state: gaugeState(this.state),
        cId: this.cId,
      };
    },
  },
  ArrowUp: {
    background: function () {
      return { top: this.top + moveDistance, left: this.left };
    },
    character: function () {
      return {
        name: this.name,
        x: this.x,
        y: this.y - moveDistance,
        direction: 'up',
        state: gaugeState(this.state),
        cId: this.cId,
      };
    },
  },
  ArrowDown: {
    background: function () {
      return { top: this.top - moveDistance, left: this.left };
    },
    character: function () {
      return {
        name: this.name,
        x: this.x,
        y: this.y + moveDistance,
        direction: 'down',
        state: gaugeState(this.state),
        cId: this.cId,
      };
    },
  },
  KeyZ: {
    background: function () {
      return this;
    },
    character: function () {
      return {
        name: this.name,
        x: this.x,
        y: this.y,
        direction: this.direction,
        state: danceState(this.state),
        cId: this.cId,
      };
    },
  },
};

export default { direction };
