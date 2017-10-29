import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'pill-button',
  templateUrl: './pill-button.component.html',
  styleUrls: ['./pill-button.component.scss']
})
export class PillButtonComponent implements OnInit {
  @Input() link: string;
  @Input() label: string;
  @Input() color: string;
  constructor() {}

  ngOnInit() {}
}
