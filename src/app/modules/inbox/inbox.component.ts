import { Component, OnInit } from '@angular/core';
import { ImapMailsService } from '../../service/imapemails.service';
import {MdIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss']
})
export class InboxComponent implements OnInit {
  firstlist = true;
  secondlist = false;
  emaillist: any;
  loading = false;

  constructor(iconRegistry: MdIconRegistry, sanitizer: DomSanitizer, public getemails: ImapMailsService) {
      // To avoid XSS attacks, the URL needs to be trusted from inside of your application.
    const uparrowSafeUrl = sanitizer.bypassSecurityTrustResourceUrl('../../../../assets/up_arrow.svg');
    iconRegistry.addSvgIconSetInNamespace('up_arrow', uparrowSafeUrl);
  }

  ngOnInit() {
  this.loading = true;
  this.getemails.getEmailList().subscribe((data) => {
      this.emaillist = data.data;
      this.loading = false;
    });
  }

}