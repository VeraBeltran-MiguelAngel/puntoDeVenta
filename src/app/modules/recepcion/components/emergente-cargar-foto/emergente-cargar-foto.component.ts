import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { ClienteService } from 'src/app/service/cliente.service';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-emergente-cargar-foto',
  templateUrl: './emergente-cargar-foto.component.html',
  styleUrl: './emergente-cargar-foto.component.css'
})
export class EmergenteCargarFotoComponent implements OnInit{
  public showWebcam = false;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  // Mostrar opciones de menu tomar/subir imagen/foto
  actualizar_imagen: string = '';
  //Manejar el archivo/imagen cargado
  photoSelected: string | ArrayBuffer | null;
  file: File;
  mostrarInfo: string = ''; // Variable para rastrear qué información mostrar
  // latest snapshot
  public webcamImage: WebcamImage | null;
  public errors: WebcamInitError[] = [];
  // Manejar el envio del objeto que contiene la imagen
  archivo = {
    id: 0,
    nombreArchivo: '',
    base64textString: ''
  }
  // toggle webcam on/off
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  // Manejar los tipos de errores al manejar la carga de la imagen
  not_format: boolean = false;
  not_size: boolean = false;
  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    // Almacenar la imagen en el objeto Archivo
    this.archivo.base64textString = this.webcamImage.imageAsBase64;
    // Agregar el nombre al archivo - como tal la foto tomada no tiene nombre - por lo que se le asigna uno
    const timestamp = new Date().getTime();
    this.archivo.nombreArchivo = `imagen_${timestamp}.png`;
  }
  public triggerSnapshot(): void {
    this.trigger.next();

    // Ocultar la camaraweb despues de tomar la foto
    this.toggleWebcam();
  }
  resetWebcamImage(): void {
    this.webcamImage = null;
    this.archivo.base64textString = '';
    this.archivo.nombreArchivo = '';
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }
  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }
  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }
  //para poder usar los valores del local(solo es un string) storage tienes que crear un arreglo
   usuarioRegistrado: any[] = [];   //se va a eliminar
  constructor( private toastr: ToastrService, private ServiceCliente: ClienteService,
    public dialogo: MatDialogRef<EmergenteCargarFotoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    cerrarDialogo(): void {
      this.dialogo.close(true);
    }
    /*confirmado(): void {
      this.dialogo.close(true);
    }*/

  ngOnInit() {
    // Asignar el id del usuario 
    //this.archivo.id = this.usuarioRegistrado[0].ID_Cliente;
    this.archivo.id = this.data.clienteID;
  }

  // Mostar contenedor - opciones de menu
  show_option(option: string) {
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

  // Subir la imagen al servidor
  uploadPhoto() {
    console.log(this.archivo);
    if (this.archivo.base64textString === '' || this.archivo.nombreArchivo === '' || this.archivo.id === 0) {
      console.log('Selecciona una imagen antes de querer subir la imagen.');
      this.toastr.error('Aún no haz seleccionado una imagen valida...', 'Error');
      return;
    }
    
    this.ServiceCliente.updatePhoto(this.archivo).subscribe({
      next: (resultData) => { console.log(resultData); }, error: (error) => { console.log(error); }
    });
    this.toastr.success('Se guardo la foto exitosamente...', 'Éxito');
    this.dialogo.close(true);
    
  }

  mostrarInformacion(boton: string): void {
    this.mostrarInfo = boton;
  }

}
