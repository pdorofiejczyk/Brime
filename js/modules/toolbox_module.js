var ToolBoxModule = new Class({
  Extends: Module,
  
  _module_name: 'toolbox',
  
  _selected_tool: null,
  
  /**
   * Tools
   */
   
  _transform_tool: null,
  
  init: function() {
    this._transform_tool = new TransformTool();
      this._transform_tool.get_icon().inject(this._container);
      this._transform_tool.get_icon().addEvent('click', this._on_tool_click.bind(this, this._transform_tool));
  },
  
  _on_tool_click: function(tool) {
    if(this._selected_tool != null) {
      this._selected_tool.get_icon().removeClass('selected');
    }
    
    tool.get_icon().addClass('selected');
    this._selected_tool = tool;
    
    this.fireEvent('toolSelected', tool);
  }
});

