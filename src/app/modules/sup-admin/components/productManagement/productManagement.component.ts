
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'product-management',
  templateUrl: './productManagement.component.html',
  styleUrls: ['./productManagement.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductManagementComponent { }
