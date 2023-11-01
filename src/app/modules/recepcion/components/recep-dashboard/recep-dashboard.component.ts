import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-recep-dashboard',
  templateUrl: './recep-dashboard.component.html',
  styleUrls: ['./recep-dashboard.component.css']
})
export class RecepDashboardComponent {

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // let rol= this.auth.getRol();
 
    // if (rol !== 'Recepcionista'){
    //  this.router.navigate(['']);
    // }
   }
}
