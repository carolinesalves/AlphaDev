import { Component, forwardRef, Input, OnInit, Optional, Host, SkipSelf } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ControlContainer, AbstractControl } from '@angular/forms';

const INPUT_FIELD_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputSelectComponent),
  multi: true
};

@Component({
  selector: 'app-input-select',
  templateUrl: './input-select.component.html',
  styleUrls: ['./input-select.component.css'],
  providers: [INPUT_FIELD_VALUE_ACCESSOR]

})
export class InputSelectComponent implements ControlValueAccessor, OnInit {
  @Input() label: string;
  @Input() multiple: string;
  @Input() data: { id: string, text: string, sigla?: string }[];
  @Input() formControlName: string;
  @Input() isDisabled = false;
  @Input() selectAll = true;
  _value = [];
  @Input() settings: any;
  @Input() placeholder: string;
  public control: AbstractControl | any;

  get options(): { id: string, text: string }[] {
    if (!this.data) {
      this.data = [];
    }
    return this.data;
  }

  get value() {
    return this._value;
  }

  set value(val) {
    if (typeof val === 'string') {
      val = [];
    }
    this._value = val;
    this.propagateChange(this._value);
  }


  constructor(@Optional() @Host() @SkipSelf() private controlContainer: ControlContainer) { }

  ngOnInit() {
    const isSingleSelection = this.multiple === 'true' ? false : true;
    this.settings = {
      singleSelection: isSingleSelection,
      idField: 'id',
      textField: 'text',
      selectAllText: 'Selecionar todos',
      unSelectAllText: 'Desmarcar todos',
      enableCheckAll: this.selectAll,
      itemsShowLimit: 3,
      allowSearchFilter: true,
      closeDropDownOnSelection: false
    };
    if (this.controlContainer) {
      if (this.formControlName) {
        this.control = this.controlContainer.control.get(this.formControlName);
        const self = this;
        setTimeout(() => {
          self.control.markAsPristine();
        }, 1);
      }
    }
  }

  writeValue(value: any) {
    if (value !== undefined) {
      this.value = value;
    }
  }
  // onItemSelect(fn: any) {
  //   console.log("---------> DO FORM " + fn);
  //   this.propagateChange(fn);
  // }



  propagateChange = (_: any) => { };

  registerOnChange(fn:any) {
    this.propagateChange = fn;
  }


  registerOnTouched() {}

}
