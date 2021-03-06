import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { LoginService } from '../../service/login.service';
import { Router, NavigationStart } from '@angular/router';
import { ImapMailsService } from '../../service/imapemails.service';
import { LocalStorageService } from './../../service/local-storage.service';
import { config } from './../../config/config';
import { DialogService } from './../../service/dialog.service';
@Component({
    selector: 'app-core',
    templateUrl: './core.component.html',
    styleUrls: ['./core.component.scss']
})
export class CoreComponent implements OnInit {
    title = 'Inbox';
    progressSpinnner = false;
    role: string;
    @Output() routerInboxPage: EventEmitter<any> = new EventEmitter(true);
    constructor(private _router: Router, public getNewEmail: ImapMailsService, private access: LoginService, private _localStorageService: LocalStorageService, private _dialogService: DialogService) {
        this._router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                if (event['url']) {
                    this.title = config['titles'][event['url'].substr(0, 13)];
                } else {
                    this.title = config['titles'][event['snapshot']['_routerState']['url'].substr(0, 13)];
                }
                if (event['url'] === '/core/inbox') {
                    this.routerInboxPage.emit();
                }
            }
        });
        this.role = this._localStorageService.getItem('role');
    }

    ngOnInit(): void {
        this.access.verifyAccess().subscribe((data) => {
            if (!data.status) {
                // this.logout();
            }
        }, (err) => {
            if (!err.status) {
                // this.logout();
            }
        });

        this.getNewEmail.apiStartEvent.subscribe(() => {
            this.progressSpinnner = true;
        });
        this.getNewEmail.apiEndEvent.subscribe(() => {
            this.progressSpinnner = false;
        });
        // setInterval(() => {
        //     this.emailRefresh();
        // }, config['fetchMailInterval']);
    }

    emailRefresh() {
        this.getNewEmail.fetchNewEmail();
    }

    goto(path: string, navtitle: string) {
        this.title = navtitle;
        this._router.navigate(['/core/' + path]);
    }

    fetchEmailByDay() {
        this._dialogService.fetchEmailByDay();
    }

    logout() {
        console.log('log out')
        this.access.removeToken().then((data) => {
            if (data) {
                this._router.navigate(['/login']);
            }
        });
    }
}
