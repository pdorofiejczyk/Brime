var EraserTool = new Class({
  Extends: BrushTool,
  
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
  }
});
