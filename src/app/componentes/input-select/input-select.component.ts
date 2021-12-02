import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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

  constructor() { }

  @Input() classeCss: any;
  @Input() id: string;
  @Input() cssLabel = '';
  @Input() label: string;
  @Input() isReadOnly = false;
  @Input() data: { id: string, text: string, sigla?: string }[];
  @Input() multiple: string;
  @Input() placeholder: string;
  @Input() settings: any = {}
  @Input() isDisabled = false;

  closeDropdownSelection=false;


  get options(): { id: string, text: string }[] {
    if (!this.data) {
      this.data = [];
    }
    return this.data;
  }

  private innerValue: any;

  get value() {
    return this.innerValue;
  }

  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCb(v);
    }
  }

  ngOnInit() {
    const isSingleSelection = this.multiple === 'true' ? false : true;

    this.configuracaoDoCampoSelect(isSingleSelection)
  }

  configuracaoDoCampoSelect(isSingleSelection:boolean){
    this.settings = {
      singleSelection: isSingleSelection,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      closeDropDownOnSelection: this.closeDropdownSelection
    };
  }

  onChangeCb: (_: any) => void = () => {};
  onTouchedCb: (_: any) => void = () => {};

  writeValue(v: any): void {
    this.value = v;
  }

  registerOnChange(fn: any): void {
    this.onChangeCb = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isReadOnly = isDisabled;
  }

}
