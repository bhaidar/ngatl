import { Component } from '@angular/core';

@Component({
  template: `
    <ui-grid [items]="items">
      <ng-container *uiGridTemplate="let item">
        <ui-card
          [title]="item.title"
          [titleLink]="item.path"
          [subtitle]="item.subtitle"
          [image]="item.image">
        </ui-card>
      </ng-container>
    </ui-grid>
  `
})
export class ConferenceIndexComponent {
  public items = [
    {
      title: 'Speakers',
      subtitle: 'Mange the conference Speakers',
      path: '/conference/speakers',
    },
    {
      title: 'Sessions',
      subtitle: 'Mange the conference Sessions',
      path: '/conference/sessions',
    },
    {
      title: 'Schedule',
      subtitle: 'Mange the conference Schedule',
      path: '/conference/schedule',
    },
    {
      title: 'Sponsors',
      subtitle: 'Mange the conference Sponsors',
      path: '/conference/sponsors',
    }
  ];
}
