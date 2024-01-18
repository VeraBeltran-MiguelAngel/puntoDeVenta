import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api'; /**siempre debes importarlo */
import { ToastrService } from 'ngx-toastr';
import { CategoriaService } from 'src/app/service/categoria.service';
import { UploadService } from 'src/app/service/upload.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/service/auth.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    formulario: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = formulario && formulario.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'crear-producto',
  templateUrl: './crearProducto.component.html',
  styleUrls: ['./crearProducto.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe, MessageService],
})
export class CrearProductoComponent implements OnInit {
  fechaCreacion: string;
  form: FormGroup;
  matcher = new MyErrorStateMatcher();
  idCategoria: number;
  listaCategorias: any;
  uploadedFiles: File[] = [];

  constructor(
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private auth: AuthService,
    private uploadService: UploadService,
    private httpClient: HttpClient
  ) {
    this.fechaCreacion = this.obtenerFechaActual();
    // formulario
    this.form = this.fb.group({
      nombre: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[^\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/u),
        ]),
      ],
      descripcion: ['', Validators.required],
      idCategoria: ['', Validators.compose([Validators.required])],
      precioVenta: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^\d+(\.\d{0,2})?$/), //solo acepta dos decimales
        ]),
      ],
      precioCompra: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^\d+(\.\d{0,2})?$/), //solo acepta dos decimales
        ]),
      ],

      descuento: ['', Validators.required],
      porcentaje: [
        0,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]+$/), //solo numeros enteros
        ]),
      ],
      fechaCreacion: [this.fechaCreacion],
      codigoBarra: [''],
      unidadMedicion: ['NA', Validators.compose([Validators.required])],
      cantidadUnidades: [
        0,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]+$/), //solo numeros enteros
        ]),
      ],
      talla: ['NA', Validators.compose([Validators.required])],
      color: [
        'NA',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[^\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/u), //solo letras
        ]),
      ],
      longitud: ['NA'],
      sabor: [
        'NA',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[^\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/u),
        ]),
      ],
      genero: ['NA', Validators.compose([Validators.required])],
      marca: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[^\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+$/u),
        ]),
      ],
      files: [[]], // Inicializa el control de archivos como un array vacío
    });
  }

  ngOnInit(): void {

    this.categoriaService.consultarListaCategoria(this.auth.getIdGym()).subscribe({
      next: (respuesta) => {
        this.listaCategorias = respuesta;
        console.log('lista de categorias:', this.listaCategorias);
      },
      error: (error) => {
        console.error(error);
      },
    });

    /*this.categoriaService.obternerCategoria().subscribe({
      next: (respuesta) => {
        this.listaCategorias = respuesta;
        console.log('lista de categorias:', this.listaCategorias);
      },
      error: (error) => {
        console.error(error);
      },
    });*/
  }

  obtenerFechaActual(): string {
    const fechaActual = new Date();
    return this.datePipe.transform(fechaActual, 'yyyy-MM-dd HH:mm:ss') || '';
  }

  /**
   * Metodo que se invoca cada que selecionas una opcion del select
   * @param event
   */
  infoCategoria(event: number) {
    console.log('Opción seleccionada:', event);
    this.idCategoria = event;
    console.log('valor idCategoria:', this.idCategoria);
  }

  onFileSelect(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    // event.files contiene la lista de archivos seleccionados
    const selectedFiles = event.files;

    // Obtén el valor actual del control 'files' en el formulario
    const currentFiles = this.form.get('files')?.value || [];

    // Agrega los nuevos archivos al valor actual
    const updatedFiles = [...currentFiles, ...selectedFiles];

    // Actualiza el valor del control 'files' en el formulario con la nueva lista de archivos
    this.form.patchValue({ files: updatedFiles });
  }
  registrar(): any {
    // const formData = new FormData();

    // for (const file of this.uploadedFiles) {
    //   formData.append('files[]', file, file.name);
    // }

    // this.httpClient
    //   .post(
    //     'http://localhost/uploadFiles/creaProductoV2.php?creaProducto',
    //     formData
    //   )
    //   .subscribe({
    //     next: (response) => {
    //       console.log('Respuesta del servidor:', response);
    //       // Puedes manejar la respuesta del servidor según tus necesidades
    //     },
    //     error: (error) => {
    //       console.error('Error al enviar archivos al servidor:', error);
    //     },
    //   });

    if (this.form.valid) {
      console.log('Formulario:', this.form.value);
      this.uploadService
        .creaProducto(this.form.value)
        .subscribe({
          next: (respuesta) => {
            console.log(respuesta);

            if (respuesta.success) {
              this.toastr.success(respuesta.message, 'Exito', {
                positionClass: 'toast-bottom-left',
              });
            } else {
              this.toastr.error(respuesta.message, 'Error', {
                positionClass: 'toast-bottom-left',
              });
            }
          },
          error: (paramError) => {
            console.error(paramError); // Muestra el error del api en la consola para diagnóstico
            //accedemos al atributo error y al key
            this.toastr.error(paramError.error.message, 'Error', {
              positionClass: 'toast-bottom-left',
            });
          },
        });

        this.uploadService
        .subirImagenes(this.uploadedFiles)
        .subscribe({
          next: (respuesta) => {
            console.log(respuesta);

            if (respuesta.success) {
              this.toastr.success(respuesta.message, 'Exito', {
                positionClass: 'toast-bottom-left',
              });
            } else {
              this.toastr.error(respuesta.message, 'Error', {
                positionClass: 'toast-bottom-left',
              });
            }
          },
          error: (paramError) => {
            console.error(paramError); // Muestra el error del api en la consola para diagnóstico
            //accedemos al atributo error y al key
            this.toastr.error(paramError.error.message, 'Error', {
              positionClass: 'toast-bottom-left',
            });
          },
        });



    } else {
      this.toastr.error('Completa el formulario', 'Error', {
        positionClass: 'toast-bottom-left',
      });
    }
  }
}
