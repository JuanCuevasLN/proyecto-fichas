import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { SideNavItem } from '../../models/sideNav.interface';

@Injectable({
  providedIn: 'root'
})
export class SideNavService {

  constructor() { }

  sideNavItem$: BehaviorSubject<SideNavItem[]> = new BehaviorSubject<SideNavItem[]>([])
  
}
