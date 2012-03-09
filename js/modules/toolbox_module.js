var ToolBoxModule = new Class({
  Extends: Module,
  
  _module_name: 'toolbox',
  
  _selected_tool: null,
  
  DEFAULT_TOOL: '_transform_tool',
  
  /**
   * Tools
   */
   
  _transform_tool: null,
  
  _rectangle_tool: null,
  
  _brush_tool: null,
  
  _ellipse_tool: null,
  
  _eraser_tool: null,
  
  init: function() {
    this._transform_tool = new TransformTool();
    this._rectangle_tool = new RectangleTool();
    this._brush_tool = new BrushTool();
    this._ellipse_tool = new EllipseTool();
    this._eraser_tool = new EraserTool();
    
    this._set_up_tools(
      this._transform_tool, 
      this._rectangle_tool,
      this._brush_tool,
      this._ellipse_tool,
      this._eraser_tool
    );
  },
  
  select_default_tool: function() {
    this._select_tool(this[this.DEFAULT_TOOL]);
  },
  
  _set_up_tools: function() {
    for(var i = 0; i < arguments.length; i++) {
      arguments[i].get_icon().inject(this._container);
      arguments[i].get_icon().addEvent('click', this._select_tool.bind(this, arguments[i]));
    }
  },
  
  _select_tool: function(tool) {
    if(tool != this._selected_tool) {
    
      if(this._selected_tool != null) {
        this._selected_tool.deselect();
      }
      
      tool.select();
      this._selected_tool = tool;
      
      this.fireEvent('toolSelected', tool);
      console.log('select_tool');
    }
  }
});

