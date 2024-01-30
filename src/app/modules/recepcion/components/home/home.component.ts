import { Component, OnInit, ViewChild } from "@angular/core";
import { VentasComponent } from "../ventas/home.component";
import { MatDialog } from "@angular/material/dialog";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
  ) {
  }
  ngOnInit(): void { 
  }
  ventas(): void {
    const dialogRef = this.dialog.open(VentasComponent, {
      width: '60%',
      height: '90%',
      
    });
  }
}
