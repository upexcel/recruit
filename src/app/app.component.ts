import {Component,OnInit} from '@angular/core';
import {MdIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import { ImapemailsService } from './service/imapemails.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  firstlist: boolean=true;
  secondlist: boolean=false;
  emaillist: any;
  loading: boolean=false;

  users = [
    {
      name: 'Lia Lugo',
      details: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage ' +
      'castello caerphilly chalk and cheese. Lancashire.'
    }
  ];

  selectedUser = this.users[0];

  constructor(iconRegistry: MdIconRegistry, sanitizer: DomSanitizer,public getemails: ImapemailsService) {
    // To avoid XSS attacks, the URL needs to be trusted from inside of your application.
    const avatarsSafeUrl = sanitizer.bypassSecurityTrustResourceUrl('./assets/avatars.svg');
    iconRegistry.addSvgIconSetInNamespace('avatars', avatarsSafeUrl);
  }

  ngOnInit(): void {
    this.loading=true;
    this.getemails.getemaillist().subscribe((data)=>{
      this.emaillist=data.data;
      this.loading=false;
      console.log(this.emaillist);
    });
  }

}
