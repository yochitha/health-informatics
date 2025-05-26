import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { FirebaseService } from '../../services/firebase.service';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from '../../services/notification.service';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private firebaseService: FirebaseService,
        private notificationService: NotificationService
    ) { }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/medication';
    }

    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.firebaseService.getPatients(this.loginForm.value.username, this.loginForm.value.password).subscribe(user => {
            if (user != null) {
                localStorage.setItem('patientId', user.patientId);
                this.router.navigate([this.returnUrl]);
            }
            else {
                this.notificationService.error('', "Username or Password is wrong.");
            }
            this.loading = false;
        });
    }
}
