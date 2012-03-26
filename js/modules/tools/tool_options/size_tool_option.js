var SizeToolOption = new Class({
  Extends: ToolOptionAbstract,
  
  _option_name: 'size_tool_option',
  
  _input: null,
  
  _init: function() {
    this._input = new Element('input', {'type': 'text'});
    
    this._input.addEvent('change', function() {
      this._on_option_changed(this._input.value);
    }.bind(this));
    
    this._input.inject(this._container);
  },
  
  set_value: function(value) {
    this._input.value = value;
  }
});
