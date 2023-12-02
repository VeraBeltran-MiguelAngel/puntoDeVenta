import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  constructor() {
  }
  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  sendData(data: any) {
    this.dataSubject.next(data);
  }

}
