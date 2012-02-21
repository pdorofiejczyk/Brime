var ToolBoxModule = new Class({
  Extends: Module,
  
  _module_name: 'toolbox',
  
  _tools_constructors: [
    SelectionTool
  ],
  
  _tools_instances: {},
  
  init: function() {
    for(var i = 0; i < this._tools_constructors.length; i++) {
      var tool = new window[id]();
      var tool_icon = tool.get_icon();
        tool_icon.inject(this._container);
        
        tool_icon.addEvent('click', this._on_tool_click.bind(this, tool));
        
      this._tools[id] = tool;
    }
  },
  
  _on_tool_click: function(tool) {
    this.fireEvent('toolSelected', tool);
  }
});
