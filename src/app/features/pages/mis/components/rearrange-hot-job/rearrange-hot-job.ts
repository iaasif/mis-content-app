import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { RearrangeData } from '../../utils/mis.data';

@Component({
  selector: 'app-rearrange-hot-job',
  standalone: true,
  imports: [CdkDropList, CdkDrag],
  templateUrl: './rearrange-hot-job.html',
  styleUrl: './rearrange-hot-job.css',
})
export class RearrangeHotJob {
  // col1 = [...RearrangeData]
  col1 = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
  col2 = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  col3 = ['good', 'bad', 'joss', 'nice', 'lol'];
  col4 = ['one', 'two', 'three', 'four', 'five'];
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
