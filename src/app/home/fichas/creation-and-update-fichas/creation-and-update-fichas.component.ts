//Angular
import { CommonModule } from '@angular/common';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { CdkStepperModule } from '@angular/cdk/stepper'; // Necesario para botones como matStepperNext
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, ElementRef, inject, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

//Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipInputEvent, MatChipsModule} from '@angular/material/chips';

//rxjs
import { BehaviorSubject } from 'rxjs';

//App
import { estados } from '../../../data/estados';
import { Estado } from '../../../models/estado-municipio.interface';
import { estadosMunicipios } from '../../../data/estados-municipios';
import { PersonaInvolucrada } from '../../../models/perfiles.interfaces';
import { ImageFormControlComponent } from "../../../shared/image-form-control/image-form-control.component";
import { VideoFormControlComponent } from "../../../shared/video-form-control/video-form-control.component";
import { DocumentsFormControlComponent } from '../../../shared/documents-form-control/documents-form-control.component';
import { SnackBarService } from '../../../shared/snack-bar.service';
import { FichasServiceService } from '../fichas-service.service';
import { TimeFormComponent } from '../../../shared/time-form/time-form.component';
@Component({
  selector: 'app-creation-and-update-fichas',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatChipsModule,
    MatSelectModule,
    MatDialogModule,
    MatButtonModule,
    CdkStepperModule,
    MatDividerModule,
    MatStepperModule,
    MatCheckboxModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    TimeFormComponent,
    ImageFormControlComponent,
    VideoFormControlComponent,
    DocumentsFormControlComponent,
],
  templateUrl: './creation-and-update-fichas.component.html',
  styleUrl: './creation-and-update-fichas.component.css'
})
export class CreationAndUpdateFichasComponent {
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private __snackBar = inject(SnackBarService);
  private fichasServiceService = inject(FichasServiceService)

  public readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public readonly colors: string[] = ['#A7C7E7', '#B5EAD7', '#FFF5BA', '#FFB7B2', '#CBAACB', '#FFDAC1', '#D0F0FD', '#E2F0CB']
  public cartelsArray = new Map<string, string>()
  public arrColors: string[] = []

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      let color = this.getColorsBackground

      if (this.arrColors.length) {
        while (color == this.arrColors[this.arrColors.length - 1]) {
          color = this.getColorsBackground
        }
      }
      this.arrColors.push(color)
      this.cartelsArray.set(value, color );
      
      this.anotherControlOrganization.push(this.fb.control(value))
    }
    event.chipInput!.clear();
  }

  get chipsList(): [string, string][] {
    return Array.from(this.cartelsArray.entries());
  } 

  get getColorsBackground() {
    return this.colors[Math.floor(Math.random()*this.colors.length)]
  }

  remove(name: string): void {
    const cartelsArrayHasName = this.cartelsArray.has(name)
    let color = this.cartelsArray.get(name)
    let index = this.arrColors.indexOf(color!)

    if (cartelsArrayHasName) {
      this.cartelsArray.delete(name);
    }
    
    if (index != -1) {
      this.arrColors.slice(index, 1)
      this.anotherControlOrganization.removeAt(index);
    }
  }

  @ViewChild('ultimoComponente') ultimoComponente!: ElementRef;

  private buildAddressesForm(): FormGroup {
    return this.fb.group({
      id: [crypto.randomUUID()],
      estado: ['', Validators.required],
      municipio: ['', Validators.required],
      localidad: [''],
      colonia: [''],
      calle: [''],
      numeroExterior: [],
      numeroInterior: [],
      cp: ['', Validators.required],
      referencias: ['', Validators.required]
    });
  };

  private getAddressesArray(i: number): FormArray {
    return this.perfilRef.at(i).get('informacion')?.get('propiedades') as FormArray;
  };

  private buildVehiclesForm(): FormGroup {
    return this.fb.group({
      marca: ['', Validators.required],
      modelo: [''],
      color: [''],
      placas: ['', Validators.required],
      tipo: ['', Validators.required],
      año: [''],
      serie: [''],
      estadoRegistro: [''],
      observaciones: ['']
    });
  };

  private getVehiclesArray(i: number): FormArray {
    return this.perfilRef.at(i).get('informacion')?.get('pertenencias') as FormArray;
  }; 
  
  addressesMap = new Map<number, AbstractControl[]>();
  vehiclesMap = new Map<number, AbstractControl[]>();

  firstFichasDataForm = this.fb.group({
    titulo: ['', Validators.required],
    horaDelSuceso: ['', Validators.required],
    fechaSuceso: ['', Validators.required],
    fechaRegistro: [Date.now(), Validators.required],
    
    clasificacion: this.fb.group({
      tema: ['', Validators.required],
      tipo: ['', Validators.required],
    }),
    
    descripcion: ['', Validators.required],
  })

  secondFichasDataForm = this.fb.group({
    locationOfTheEvents: this.fb.group({
      estado: ['', Validators.required],
      municipio: ['', Validators.required],
      localidad: [''],
    }),
  })

  thirdFichasDataForm = this.fb.group({
    involucrados: this.fb.group({
      cartel: [[], [Validators.required, Validators.minLength(1)]],
      perfiles: this.fb.array<PersonaInvolucrada>([]),
      autoridades: [[]],
    }),
  })
  perfilRef = this.thirdFichasDataForm.get('involucrados')?.get('perfiles') as FormArray;
  
  fourthFichasDataForm = this.fb.group({
     evidencias: this.fb.group({
      imagenes: [[]],
      videos: [[]],
      documentos: [[]],
    }),
  })

  fifthFichasDataForm = this.fb.group({
    fuentes: this.fb.array([]),
    verificado: [false, Validators.required],
  })

  addPerfil() {
    const perfiles = this.fb.group({
      nombre: ['', Validators.required],
      alias: [''],
      edad: ['', Validators.required],
      foto: [''],
      organizacion: ['', Validators.required],
      rol: ['', Validators.required],
      estatus: ['', Validators.required],
      genero: ['', Validators.required],

      informacion: this.fb.group({
        propiedades: this.fb.array([]),
        pertenencias: this.fb.array([]),
        notas: ['']
      })
    })

    this.perfilRef.push(perfiles);

    setTimeout(() => {
      this.ultimoComponente.nativeElement.scrollIntoView({  behavior: 'smooth' })
    }, 140);
  }

  removePerfil(index: number): void {
    const perfilRef = this.thirdFichasDataForm.get('involucrados')?.get('perfiles') as FormArray;
    
    //Limpiamos los domicilios que tenga
    const addressRef = this.getAddressesArray(index)
    addressRef.clear()
    this.addressesMap.set(index, [])

    //Limpiamos los vehiculos que tenga
    const vehicleRef = this.getVehiclesArray(index)
    vehicleRef.clear()
    this.vehiclesMap.set(index, [])
    perfilRef.removeAt(index);
  }

  addAddresses(i: number) {
    const addressesRef = this.getAddressesArray(i)
    addressesRef.push(this.buildAddressesForm())
  
    this.updateAddressesMap(i);
  }

  removeAddresses(i: number) {
    const addressesRef = this.getAddressesArray(i)
    addressesRef.removeAt(i)

    this.addressesMap.set(i, addressesRef.controls);
  }

  addVehicles(i: number) {
    const vehiculoRef = this.getVehiclesArray(i)
    vehiculoRef.push(this.buildVehiclesForm())

    this.updateVehiclesMap(i)
  }

  removeVehicles(i: number)  {
    const vehicleRef = this.getVehiclesArray(i)
    vehicleRef.removeAt(i)

    this.vehiclesMap.set(i, vehicleRef.controls)
    console.log(this.vehiclesMap.get(i))
  }

  updateAddressesMap(index: number) {
    const controls = ((this.perfilRef.at(index).get('informacion')?.get('propiedades') as FormArray)?.controls) || [];
    this.addressesMap.set(index, controls);
  }

  updateVehiclesMap(index: number) {
    const controls = ((this.perfilRef.at(index).get('informacion')?.get('pertenencias') as FormArray).controls) || []
    this.vehiclesMap.set(index, controls)
  }

  estadosMexico: Estado[] = estados
  municipios: any = estadosMunicipios
  estadosElegido: string | null = ''
  cartelElegidos: string[] = []
  autoridadesDisponibles: string[] = []
  SearchOrganization$ = new BehaviorSubject('')
  gruposDisponibles = []

  anotherControlOrganization = this.fb.array<string>([], Validators.minLength(1)) as FormArray;

  get obtenerCartel(): string[] {
    const arrTheSelect = this.thirdFichasDataForm.get('involucrados')?.get('cartel')?.value || []
    const arrTheShip = [...this.cartelsArray.keys()]
 
    let arr = [...new Set([...arrTheSelect, ...arrTheShip])];

    arr = arr.filter(value => value !== 'Otro');
    return arr || []
  }

  get cartelTieneOtro(): boolean {
    const value = this.thirdFichasDataForm.get('involucrados.cartel')?.value as string[] | null;
    return !!value?.includes('Otro');
  }

  get autoridadesTieneOtro(): boolean {
    const value = this.thirdFichasDataForm.get('involucrados.autoridades')?.value as string[] | null;
    return !!value?.includes('Otro')
  }

  public fuentesRef = this.fifthFichasDataForm.get('fuentes') as FormArray;
  
  public addFuentes() {
    const fuentes = this.fb.group({
      type: ['Enlace/URL', Validators.required],
      URL: ['', Validators.required],
      title: ['', Validators.required],
      autor: ['', Validators.required],
      fecha: ['', Validators.required],
    })

    this.fuentesRef.push(fuentes)
  }

  public removeFuente() {
    this.fuentesRef.removeAt(this.fuentesRef.length - 1)
  }

  public editFuente(index: number, newValue: string) {
    const refControl = this.fuentesRef.at(index) as FormGroup;
    console.log(newValue);

    if (newValue != 'Enlace/URL') {
      refControl.removeControl('URL'); 
      return
    } 

    if (!refControl.contains('URL')) {
      refControl.addControl('URL', this.fb.control('', [Validators.required]));
    }
    console.log(refControl);
  }

  ngOnInit() {
    this.thirdFichasDataForm.get('involucrados')?.get('cartel')?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe( value => {
      if (value === 'Otro') {
        this.anotherControlOrganization.setValidators([Validators.required])
      } else {
        this.anotherControlOrganization.clearValidators()
        this.anotherControlOrganization.setValue([])
      }

      this.anotherControlOrganization.updateValueAndValidity()
    })

    this.secondFichasDataForm.get('locationOfTheEvents')?.get('estado')?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe( value => {
      this.estadosElegido = value
    })
  }

  private sanitizeData(data: any, formData: FormData): any {
    if (data instanceof File) {
      const key = crypto.randomUUID()
      formData.append(key, data);
      return key
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item, formData));
    }

    if (typeof data === "object" && data != null) {
      return Object.keys(data).reduce((acc, key) => {
        acc[key] = this.sanitizeData(data[key], formData);
        return acc;
      }, {} as any);
    }

    if (typeof data === "string") {
      const dataClean =  data.trim()
      return (dataClean.charAt(0).toUpperCase() + dataClean.slice(1) )
    }

    return data 
  }
  
  private removeEmptyFields<T>(data: T): T {
    if (data instanceof File) return data
    
    if (Array.isArray(data)) {
      const filtered = data
        .map((item) => this.removeEmptyFields(item))
        .filter(item => item != null || item != undefined || item != '')

      return filtered as any;
    }

    if (typeof data === "object" && data !== null) {
      return Object.keys(data).reduce((acc, key) => {
        const value = this.removeEmptyFields((data as any)[key])

        const isEmpty = value == "" || value == null || 
          (Array.isArray(value) && value.length == 0)  ||
          (typeof value === "object" && Object.keys(value).length == 0)

        if (!isEmpty) {
          acc[key] = value
        }

        return acc
      }, {} as any);
    }

    return data
  }

  savedata() {
    const formData = new FormData();
    const cartelValue = this.thirdFichasDataForm.get('involucrados')?.get('cartel')?.value;
    const refArrValueCartel: string[] = Array.isArray(cartelValue) ? cartelValue : [];

    if (refArrValueCartel.includes('Otro')) {
      const index = refArrValueCartel.indexOf('Otro')
      refArrValueCartel.splice(index, 1)

      if (!this.anotherControlOrganization.length) {
        this.__snackBar.openSnarkBar("Debes completar la sección de involucrados")
        return
      }
      
      refArrValueCartel.push(...this.cartelsArray.keys())
    }

    const forms = [
      this.firstFichasDataForm,
      this.secondFichasDataForm,
      this.thirdFichasDataForm,
      this.fourthFichasDataForm,
      this.fifthFichasDataForm
    ]

    if (forms.some((form) => form.invalid)) {
      this.__snackBar.openSnarkBar("El formulario está incompleto, favor de rellenarlo");
      return
    }

    const res = forms.reduce((acc, form) => ({...acc, ...form.value}), {});
    const cleanedRes  = this.removeEmptyFields(res)
    const sanitizeRes = this.sanitizeData(cleanedRes, formData);
    formData.append('data', JSON.stringify(sanitizeRes))

    this.fichasServiceService.sentDataFichas(formData).subscribe({
      next: (res: any) => {
        console.log(res)
      },
      error: (err) => {
        console.log(err)
      }
    });
  }
}
