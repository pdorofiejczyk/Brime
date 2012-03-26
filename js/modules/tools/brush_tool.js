var BrushTool = new Class({
  Extends: ToolAbstract,
  
  _tool_name: 'brush_tool',
  
  _activate: function() {
    this._context.isDrawingMode = true;
    this._tool_options['size'].set_value(this._context.freeDrawingLineWidth);
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
  },
  
  _set_up_tool_options: function() {
    this._tool_options_container = new Element('div');
  
    this._tool_options['size'] = new SizeToolOption();
    this._tool_options['size'].addEvent('optionChanged', function(option) {
      console.log('optionChanged', option.value);
      this._context.freeDrawingLineWidth = option.value;
      this._context.contextMiddle.lineWidth = option.value;
    }.bind(this));
    this._tool_options['size'].get_container().inject(this._tool_options_container);
    
    this._tool_options['color'] = new ColorToolOption();
    this._tool_options['color'].get_container().inject(this._tool_options_container);
    this._tool_options['color'].addEvent('optionChanged', function(option) {
      
      this._context.freeDrawingColor = 'rgba('+option.value[0]+', '+option.value[1]+', '+option.value[2]+', 1.0)';
      console.log(this._context.freeDrawingColor);
      this._context.contextMiddle.strokeStyle = this._context.freeDrawingColor;
    }.bind(this));
    
  }
  
});
