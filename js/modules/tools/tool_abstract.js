var ToolAbstract = new Class({
  
  _icon: null,
  
  _tool_name: '',
  
  initialize: function() {
    this._icon = new Element('div', {'id': this._tool_name, 'class': 'tool'});
  },
  
  inject: function(context) {
    if(context instanceof fabric.Canvas) {
      context.setOnMouseUp(this._on_mouse_up.bind(context));
      context.setOnMouseDown(this._on_mouse_down.bind(context));
      context.setOnMouseMove(this._on_mouse_move.bind(context));
    }
    else {
      throw new Error('Context must be instance of fabric.Canvas');
    }
  },
  
  get_icon: function() {
    return this._icon;
  },
  
  _on_mouse_up: function() {
    throw new Error('Method on_mouse_up is not implemented');
  },
  
  _on_mouse_down: function() {
    throw new Error('Method on_mouse_down is not implemented');
  },
  
  _on_mouse_move: function() {
    throw new Error('Method on_mouse_move is not implemented');
  }
});
