import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Empleado } from '../models/empleado';
import { Producto } from '../models/producto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  // displayedColumns: string[] = [
  //   'id',
  //   'firstname',
  //   'lastname',
  //   'email',
  //   'gender',
  //   'jobtitle',
  //   'department',
  // ];
  EmpData: Empleado[] = [
    {
      id: 1,
      firstname: 'Mellie',
      lastname: 'Gabbott',
      email: 'mgabbott0@indiatimes.com',
      gender: 'Female',
      department: 'Support',
      jobtitle: 'Support Analyst',
    },
    {
      id: 2,
      firstname: 'Yehudi',
      lastname: 'Ainsby',
      email: 'yainsby1@w3.org',
      gender: 'Female',
      department: 'Support',
      jobtitle: 'Support Analyst',
    },
    {
      id: 3,
      firstname: 'Noellyn',
      lastname: 'Primett',
      email: 'nprimett2@ning.com',
      gender: 'Female',
      department: 'Human Resources',
      jobtitle: 'Project Manager',
    },
    {
      id: 4,
      firstname: 'Stefanie',
      lastname: 'Yurenin',
      email: 'syurenin3@boston.com',
      gender: 'Female',
      department: 'Marketing',
      jobtitle: 'Senior officer',
    },
    {
      id: 5,
      firstname: 'Stormi',
      lastname: "O'Lunny",
      email: 'solunny4@patch.com',
      gender: 'Female',
      department: 'Engineering',
      jobtitle: 'Software Engineer',
    },
    {
      id: 6,
      firstname: 'Keelia',
      lastname: 'Giraudy',
      email: 'kgiraudy5@nba.com',
      gender: 'Male',
      department: 'Marketing',
      jobtitle: 'Senior officer',
    },
    {
      id: 7,
      firstname: 'Ikey',
      lastname: 'Laight',
      email: 'ilaight6@wiley.com',
      gender: 'Male',
      department: 'Support',
      jobtitle: 'Support Analyst',
    },
    {
      id: 8,
      firstname: 'Adrianna',
      lastname: 'Ruddom',
      email: 'aruddom7@seattletimes.com',
      gender: 'Male',
      department: 'Marketing',
      jobtitle: 'Senior officer',
    },
    {
      id: 9,
      firstname: 'Dionysus',
      lastname: 'McCory',
      email: 'dmccory8@ox.ac.uk',
      gender: 'Male',
      department: 'Engineering',
      jobtitle: 'Software Engineer',
    },
    {
      id: 10,
      firstname: 'Claybourne',
      lastname: 'Shellard',
      email: 'cshellard9@rediff.com',
      gender: 'Male',
      department: 'Engineering',
      jobtitle: 'Software Engineer',
    },
  ];

  displayedColumns: string[] = [
    'id',
    'categoria',
    'nombre',
    'tamaño',
    'descripcion',
    'precio',
    'acciones'
  ];
  productData: Producto[]=[
    {
      id: 1,
      categoria: 'Bebidas',
      nombre:'Agua ciel',
      tamaño: '500 ml',
      descripcion: 'agua simple',
      precio: 9,
    },
    {
      id: 2,
      categoria: 'Bebidas',
      nombre:'Agua bonafont',
      tamaño: '250 ml',
      descripcion: 'agua simple',
      precio: 5,
    },
    {
      id: 3,
      categoria: 'Bebidas',
      nombre:'Gatorade',
      tamaño: '500 ml',
      descripcion: 'bebida deportiva',
      precio: 20,
    },
    {
      id: 4,
      categoria: 'Suplementos',
      nombre:'Proteina marca tal',
      tamaño: '500 gr',
      descripcion: '30 scopes',
      precio: 250,
    },
    {
      id: 5,
      categoria: 'Suplementos',
      nombre:'Creatina marca tal',
      tamaño: '500 gr',
      descripcion: '30 scopes',
      precio: 200,
    }
    
  ];
  dataSource = new MatTableDataSource(this.productData);

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
