import { Component, OnInit, NgZone } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { LoginService } from '../../service/login.service';
import { Router } from '@angular/router';

import * as _ from 'lodash';

@Component({
    selector: 'app-otp-dialog',
    templateUrl: './otpdialog.component.html',
    styleUrls: ['./otpdialog.component.scss'],
})
export class OtpdialogComponent implements OnInit {
    fb_id: any;
    otp: any;
    error= false;
    errorMsg: any;

    constructor(private access: LoginService, private _router: Router, public zone: NgZone, public dialogRef: MdDialogRef<any>) {
    }
    ngOnInit() {
    }
    submitOtp() {
        this.access.fbOtp_login({'fb_id': this.fb_id, 'examToken': this.otp}).subscribe(response => {
            if (response.status === 1) {
                this.dialogRef.close();
                this.zone.run(() => {
                    localStorage.setItem('role', JSON.stringify('Candidate'));
                    localStorage.setItem('user', response.data.name);
                    localStorage.setItem('user_id', response.data.fb_id);
                    localStorage.setItem('img', response.data.profile_pic);
                    this._router.navigate(['/candidate/interviewques', this.fb_id]);
                });
            } else if (response.status === 2) {
                // this.dialogRef.close();
                this.zone.run(() => {
                    // this._router.navigate(['/candidate/verifycandidate']);
                });
            }
        }, err => {
            this.errorMsg = err.message;
            this.error = true;
        })
    }
}