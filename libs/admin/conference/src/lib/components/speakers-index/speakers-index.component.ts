import { Component, OnInit } from '@angular/core'

@Component({
  template: `
    <ui-grid [items]="items">
      <ng-container *uiGridTemplate="let item">
        <ui-card
          [title]="item.title"
          [titleLink]="item.path"
          [subtitle]="item.subtitle">
        </ui-card>
      </ng-container>
    </ui-grid>
  `
})
export class SpeakersIndexComponent implements OnInit {
  public items = [];

  ngOnInit() {
    this.items = Array(100).fill(0).map((_, idx) => {
      return {
        title: 'Speakers title ' + idx,
        subtitle: 'Speakers subtitle ' + idx,
        path: idx,
      }
    })
  }
}
