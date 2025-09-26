import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environments } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class FichasServiceService {
  private http = inject(HttpClient)

  //Api 
  private records = environments.sistemaDeVentasBackendApi + '/records';

  constructor() { }

  sentDataFichas(data: Partial<FormData>) {
    console.log(data)
    return this.http.post(this.records, data, { withCredentials: true })
  }
}
