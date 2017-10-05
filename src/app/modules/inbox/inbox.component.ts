import {
    Component,
    OnInit,
    OnDestroy
} from '@angular/core';
import {
    Router,
    NavigationStart
} from '@angular/router';
import {
    ImapMailsService
} from '../../service/imapemails.service';
import {
    MdDialog,
    MdDialogConfig,
    MdDialogRef
} from '@angular/material';
import {
    EmailModalComponent
} from '../email-modal/email-modal.component';
import {
    MdSnackBar
} from '@angular/material';
import {
    NgForm,
    FormControl,
    Validators
} from '@angular/forms';
import { Location } from '@angular/common';
import { CoreComponent } from './../../modules/core/core.component';
import { ComposeEmailComponent } from './../../modules/compose-email/compose-email.component';
import { LocalStorageService } from './../../service/local-storage.service';
import { CommonService } from './../../service/common.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-inbox',
    templateUrl: './inbox.component.html',
    styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit, OnDestroy {
    dialogRef: MdDialogRef<any>;
    Math: any;
    emaillist: any;
    loading = false;
    tag_id: string;
    tags: any;
    data: any;
    selected: any;
    emailIds: string[];
    selectedTag: any;
    message: string;
    showmessage: boolean;
    showInboxEmailList = true;
    subscription: any;
    tagsForEmailListAndModel: any;
    subject_for_genuine: string;
    emailParentId: any;
    emailChildId: any;
    emailParenttitle: string;
    emailChildTitle: string;
    selectedTagTitle: string;
    sendSuccessEmailListCount: any;
    sendFailedEmailListCount: any;
    dataForInterviewScheduleRound = [];
    inboxRefreshSubscription: any;
    fetchEmailSubscription: any;
    role: string;
    inboxMailsTagsForEmailListAndModel: any;
    constructor(public _core: CoreComponent, public _location: Location, public _router: Router, public dialog: MdDialog, public getemails: ImapMailsService, public snackBar: MdSnackBar, public _localStorageService: LocalStorageService, public _commonService: CommonService) {
        this.Math = Math;
        this.fetchEmailSubscription = this.getemails.componentMehtodCalled$.subscribe(
            () => {
                this.fetchNewEmails();
            });
        this.role = this._localStorageService.getItem('role');
    }

    ngOnInit() {
        this.emailIds = [];
        this.loading = true;
        this.data = {
            'page': 1,
            'tag_id': 0,
            'limit': 100
        };
        this.defaultOpen();
        setTimeout(() => {
            if (this._location.path().substr(0, 17) === '/core/inbox/email') {
                this.showInboxEmailList = false;
            } else {
                this.showInboxEmailList = true;
            }
        });
        this.subscription = this._core.routerInboxPage.subscribe(() => {
            this.showInboxEmailList = true;
        });
        this.inboxRefreshSubscription = this._commonService.inboxRefresh.subscribe(() => {
            this.refresh();
        });
    }

    defaultOpen() {
        this.getemails.getAllTagsMain()
            .subscribe((res) => {
                this.formatTagsInArray(res.data);
                if (res.data.length > 0) {
                    _.forEach(res.data, (value, key) => {
                        if (value['title'] === 'inbox') {
                            _.forEach(value['data'], (subMenuValue, subMenukey) => {
                                if (subMenuValue['title'] === 'Mails') {
                                    this.data.tag_id = subMenuValue['id'];
                                    this.selectedTag = subMenuValue['id'];
                                    this.selectedTagTitle = subMenuValue['title'] || '';
                                    this.emailParentId = '0';
                                    this.emailChildId = subMenuValue['id'].toString() || '0';
                                    this.emailParenttitle = value['title'];
                                    this.emailChildTitle = subMenuValue['title'] || '';
                                    this.getemails.getEmailList(this.data).subscribe((data) => {
                                        this.addSelectedFieldInEmailList(data);
                                        this.loading = false;
                                    });
                                }
                            });
                        }
                    });
                }
            }, (err) => {
                this.loading = false;
            });
    }

    addSelectedFieldInEmailList(data) {
        if (data && data['data'].length > 0) {
            _.forEach(data['data'], (value, key) => {
                value['selected'] = false;
            });
        }
        this.emaillist = data;
    }

    searchEmail(searchform: NgForm) {
        if (searchform.valid) {
            if (!!searchform.value['currentTag']) {
                this.data = {
                    'page': 1,
                    'tag_id': this.emailParentId,
                    'default_id': this.emailChildId,
                    'limit': 100,
                    'type': searchform.value['option'],
                    'keyword': searchform.value['keyword'],
                    'selected': searchform.value['currentTag']
                };
            } else {
                this.data = {
                    'page': 1,
                    'limit': 100,
                    'type': searchform.value['option'],
                    'keyword': searchform.value['keyword'],
                    'selected': searchform.value['currentTag']
                };
            }
            this.loading = true;
            this.showmessage = false;
            this.getemails.getEmailList(this.data).subscribe((data) => {
                if (data.data.length > 0) {
                    this.addSelectedFieldInEmailList(data);
                    this.emailIds = [];
                    this.loading = false;
                } else {
                    this.message = data.message;
                    this.showmessage = true;
                    this.emaillist = [];
                    this.loading = false;
                }
            });
        }
    }

    addEmail(id: string) {
        this.emailIds.push(id);
    }

    removeEmails(id: string) {
        this.emailIds.splice(this.emailIds.indexOf(id), 1);
    }

    composeEmail() {
        this.dialogRef = this.dialog.open(ComposeEmailComponent, {
            height: '90%',
            width: '70%'
        });
        this.dialogRef.componentInstance.emailList = this.emailIds;
        this.dialogRef.componentInstance.subject_for_genuine = this.subject_for_genuine;
        this.dialogRef.afterClosed().subscribe(result => {
            this.dialogRef = null;
            this.emailIds = [];
            this.addSelectedFieldInEmailList(this.emaillist);
        });
    }

    assign(id: any) {
        this.selected = {
            'tag_id': id,
            'mongo_id': this.emailIds,
            'selectedTag': this.selectedTag
        };
        this.getemails.assignTag(this.selected).subscribe((data) => {
            this.refresh();
            this.emailIds.length = 0;
            this.notify('done', '');
        }, (err) => {
            console.log(err);
        });
    }

    delete() {
        this.selected = {
            'tag_id': this.selectedTag,
            'mongo_id': this.emailIds
        };
        this.getemails.deleteEmail(this.selected).subscribe((data) => {
            this.refresh();
            this.emailIds.length = 0;
            this.notify('done', '');
        }, (err) => {
            console.log(err);
        });
    }

    notify(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }

    openEmails(email: any) {
        this.showInboxEmailList = false;
        const index = _.findIndex(this.emaillist['data'], email);
        if (index !== -1) {
            if (this.emaillist['data'][index]['unread']) {
                this.tags = this._commonService.reduseCountEmail(this.tags, this.selectedTag, this.emailParentId);
            }
            this.emaillist['data'][index]['unread'] = false;
        }
        this._router.navigate(['core/inbox/email', email._id]);
        this._localStorageService.setItem('email', email);
        this._localStorageService.setItem('selectedTag', this.selectedTag);
        this._localStorageService.setItem('tags', this.tagsForEmailListAndModel);
        this._localStorageService.setItem('dataForInterviewScheduleRound', this.dataForInterviewScheduleRound);
        this._localStorageService.setItem('inboxMailsTagsForEmailListAndModel', this.inboxMailsTagsForEmailListAndModel);
    }

    getAllTag() {
        this.getemails.getAllTagsMain()
            .subscribe((res) => {
                this.formatTagsInArray(res.data);
            }, (err) => {
                this.loading = false;
            });
    }
    sendEmailToPendingCandidates() {
        this.getemails.sendEmailToPendingCandidates({ 'tag_id': this.selectedTag }).subscribe((data) => {
            this.notify(data.message, '');
        }, (err) => {
            this.notify(err.message, '');
        });
    }
    sendEmailToAll() {
        this.dialogRef = this.dialog.open(ComposeEmailComponent, {
            height: '90%',
            width: '70%'
        });
        this.dialogRef.componentInstance.emailParenttitle = this.emailParenttitle;
        this.dialogRef.componentInstance.emailChildTitle = this.emailChildTitle;
        this.dialogRef.componentInstance.emailParentId = this.emailParentId;
        this.dialogRef.componentInstance.emailChildId = this.emailChildId;
        this.dialogRef.componentInstance.subject_for_genuine = this.subject_for_genuine;
        this.dialogRef.afterClosed().subscribe(result => {
            this.dialogRef = null;
            this.emailIds = [];
            this.addSelectedFieldInEmailList(this.emaillist);
        });
    }

    emaillists(emailData: any, page?: number) {
        this.emailParenttitle = emailData['parentTitle'];
        this.emailChildTitle = emailData['title'];
        if (this._location.path().substr(0, 17) === '/core/inbox/email') {
            this.showInboxEmailList = true;
            this._location.back();
        }
        this.emailParentId = (emailData.parantTagId ? emailData.parantTagId.toString() : null);
        if (emailData.id == null) {
            this.emailChildId = null;
        } else {
            this.emailChildId = emailData.id.toString() || '0';
        }
        if (emailData.title === 'All') {
            this.selectedTagTitle = emailData.title;
        } else {
            this.selectedTagTitle = '';
        }
        this.selectedTag = emailData.id;
        this.data = null;
        this.showmessage = false;
        this.data = {
            'page': page || 1,
            'tag_id': emailData.parantTagId || ((emailData.id === 0) ? 0 : emailData.id) || 0,
            'default_id': (emailData.parantTagId ? emailData.id : 0).toString() || '0',
            'limit': 100
        };
        this.loading = true;
        this.getemails.getEmailList(this.data).subscribe((data) => {
            this.addSelectedFieldInEmailList(data);
            this.emailIds = [];
            this.loading = false;
        });
    }

    searchEmailList(page: number) {
        this.data.page = page || 1;
        this.showmessage = false;
        this.loading = true;
        this.getemails.getEmailList(this.data).subscribe((data) => {
            this.addSelectedFieldInEmailList(data);
            this.emailIds = [];
            this.loading = false;
        });
    }

    previous() {
        if (this.data.page > 1) {
            this.data.page = this.data.page - 1;
            if (!this.data.type) {
                this.emaillists({ 'id': this.emailChildId, 'parantTagId': this.emailParentId, 'title': this.selectedTagTitle }, this.data.page);
            } else {
                this.searchEmailList(this.data.page);
            }
        }
    }

    next() {
        if (this.data.page < this.emaillist.count / this.data.limit) {
            this.data.page = this.data.page + 1;
            if (!this.data.type) {
                this.emaillists({ 'id': this.emailChildId, 'parantTagId': this.emailParentId, 'title': this.selectedTagTitle }, this.data.page);
            } else {
                this.searchEmailList(this.data.page);
            }
        }
    }

    fetchNewEmails() {
        this.loading = true;
        this.getemails.refreshNewEmails().subscribe((data) => {
            this.refresh();
        });
    }

    refresh(id?: string) {
        this.getAllTag();
        this.getemails.getEmailList(this.data).subscribe((data) => {
            this.emailIds = [];
            this.addSelectedFieldInEmailList(data);
        });
    }

    formatTagsInArray(data: any) {
        this.tags = JSON.parse(JSON.stringify(data));
        this._commonService.formateTags(data).then((res: any) => {
            this.tagsForEmailListAndModel = res.tagsForEmailListAndModel;
            this.dataForInterviewScheduleRound = res.dataForInterviewScheduleRound;
            this.subject_for_genuine = res.subject_for_genuine;
            this.inboxMailsTagsForEmailListAndModel = res.inboxMailsTagsForEmailListAndModel;
        }, (err) => { });
        this.loading = false;
    }

    trackByEmails(index, email) {
        return index;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.inboxRefreshSubscription.unsubscribe();
        this.fetchEmailSubscription.unsubscribe();
    }

}
