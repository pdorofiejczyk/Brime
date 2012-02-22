var ToolBoxModule = new Class({
  Extends: Module,
  
  _module_name: 'toolbox',
  
  _selected_tool: null,
  
  DEFAULT_TOOL: '_transform_tool',
  
  /**
   * Tools
   */
   
  _transform_tool: null,
  
  init: function() {
    this._transform_tool = new TransformTool();
      this._transform_tool.get_icon().inject(this._container);
      this._transform_tool.get_icon().addEvent('click', this._select_tool.bind(this, this._transform_tool));
  },
  
  select_default_tool: function() {
    this._select_tool(this[this.DEFAULT_TOOL]);
  },
  
  _select_tool: function(tool) {
    if(tool != this._selected_tool) {
    
      if(this._selected_tool != null) {
        this._selected_tool.get_icon().removeClass('selected');
      }
      
      tool.get_icon().addClass('selected');
      this._selected_tool = tool;
      
      this.fireEvent('toolSelected', tool);
      console.log('select_tool');
    }
  }
});

