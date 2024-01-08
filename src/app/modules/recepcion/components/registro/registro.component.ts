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
  imageUrl =
    "https://images.vexels.com/media/users/3/137047/isolated/preview/5831a17a290077c646a48c4db78a81bb-icono-de-perfil-de-usuario-azul.png"; // URL de la imagen por defecto

  @ViewChild("videoElement") videoElement: ElementRef<HTMLVideoElement>;
  @ViewChild("defaultImage") defaultImage!: ElementRef<HTMLImageElement>;

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
      tiene_huella:[1, Validators.required],
      fotoUrl:['', Validators.required],
      Gimnasio_idGimnasio:[this.auth.getIdGym()],
      Membresia_idMem:['', Validators.required]
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


 

  registrar(): any {
    //console.log("Me presionaste");
    //console.log(this.form.value.email);
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
            .agregarCliente(this.form.value)
            .subscribe((respuesta) => {
              this.dialog
                .open(MensajeEmergentesComponent, {
                  data: `Usuario registrado exitosamente`,
                })
                .afterClosed()
                .subscribe((cerrarDialogo: Boolean) => {
                  if (cerrarDialogo) {
                    this.router.navigateByUrl(
                      `/recepcion/home`
                    );
                  } else {
                  }
                });
            });
        }
      });
    } else {
      // El formulario no es válido, muestra un mensaje de error
      this.message = "Por favor, complete todos los campos requeridos.";
    }
  }

/*  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (this.defaultImage) {
          this.defaultImage.nativeElement.src = e.target?.result as string; // Actualiza la imagen con la seleccionada
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  }*/

  /*onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];
      // Puedes asignar el archivo a un campo del formulario
      this.form.patchValue({
        fotourl: file // Asignar el archivo al campo 'fotourl'
      });

      // Si necesitas subir la imagen a tu servidor, puedes hacerlo aquí
      // Utiliza el servicio HttpClient para realizar la solicitud al servidor
    }
  }*/

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
}
