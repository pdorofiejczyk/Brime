/**
* Fake tool, working as default fabric.Canvas
*/

var TransformTool = new Class({
  Extends: ToolAbstract,
  
  _tool_name: 'selection_tool',
  
  _on_mouse_up: fabric.Canvas.prototype.__onMouseUp,
  
  _on_mouse_down: function (e) {

      // accept only left clicks
      var isLeftClick  = 'which' in e ? e.which == 1 : e.button == 1;
      if (!isLeftClick && !fabric.isTouchSupported) return;

      if (this.isDrawingMode) {
        this._prepareForDrawing(e);

        // capture coordinates immediately; this allows to draw dots (when movement never occurs)
        this._captureDrawingPath(e);

        return;
      }

      // ignore if some object is being transformed at this moment
      if (this._currentTransform) return;

      var target = this.getActiveObject() ? this.getActiveObject() : this.findTarget(e),
          pointer = this.getPointer(e),
          activeGroup = this.getActiveGroup(), 
          corner;


        // determine if it's a drag or rotate case
        // rotate and scale will happen at the same time
        this.stateful && target.saveState();

        if (corner = target._findTargetCorner(e, this._offset)) {
          this.onBeforeScaleRotate(target);
        }

        this._setupCurrentTransform(e, target);

        var shouldHandleGroupLogic = e.shiftKey && (activeGroup || this.getActiveObject());
        if (shouldHandleGroupLogic) {
          this._handleGroupLogic(e, target);
        }
        else {
          if (target !== this.getActiveGroup()) {
            this.deactivateAll();
          }
          this.setActiveObject(target, e);
        }

      // we must renderAll so that active image is placed on the top canvas
      this.renderAll();

      this.fire('mouse:down', { target: target, e: e });
    },
  
  _on_mouse_move: fabric.Canvas.prototype.__onMouseMove
});
