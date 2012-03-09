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
       })
       obj = new fabric.MultiObject([rect]);
         
    this.add(obj);
    
    this.deactivateAllWithDispatch();
    this.setActiveObject(obj, e);
    
    this.stateful && obj.saveState();
    this.onBeforeScaleRotate(obj);
    this._setupCurrentTransform(e, obj);
  },
  
  _on_mouse_up: fabric.Canvas.prototype.__onMouseUp,
  
  _on_mouse_move: fabric.Canvas.prototype.__onMouseMove
});
