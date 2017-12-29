import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-speaker-card',
  templateUrl: './speaker-card.component.html',
  styleUrls: ['./speaker-card.component.scss']
})
export class SpeakerCardComponent implements OnInit {
  // providing default value helps solve test issue:
  // https://stackoverflow.com/a/45328389
  @Input() speaker: any = {};

  showDetails: boolean = false;

  constructor() {}

  ngOnInit() {}
}
