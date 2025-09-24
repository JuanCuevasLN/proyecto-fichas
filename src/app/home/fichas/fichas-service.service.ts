import { HttpClient, HttpClientModule } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { FichaDelitoData } from '../../models/ficha.interface';
import { environments } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class FichasServiceService {
  private http = inject(HttpClient)

  //Api 
  private records = environments.sistemaDeVentasBackendApi + '/records';

  constructor() { }

  sentDataFichas(data: Partial<FichaDelitoData>) {
    console.log(data)
    console.log(this.records)
    return this.http.post(this.records, data, { withCredentials: true })
  }
}
