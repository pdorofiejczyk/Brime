var BrushTool = new Class({
  Extends: ToolAbstract,
  
  _tool_name: 'brush_tool',
  
  _activate: function() {
    this._context.isDrawingMode = true;
    console.log('drawing mode');
  },
  
  _deactivate: function() {
  console.log('drawing mode off');
    this._context.isDrawingMode = false;
  },
  
  _on_mouse_up: function (e) {
    if (this.isDrawingMode && this._isCurrentlyDrawing) {
        this._finalizeDrawingPath();
    }
  },
  
  _on_mouse_down: function (e) {
    // accept only left clicks
    var isLeftClick  = 'which' in e ? e.which == 1 : e.button == 1;
    if (!isLeftClick && !fabric.isTouchSupported) return;

    if (this.isDrawingMode) {
      this._prepareForDrawing(e);

      // capture coordinates immediately; this allows to draw dots (when movement never occurs)
      this._captureDrawingPath(e);
    }
  },
  
  _on_mouse_move: function (e) {
    if (this.isDrawingMode) {
      if (this._isCurrentlyDrawing) {
        this._captureDrawingPath(e);
      }
    }
  }
  
});
