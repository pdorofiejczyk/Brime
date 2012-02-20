var ButtonsModule = new Class({
  Extends: Module,
  
  _module_name: 'buttons',
  
  _buttons: {},
  
  _load_file_form: null,
  
  init: function() {
    this._buttons.load_file = new Element('div', {'id': 'load_file'});
      this._buttons.load_file.inject(this._container);
    
    this._load_file_form = new Element('input', {'id':'load_file_form', 'type': 'file', 'name': 'files[]'});
      this._load_file_form.inject(this._buttons.load_file);
    
    this._init_events();
  },
  
  _init_events: function() {
    this._load_file_form.addEvent('change', function(e) {
      this._on_file_form_changed(e);
    }.bind(this));
  },
  
  _on_file_form_changed: function(e) {
    if(e.target.files.length > 0) {
  		var reader = new FileReader();

      reader.onloadend = function (e) {
      console.log(e.target.result);
	      this.fireEvent('fileLoaded', e.target.result);
      }.bind(this);
      reader.readAsDataURL(e.target.files[0]);
    }
  }
});
