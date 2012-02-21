var ToolAbstract = new Class({
  _context: null,
  
  _icon: null,
  
  _tool_name: '',
  
  initialize: function() {
    this._icon = new Element('div', {'id': this._tool_name, 'class': 'tool'});
  },
  
  set_context: function(context) {
    if(context instanceof fabric.Canvas) {
      this._context = context;
    }
    else {
      throw new Error('Context must be instance of fabric.Canvas');
    }
  },
  
  get_icon: function() {
    return this._icon;
  },
  
  on_mouse_up: function() {
    throw new Error('Method on_mouse_up is not implemented');
  },
  
  _on_mouse_down: function() {
    throw new Error('Method on_mouse_down is not implemented');
  },
  
  on_mouse_move: function() {
    throw new Error('Method on_mouse_move is not implemented');
  }
});
