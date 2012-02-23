var RectangleTool = new Class({
  Extends: ToolAbstract,
  
  _tool_name: 'rectangle_tool',
  
  _on_mouse_down: function(e) {
    var RECTANGLE_DEFAULT_WIDTH = 10;
    var RECTANGLE_DEFAULT_HEIGHT = 10;
    
    var pointer = this.getPointer(e),
       rect = new fabric.Rect({
         width: RECTANGLE_DEFAULT_WIDTH,
         height: RECTANGLE_DEFAULT_HEIGHT,
         top: pointer.y - RECTANGLE_DEFAULT_HEIGHT / 2,
         left: pointer.x - RECTANGLE_DEFAULT_WIDTH / 2,
         fill: 'rgba(255,0,0,0.5)'
       });
         
    this.add(rect);
    
    this.deactivateAllWithDispatch();
    this.setActiveObject(rect, e);
    
    this.stateful && rect.saveState();
    this.onBeforeScaleRotate(rect);
    this._setupCurrentTransform(e, rect);
  },
  
  _on_mouse_up: fabric.Canvas.prototype.__onMouseUp,
  
  _on_mouse_move: fabric.Canvas.prototype.__onMouseMove
});
