import {BaseComponent} from "../base.component.ts";
import BindingType from "../binding-types.ts";

const binding:{[bindngs: string]: string} = {
  text: BindingType.VALUE
};

export default class LoadingComponent extends BaseComponent {
  public template = `
    <div class="loading">
    <i class="fa fa-spinner fa-spin pull-left">
    </i>
    <h4>{{vm.text || 'Loading...'}}</h4>
    </div>
    `;

  public bindings = binding;
}
