import { AfterViewInit, Directive, Input, inject } from '@angular/core';
import { MatOption, MatSelect } from '@angular/material/select';

@Directive({
  selector: 'mat-option[selectAll]',
  standalone: true,
})
export class SelectAllDirective implements AfterViewInit {
  @Input() allValues: any[] = [];

  private _matSelect = inject(MatSelect);
  private _matOption = inject(MatOption);

  ngAfterViewInit(): void {
    const parentSelect = this._matSelect;
    const parentFormControl = parentSelect.ngControl.control;

    // For changing other option selection based on select all
    this._matOption.onSelectionChange.subscribe((ev) => {
      if (ev.isUserInput) {
        if (ev.source.selected) {
          parentFormControl?.setValue(this.allValues);
          this._matOption.select(false);
        } else {
          parentFormControl?.setValue([]);
          this._matOption.deselect(false);
        }
      }
    });

    // For changing select all based on other option selection
    parentSelect.optionSelectionChanges.subscribe((v) => {
      if (v.isUserInput && v.source.value !== this._matOption.value) {
        if (!v.source.selected) {
          this._matOption.deselect(false);
        } else {
          if (parentFormControl?.value.length === this.allValues.length) {
            this._matOption.select(false);
          }
        }
      }
    });

    // If user has kept all values selected in select's form-control from the beginning
    setTimeout(() => {
      if (parentFormControl?.value.length === this.allValues.length) {
        this._matOption.select(false);
      }
    });
  }
}
