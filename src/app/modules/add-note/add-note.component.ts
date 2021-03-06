import { Component, ViewContainerRef, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialogRef, MatSnackBar, } from '@angular/material';
import { ImapMailsService } from '../../service/imapemails.service';
import { NgForm } from '@angular/forms';
import * as _ from 'lodash';
import { SetvaremailpreviewComponent } from './../setvaremailpreview/setvaremailpreview.component';
import { CommonService } from './../../service/common.service';
import { LocalStorageService } from 'app/service/local-storage.service';


@Component({
    selector: 'app-note',
    templateUrl: './add-note.component.html',
    styleUrls: ['./add-note.component.scss'],
})
export class AddNoteComponent implements OnInit {
    note = '';
    formOpen = true;
    candidateid: any;
    data: any;
    emailList: any;
    title: any;
    rejectNote = false;
    closeWindow: boolean;
    constructor(public dialogRef: MatDialogRef<any>, public _apiService: ImapMailsService, public localStorageService: LocalStorageService) {
    }
    ngOnInit() {
        if (this.title) {
            this.rejectNote = true;
        }
    }
    save(form: NgForm) {
        if (form.valid) {
            form.value.note = this.note;
            form.value.mongo_id = this.candidateid
            this._apiService.addNote(form.value).subscribe();
            this.dialogRef.close({ 'notedata': form.value });
        }
    }
    close() {
    }
}
