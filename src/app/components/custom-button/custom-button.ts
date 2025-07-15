import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  imports: [],
  templateUrl: './custom-button.html',
  styleUrl: './custom-button.css'
})
export class CustomButton {


    @Input() type: string = 'button';
  @Input() disabled: boolean = false;
  @Output() click = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled) {
      this.click.emit();
    }
  }
}
