import { Component, OnInit } from '@angular/core';
import { AuthSevice } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
    
    constructor(private authService: AuthSevice) {}
  
    ngOnInit() {
      this.authService.autoLogin();
    }
}
