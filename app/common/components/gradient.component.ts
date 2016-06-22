import {BaseComponent} from "../base.component.ts";
import BindingType from "../binding-types.ts";

class GradientController {
  static $inject = ['$element', '$attrs'];
  constructor(private $element, private $attrs){}

  $postLink() {
    let fromColor = this.$attrs.fromColor || '#fff';
    let toColor = this.$attrs.ToColor || '#cbebff';
    this.$element.parent().css('position', 'relative')
      .css('padding-bottom', '0px');
    this.$element.css('position', 'absolute')
      .css('left', '0')
      .css('bottom', '0')
      .css('height', '20px')
      .css('width', '100%')
      .css('background', `
           linear-gradient(to bottom, ${fromColor} 0%,${toColor} 100%)
           `);
  }
}

export default class GradientComponent extends BaseComponent {

  public transclude = true;

  public controller = GradientController;
}
