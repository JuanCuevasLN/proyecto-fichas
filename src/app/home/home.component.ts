import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input } from '@angular/core';

//Angular Material
import { MatSidenavModule } from '@angular/material/sidenav';

//Sistema
import { AuthService } from '../system/auth.service';
import { SideNavService } from '../shared/side-nav/side-nav.service';
import { SideNavComponent } from "../shared/side-nav/side-nav.component";

//RXJS
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet, 
    MatSidenavModule,
    CommonModule,
    SideNavComponent,
    MatIconModule
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})

export class HomeComponent {
  public dataUser:any;
  private destroyRef = inject(DestroyRef)
  private authService = inject(AuthService);
  private sideNavService = inject(SideNavService);
  
  sideSwitch: boolean = true;



  ngOnInit() {
    this.authService.connectedUser$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe( user => {
      if (user) {
        this.dataUser = user;
        this.sideNavService.sideNavItem$.next([
          {
            type: 'subheading',
            label: 'Datos',
            icon:'storage',
            children: [
              {
                type: 'link',
                label: 'Fichas',
                router: 'fichas',
                icon: 'description',
              },
              {
                type: 'link',
                icon: 'group',
                label: 'Perfiles',
                router: 'profiles',
              },
              {
                type: 'link',
                icon: 'bookmark',
                label: 'Guardadas',
                router: '/guardadas',
              }
            ]
          },
          {
            label: 'Analisis',
            icon: 'analytics',
            type: 'subheading',
            children: [
              {
                type: 'link',
                router: '/grafica',
                icon: 'scatter_plot',
                label: 'Grafica de dispersion',
              },
              {
                type: 'link',
                icon: 'timeline',
                router: '/linea',
                label: 'Linea del tiempo',
              }, 
              {
                type: 'link',
                icon: 'insights',
                router: '/linea',
                label: 'prediccion',
              }
            ]
          },
          {
            label: 'Sistema',
            type: 'subheading',
            icon: 'developer_board ',
            children: [
              {
                type: 'link',
                icon: 'settings',
                router: '/config',
                label: 'Configuracion',
              },
              {
                type: 'link',
                router: '/create',
                icon: 'person_add',
                label: 'Crear Usuario',
              }
            ]
          }
        ])
      }
    })

  }
  
  swithSide = () => {
    this.sideSwitch = !this.sideSwitch
  }

}

