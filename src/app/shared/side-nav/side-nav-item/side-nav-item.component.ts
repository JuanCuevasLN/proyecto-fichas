import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SideNavItem } from '../../../models/sideNav.interface';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-side-nav-item',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './side-nav-item.component.html',
  styleUrl: './side-nav-item.component.css'
})
export class SideNavItemComponent {
  @Input({ required: true}) item!: SideNavItem;
}
