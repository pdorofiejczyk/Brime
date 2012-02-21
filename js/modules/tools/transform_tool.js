/**
* Fake tool, working as default fabric.Canvas
*/

var TransformTool = new Class({
  Extends: ToolAbstract,
  
  _tool_name: 'selection_tool',
  
  on_mouse_up: fabric.Canvas.prototype.__onMouseUp.bind(this._context),
  
  on_mouse_down: fabric.Canvas.prototype.__onMouseDown.bind(this._context),
  
  on_mouse_move: fabric.Canvas.prototype.__onMouseMove.bind(this._context)
});
