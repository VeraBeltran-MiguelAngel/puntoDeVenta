import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  constructor() {}

  public idGym!: string;
  public nameGym!: string;
  //public tituloMembresia!: string;

  public status: boolean = false;
}
