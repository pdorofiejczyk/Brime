var SizeToolOption = var Class({
  Extends: ToolOptionAbstract,
  
  _option_name: 'size_tool_option',
  
  _init: function() {
    var input = new Element('input', {'type': 'text'});
    
    input.addEvent('change', this._on_option_changed.bind(this, input.value));
    
    input.inject(this._container);
  }
});
