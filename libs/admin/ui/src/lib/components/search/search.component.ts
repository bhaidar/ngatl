import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'ui-search',
  template: `    
    <mat-toolbar color="primary">
      <mat-form-field>
        <input type="text"
               #q
               placeholder="Search"
               matInput
               [formControl]="query"
               [matAutocomplete]="auto"
               (keyup.escape)="cancel(q)">
        <mat-autocomplete autoActiveFirstOption #auto="matAutocomplete">
          <mat-option *ngFor="let option of options" [value]="option">
            {{option}}
          </mat-option>
        </mat-autocomplete>
      </mat-form-field>
    </mat-toolbar>
  `,
  styles: [
    `
    mat-toolbar {
      height: 128px;
    }
    form,
    mat-form-field {
      width: 100%;
    }
  `
  ]
})
export class SearchComponent {
  @Input() public options: string[];
  @Output() public action = new EventEmitter();

  query = new FormControl();
  ngOnInit() {
    this.query.valueChanges
      .pipe(
        startWith(''),
        map(value => this.action.emit({ type: 'SEARCH', payload: value }))
      )
      .subscribe();
  }

  cancel(query) {
    if (query.value === '') {
      query.blur();
    }
    this.query.setValue('')
  }
}
