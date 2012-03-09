var EllipseTool = new Class({
  Extends: ToolAbstract,
  
  _tool_name: 'ellipse_tool',
  
  _on_mouse_down: function(e) {
    var DEFAULT_RX = 10;
    var DEFAULT_RY = 10;
    
    var pointer = this.getPointer(e),
        ellipse = new fabric.Ellipse({
         rx: DEFAULT_RX,
         ry: DEFAULT_RY,
         top: pointer.y - DEFAULT_RY,
         left: pointer.x - DEFAULT_RX,
         fill: 'rgba(255,0,0,0.5)'
       })
       obj = new fabric.MultiObject([ellipse]);
         
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
