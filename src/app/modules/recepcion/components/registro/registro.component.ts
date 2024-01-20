import { Component, ElementRef, ViewChild, OnInit} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormGroup,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ClienteService } from "src/app/service/cliente.service";
import { MatDialog } from "@angular/material/dialog";
import { MensajeEmergentesComponent } from "src/app/modules/admin/components/mensaje-emergentes/mensaje-emergentes.component";
import { ErrorStateMatcher } from "@angular/material/core";
import { ToastrService } from "ngx-toastr";
import { TestService } from "src/app/service/test.service";
import { PlanService } from "src/app/service/plan.service";
import { AuthService } from "src/app/service/auth.service";
import { autoTable } from "jspdf-autotable";
import { plan } from "src/app/modules/admin/components/models/plan";
import { RegistroService } from "src/app/service/registro.service";
import { Subject, Observable } from 'rxjs';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-registro",
  templateUrl: "./registro.component.html",
  styleUrl: "./registro.component.css",
})

export class RegistroComponent implements OnInit {
  //imageUrl: string | ArrayBuffer | null = null;

  foods: Food[] = [
    { value: "Aguascalientes", viewValue: "Aguascalientes" },
    { value: "Baja California", viewValue: "Baja California" },
    { value: "Baja California Sur", viewValue: "Baja California Sur" },
    { value: "Campeche", viewValue: "Campeche" },
    { value: "Chiapas", viewValue: "Chiapas" },
    { value: "Chihuahua", viewValue: "Chihuahua" },
    { value: "Coahuila", viewValue: "Coahuila" },
    { value: "Colima", viewValue: "Colima" },
    { value: "Ciudad de México", viewValue: "CDMX" },
    { value: "Durango", viewValue: "Durango" },
    { value: "Guanajuato", viewValue: "Guanajuato" },
    { value: "Guerrero", viewValue: "Guerrero" },
    { value: "Hidalgo", viewValue: "Hidalgo" },
    { value: "Jalisco", viewValue: "Jalisco" },
    { value: "México", viewValue: "México" },
    { value: "Michoacán", viewValue: "Michoacán" },
    { value: "Morelos", viewValue: "Morelos" },
    { value: "Nayarit", viewValue: "Nayarit" },
    { value: "Nuevo León", viewValue: "Nuevo León" },
    { value: "Oaxaca", viewValue: "Oaxaca" },
    { value: "Puebla", viewValue: "Puebla" },
    { value: "Querétaro", viewValue: "Querétaro" },
    { value: "San Luis Potosi", viewValue: "San Luis Potosi" },
    { value: "Sinaloa", viewValue: "Sinaloa" },
    { value: "Sonora", viewValue: "Sonora" },
    { value: "Tabasco", viewValue: "Tabasco" },
    { value: "Tamaulipas", viewValue: "Tamaulipas" },
    { value: "Tlaxcala", viewValue: "Tlaxcala" },
    { value: "Veracruz", viewValue: "Veracruz" },
    { value: "Yucatán", viewValue: "Yucatán" },
    { value: "Zacatecas", viewValue: "Zacatecas" },
  ];
  hide = true;
  responseData: any = {};
  correo: any;
  idClient : any;
  form: FormGroup;
  message: string = "";
  idMembresia: any;
  nameMembresia: any;
  precioId: any;
  email: any;
  videoStream: MediaStream | null = null;
  canvas: HTMLCanvasElement | null = null;
  cameraOn: boolean = false;
  isCameraOn = false;
  planes: any;
  ver: string = '';
  actualizar_imagen: string = '';
  photoSelected: string | ArrayBuffer | null;
  public errors: WebcamInitError[] = [];
  imageUrl =
    "https://images.vexels.com/media/users/3/137047/isolated/preview/5831a17a290077c646a48c4db78a81bb-icono-de-perfil-de-usuario-azul.png"; // URL de la imagen por defecto

  @ViewChild("videoElement") videoElement: ElementRef<HTMLVideoElement>;
  @ViewChild("defaultImage") defaultImage!: ElementRef<HTMLImageElement>;
  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  public deviceId: string;

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    // Almacenar la imagen en el objeto Archivo
    this.archivo.base64textString = this.webcamImage.imageAsBase64;
    // Agregar el nombre al archivo - como tal la foto tomada no tiene nombre - por lo que se le asigna uno
    const timestamp = new Date().getTime();
    this.archivo.nombreArchivo = `imagen_${timestamp}.png`;
  
    // Asignar la URL de la imagen tomada a photoSelected
    this.photoSelected = this.webcamImage.imageAsDataUrl;
   
  }
  



  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };

  constructor(
    public fb: FormBuilder,
    private clienteService: ClienteService,
    public testService: TestService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private planService: PlanService,
    private auth: AuthService,


  ) {
    this.idMembresia = this.activeRoute.snapshot.paramMap.get("id");
    this.nameMembresia = this.activeRoute.snapshot.paramMap.get("idName");
    this.precioId = this.activeRoute.snapshot.paramMap.get("idPrecio");

    this.form = this.fb.group({
      nombre: ['', Validators.compose([ Validators.required, Validators.pattern(/^[A-Za-zñÑáéíóú ]*[A-Za-z][A-Za-zñÑáéíóú ]*$/)])],
      apPaterno: ['', Validators.compose([ Validators.required, Validators.pattern(/^[A-Za-zñÑáéíóú ]*[A-Za-z][A-Za-zñÑáéíóú ]*$/)])],
      apMaterno: ['', Validators.compose([ Validators.required, Validators.pattern(/^[A-Za-zñÑáéíóú ]*[A-Za-z][A-Za-zñÑáéíóú ]*$/)])],
      telefono: ['', Validators.compose([Validators.required, Validators.pattern(/^(0|[1-9][0-9]*)$/)])],
      codigoPostal: ['', Validators.compose([Validators.pattern(/^(0|[1-9][0-9]*)$/), Validators.minLength(5)])],
      ciudad: ['', Validators.compose([Validators.pattern(/^[A-Za-zñÑáéíóú ]*[A-Za-z][A-Za-zñÑáéíóú ]*$/)])],
      colonia: ['', Validators.compose([Validators.pattern(/^[A-Za-zñÑáéíóú ]*[A-Za-z][A-Za-zñÑáéíóú ]*$/)])],
      calle: ['', Validators.compose([Validators.pattern(/^[A-Za-zñÑáéíóú0-9 ]*[A-Za-z][A-Za-zñÑáéíóú0-9 ]*$/)])],
      numInter: ['', Validators.compose([Validators.pattern(/^(0|[1-9][0-9]*)$/)])],
      numExterno: ['', Validators.compose([Validators.pattern(/^(0|[1-9][0-9]*)$/)])],
      estado: [''],
      //direccion: ['', Validators.compose([ Validators.required, Validators.pattern(/^[A-Za-zñÑáéíóú0-9 ./#]*[A-Za-z][A-Za-zñÑáéíóú0-9 ./#]*$/)])],
      fechaNacimiento: ['', Validators.required],
      curp: ['', Validators.compose([ Validators.minLength(18), Validators.pattern(/^[A-ZÑ0-9]*[A-Z][A-ZÑ0-9]*$/)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)])],  
      pass: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      tiene_huella:[''],
      fotoUrl:['', Validators.required],
      peso:['', Validators.compose([Validators.pattern(/^(0|[1-9][0-9]*)$/), Validators.max(300)])],
      estatura:['', Validators.compose([Validators.pattern(/^(0|[1-9][0-9]*)$/), Validators.max(250)])],
      Gimnasio_idGimnasio:[this.auth.getIdGym()],
      Membresia_idMem:['', Validators.required],
      nombreArchivo: [''],
      base64textString: [''],
    })
  }

  ngOnInit(): void {
    this.planService.consultarPlanId(this.auth.getIdGym()).subscribe((respuesta: plan[]) => {
      this.planes = respuesta;
    });

    this.planService.consultarPlanId(this.auth.getIdGym()).subscribe((respuesta) => {
      if (Array.isArray(respuesta)) {
        this.planes = respuesta.map((dato) => ({
          value: dato.idMem, // Valor que se enviará al seleccionar
          label: dato.titulo, // Etiqueta que se mostrará en el combo
        }));
      } else {
        console.error("La respuesta no es un arreglo.");
      }

    });
    }

  selectedFile: File | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.form.patchValue({
          fotourl: reader.result // Asignar la URL generada por FileReader al campo 'fotourl'
        });
      };
    }
  }
  



  takeSnapshot() {
    if (this.videoElement && this.defaultImage) {
      const video = this.videoElement.nativeElement;
      const image = this.defaultImage.nativeElement;

      if (video.srcObject) {
        const canvas = this.getCanvas(video.videoWidth, video.videoHeight);

        if (canvas) {
          const context = canvas.getContext("2d");
          if (context) {
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            this.imageUrl = canvas.toDataURL("image/png"); // Actualiza la imagen con la captura

            // Oculta el video y muestra la imagen capturada
            video.style.display = "none";
            image.style.display = "block";
          }
        }
      }
    }
  }

  getCanvas(width: number, height: number): HTMLCanvasElement | null {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    this.canvas = canvas;
    return canvas;
  }

 
  toggleCamera() {
    this.isCameraOn = !this.isCameraOn;

    if (this.isCameraOn) {
      this.startCamera();
    } else {
      this.stopCamera();
    }
  }

  startCamera() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (this.videoElement) {
          this.videoElement.nativeElement.srcObject = stream;
          this.videoElement.nativeElement.style.display = "block";
        }
        if (this.defaultImage) {
          this.defaultImage.nativeElement.style.display = "none";
        }
      })
      .catch((error) => {
        console.error("Error al acceder a la cámara:", error);
      });
  }
  
  archivo = {
    id: 0,
    nombreArchivo: '',
    base64textString: ''
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }
  public triggerSnapshot(): void {
    this.trigger.next();

    // Ocultar la camaraweb despues de tomar la foto
    this.toggleWebcam();
  }
  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }
  public webcamImage: WebcamImage | null;
  public allowCameraSwitch = true;
  not_format: boolean = false;
  not_size: boolean = false;
  public showWebcam = false;

  resetWebcamImage(): void {
    this.webcamImage = null;
    this.archivo.base64textString = '';
    this.archivo.nombreArchivo = '';
  }
  file: File;
  stopCamera() {
    if (this.videoElement) {
      const stream = this.videoElement.nativeElement.srcObject as MediaStream;
      const tracks = stream.getTracks();

      tracks.forEach((track) => track.stop());
      this.videoElement.nativeElement.srcObject = null;
      this.videoElement.nativeElement.style.display = "none";
    }
    if (this.defaultImage) {
      this.defaultImage.nativeElement.style.display = "block";
    }
  }

  show_option(option: string) {
    console.log("hola");
    this.actualizar_imagen = option;
    if (option === 'take') {
      this.showWebcam = true;
    }
  }

  onPhotoSelected(event: any): void {
    
    if (event.target.files && event.target.files[0]) {
      var files = event.target.files;
      var file = files[0];

      if (file) {
        // Validar si el archivo seleccionado es una imagen
        if (!file.type.startsWith('image/')) {
          this.not_format = true;
          console.log('Tipo de archivo no permitido. Solo se permiten imágenes.');
          this.toastr.error('El archivo seleccionado no es una imagen', 'Error');
          return;
        }
        // Validar si el archivo excede el tamaño máximo permitido de 1mb
        if (file.size > 1024 * 1024) {
          this.not_size = true;
          console.log('El archivo es demasiado grande. Máximo 1 MB permitido.');
          this.toastr.error('El tamaño de la imagen debe ser menor a 1MB', 'Error');
          return;
        }
      }

      // Almacenar el nombre del archivo/imagen en el json Archivo
      this.archivo.nombreArchivo = file.name;

      this.file = <File>event.target.files[0];
      // image preview
      const reader = new FileReader();
      reader.onload = e => this.photoSelected = reader.result;
      reader.readAsDataURL(this.file);

      if (files && file) {
        // Create a new instance of FileReader
        const newReader = new FileReader();
        newReader.onload = this._handleReaderLoaded.bind(this);
        newReader.readAsBinaryString(file);
      }
    } else {
      // Si no se selecciona ninguna imagen, mostrar la imagen por defecto y resetear valores del objeto Archivo
      this.photoSelected = null;
      this.archivo.base64textString = '';
      this.archivo.nombreArchivo = '';
      return;
    }

  }

  // Codificar la imagen a base64
  _handleReaderLoaded(readerEvent: any) {
    var binaryString = readerEvent.target.result;
    this.archivo.base64textString = btoa(binaryString);
  }


 uploadPhoto() {
  console.log("hola");
    console.log(this.archivo);
    if (this.archivo.base64textString === '' || this.archivo.nombreArchivo === '' ) {
      console.log('Selecciona una imagen antes de querer subir la imagen.');
      this.toastr.error('Aún no haz seleccionado una imagen valida...', 'Error');
      return;
    }
    console.log("hola");
    /*this.auth.send_profile_img(this.archivo).subscribe({
      next: (resultData) => { console.log(resultData); }, error: (error) => { console.log(error); }
    });*/
    
    this.form.patchValue({
      fotoUrl: this.archivo.nombreArchivo  // Asigna la imagen a fotoUrl
    });

    this.form.patchValue({
      nombreArchivo: this.archivo.nombreArchivo  // Asigna la imagen a fotoUrl
    });
    this.form.patchValue({
      base64textString: this.archivo.base64textString  // Asigna la imagen a fotoUrl
    });

  }


  registrar(): any {
    console.log(this.form.value);
    this.email = this.form.value.email;
    console.log(this.email);
    if (this.form.valid) {
      this.clienteService.consultarEmail(this.email).subscribe((resultData) => {
        console.log(resultData.msg);
        if (resultData.msg == "emailExist") {
          this.toastr.warning("El correo ingresado ya existe.", "Alerta!!!");
        }
        if (resultData.msg == "emailNotExist") {
          this.clienteService
            .guardarCliente(this.form.value)
            .subscribe((respuesta) => {

              this.dialog
                .open(MensajeEmergentesComponent, {
                data: `Usuario registrado exitosamente`,
              })
              .afterClosed()
              .subscribe((cerrarDialogo: Boolean) => {
                if (cerrarDialogo) {
                  
                  this.clienteService.consultarDataPago(this.form.value.email).subscribe(respuesta =>{
                  console.log(respuesta)
                  //this.idClient=respuesta;

                    this.responseData=respuesta;
                      this.clienteService.idPagoSucursal(this.responseData.ID_Cliente).subscribe((resultado)=> {

                        this.router.navigateByUrl(`/recepcion/home`);
                      });
                      //console.log(resultado.msg);
                  });  
                } 
              });
            
            },
            (error) => {
              // Manejar errores de solicitud HTTP
              if (error.status === 400) {
                if (error.error && error.error.msg === 'error_tipo_archivo_no_soportado') {
                  // Manejar el error específico 'error_tipo_archivo_no_soportado'
                  console.error('Error: Tipo de archivo no soportado');
                  this.toastr.error("Error: Tipo de archivo no soportado");
                } else {
                  // Otro tipo de error 400
                  console.error('Error 400: Bad Request');
                  this.toastr.error("Error: no se pudo agregar usuario. Intente de nuevo");
                }
              } else {
                // Otro tipo de error diferente a 400
                console.error('Error: Otro tipo de error');
                this.toastr.error("Error: no se pudo agregar usuario. Intente de nuevo");
              }
            }
            
            );
        }
        
      });
    } else {
      // El formulario no es válido, muestra un mensaje de error
      this.message = "Por favor, complete todos los campos requeridos.";
    }
  }

  /*registrar(): any {
    console.log(this.form.value);
    this.email = this.form.value.email;
    console.log(this.email);
  
    if (this.form.valid) {
      this.clienteService.consultarEmail(this.email).subscribe((resultData) => {
        console.log(resultData.msg);
        if (resultData.msg == "emailExist") {
          this.toastr.warning("El correo ingresado ya existe.", "Alerta!!!");
        }
        if (resultData.msg == "emailNotExist") {
          this.clienteService.guardarCliente(this.form.value).subscribe(
            (respuesta) => {
              // El registro fue exitoso
              this.dialog
                .open(MensajeEmergentesComponent, {
                  data: `Usuario registrado exitosamente`,
                })
                .afterClosed()
                .subscribe((cerrarDialogo: Boolean) => {
                  if (cerrarDialogo) {
                    this.router.navigateByUrl(`/recepcion/home`);
                  }
                });
            },
            (error) => {
              // Manejar errores de solicitud HTTP
              if (error.status === 400) {
                if (error.error && error.error.msg === 'error_tipo_archivo_no_soportado') {
                  // Manejar el error específico 'error_tipo_archivo_no_soportado'
                  console.error('Error: Tipo de archivo no soportado');
                } else {
                  // Otro tipo de error 400
                  console.error('Error 400: Bad Request');
                }
              } else {
                // Otro tipo de error diferente a 400
                console.error('Error: Otro tipo de error');
              }
            }
          );
        }
      });
    } else {
      this.message = "Por favor, complete todos los campos requeridos.";
    }
  }*/
  

}
