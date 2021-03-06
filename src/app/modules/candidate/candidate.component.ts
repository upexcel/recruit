import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImapMailsService } from '../../service/imapemails.service';
import { LocalStorageService } from '../../service/local-storage.service';
import { LoginService } from '../../service/login.service';
import { NgForm } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { config } from './../../config/config';

@Component({
    selector: 'app-candidate',
    templateUrl: './candidate.component.html',
    styleUrls: ['./candidate.component.scss']
})
export class CandidateComponent implements OnInit {
    questions: any;
    options: any;
    job_pro: any[];
    candidateName: any;
    selectedJob: any;
    img: any;
    constructor(private _localStorageService: LocalStorageService, private getTags: ImapMailsService, private access: LoginService, private _router: Router) {
        this.candidateName = localStorage.getItem('user');
        this.img = localStorage.getItem('img');
    }
    // statusChangeCallback(response: any) {
    //     if (response.status === 'connected') {
    //     } else {
    //     }
    // }
    ngOnInit() {
    }

    fblogout() {
        localStorage.clear();
        this._router.navigate(['/emailtestlogin']);
    }

}
