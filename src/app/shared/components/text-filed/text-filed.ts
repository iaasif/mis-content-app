import { Component, input } from '@angular/core';

@Component({
  selector: 'app-text-filed',
  imports: [],
  templateUrl: './text-filed.html',
  styleUrl: './text-filed.css',
})
export class TextFiled {
  text = input('')
}
