export const direction = {
    ArrowUp: function(){return {x:this.x,y:this.y-5}},
    ArrowDown: function(){return {x:this.x,y:this.y+5}},
    ArrowRight: function(){return {x:this.x+5,y:this.y}},
    ArrowLeft: function(){return {x:this.x-5,y:this.y}},
  }