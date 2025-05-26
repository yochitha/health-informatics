import { Component } from '@angular/core';
import { FirebaseService } from './services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ihi-project';
  currentUser: any;

  constructor(private firebaseService: FirebaseService, private router: Router) {
    this.firebaseService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {

  }

  logout() {
    this.firebaseService.logout();
    this.router.navigate(['/login']);
  }
}
