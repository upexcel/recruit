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

  users = [
    {
      name: 'Lia Lugo',
      avatar: 'svg-11',
      details: 'I love cheese, especially airedale queso. Cheese and biscuits halloumi cauliflower cheese cottage ' +
      'castello caerphilly chalk and cheese. Lancashire.'
    },
    {
      name: 'Gener Delosreyes',
      avatar: 'svg-13',
      details: 'Raw denim pour-over readymade Etsy Pitchfork. Four dollar toast pickled locavore bitters McSweeney\'s ' +
      'literally hoodie bespoke, put a bird on it Marfa messenger bag kogi VHS.'
    }
  ];

  tiles = [
    {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
    {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
  ];

  selectedUser = this.users[0];

  constructor(iconRegistry: MdIconRegistry, sanitizer: DomSanitizer,public getemails: ImapemailsService) {
    // To avoid XSS attacks, the URL needs to be trusted from inside of your application.
    const avatarsSafeUrl = sanitizer.bypassSecurityTrustResourceUrl('./assets/avatars.svg');

    iconRegistry.addSvgIconSetInNamespace('avatars', avatarsSafeUrl);
  }

  ngOnInit(): void {
    this.getemails.getemaillist().subscribe((data)=>{
      this.emaillist=data.data;
      console.log(this.emaillist);
    });
  }

}
