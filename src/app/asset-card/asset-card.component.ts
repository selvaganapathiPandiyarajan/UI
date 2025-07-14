import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-asset-card',
  standalone: true,
  imports: [],
  templateUrl: './asset-card.component.html',
  styleUrl: './asset-card.component.css'
})
export class AssetCardComponent {
  @Input() icon!: string;
  @Input() iconColor!: string;
  @Input() value!: string;
  @Input() label!: string;
  @Input() badgeValue!: string;
  @Input() badgeColor: string = '#e0f7fa';
  @Input() borderStyle: string = 'none'; 

  parseIntValue(value: string): number {
    return parseInt(value, 10);
  }
}

