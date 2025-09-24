import { Component } from '@angular/core';

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [],
  templateUrl: './profiles.component.html',
  styleUrl: './profiles.component.css'
})
export class ProfilesComponent {
  arr = [2,3,5,7,11,13,17,19,23]


  eliminar() {
    this.arr.pop()
  }
}
