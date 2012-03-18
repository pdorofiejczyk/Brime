var EraserTool = new Class({
  Extends: ToolAbstract,
  
  _tool_name: 'eraser_tool',
  
  _activate: function() {
    this._context.isDrawingMode = true;
    this._context.freeDrawingColor = 'rgba(255, 255, 255, 1.0)';
    this._context.globalCompositeOperation = 'destination-out';
    this._context.freeDrawingLineWidth = 10;
    console.log('drawing mode');
  },
  
  _deactivate: function() {
  console.log('drawing mode off');
    this._context.isDrawingMode = false;
    this._context.globalCompositeOperation = 'source-over';
  },
  
  _on_mouse_up: function (e) {
    if (this.isDrawingMode && this._isCurrentlyDrawing) {
        this._finalizeDrawingPath();
        
        this.contextMiddle.closePath();
        var activeObject = this.getActiveObject();
        
        fabric.Image.fromURL(activeObject.toDataURL('image/png'), function(img) {
          activeObject.clearAll();
          activeObject.add(img);
        });
        
        this.clearContext(this.contextTop);
        this.clearContext(this.contextMiddle);
        this.clearContext(this.contextContainer);
        
        this.renderAll();
    }
  },
  
  _on_mouse_down: function (e) {
    // accept only left clicks
    var isLeftClick  = 'which' in e ? e.which == 1 : e.button == 1;
    if (!isLeftClick && !fabric.isTouchSupported) return;

    if (this.isDrawingMode) {
      this._prepareForDrawing(e);
      //this.getActiveObject().render(this.contextTop);
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
