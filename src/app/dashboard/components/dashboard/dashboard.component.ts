import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgxUiLoaderModule, CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  /**
   * Component constructor which is used to inject the required services.
   */
  constructor() { }
  /**
   * Angular Life cycle hooks that initiate component
   */
  ngOnInit(): void {
    
  }

}