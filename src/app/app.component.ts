import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LayoutComponent } from './core/layouts/layout/layout.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [LayoutComponent]
})
export class AppComponent {
  title = 'mis-content-app';
  formControlTest = new FormControl(false);

  constructor(private toastr: ToastrService) {
    // this.toastr.success('Hello world!', 'Toastr fun!');
  }
}
