/**
* Fake tool, working as default fabric.Canvas
*/

var TransformTool = new Class({
  Extends: ToolAbstract,
  
  _tool_name: 'selection_tool',
  
  _on_mouse_up: fabric.Canvas.prototype.__onMouseUp,
  
  _on_mouse_down: fabric.Canvas.prototype.__onMouseDown,
  
  _on_mouse_move: fabric.Canvas.prototype.__onMouseMove
});
