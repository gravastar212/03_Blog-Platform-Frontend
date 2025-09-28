import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {

}
