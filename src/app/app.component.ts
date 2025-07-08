import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LayoutComponent } from './core/layouts/layout/layout.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [LayoutComponent]
})
export class AppComponent {
  title = 'Bdjobs-angular-boilerplate';
  formControlTest = new FormControl(false);

  constructor(private toastr: ToastrService) {
    this.toastr.success('Hello world!', 'Toastr fun!');
  }
}
