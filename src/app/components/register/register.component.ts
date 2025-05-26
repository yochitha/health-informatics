import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { FhirService } from '../../services/fhir.service';
import { FirebaseService } from '../../services/firebase.service';
import { NotificationService } from '../../services/notification.service';

//import { AlertService, UserService, AuthenticationService } from '../_services';

@Component({ templateUrl: 'register.component.html', styleUrls: ['register.component.css'] })
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private fhirService: FhirService,
    private firebaseService: FirebaseService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.fhirService.getPatientsByNames(this.registerForm.value.firstName, this.registerForm.value.lastName).subscribe(
        data => {
          if (data['total'] > 0) {
            let userData = {
              "patientId": "Patient/" + data['entry'][0].resource.id,
              "firstName": this.registerForm.value.firstName,
              "lastName" : this.registerForm.value.lastName,
              "userName" : this.registerForm.value.username,
              "password" : this.registerForm.value.password
            };
            this.firebaseService.patientRegistration(userData).subscribe(res => {
              console.log(res);
              this.router.navigate(['/login']);
            });
          }
          else {
            this.notificationService.error('', "Patient details does not exist.");
          }
          this.loading = false;
        },
        error => {
          this.loading = false;
        });
  }
}
