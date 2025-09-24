import { Component, inject } from '@angular/core';
import { SideNavService } from './side-nav.service';
import { BehaviorSubject } from 'rxjs';
import { SideNavItem } from '../../models/sideNav.interface';
import { SideNavItemComponent } from './side-nav-item/side-nav-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    SideNavItemComponent,
    CommonModule
  ],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent {
  public sideNavService = inject(SideNavService)
  item$: BehaviorSubject<SideNavItem[]> = this.sideNavService.sideNavItem$
}
