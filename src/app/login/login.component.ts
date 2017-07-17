import { Component, OnInit,HostDecorator, } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/primeng';

import { AuthenticationService } from '../shared/guard/authentication.service';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    model: any  = {};
    error: Message[] = [];

    constructor(public router: Router,
                private authenticationService: AuthenticationService) { }

    ngOnInit() { this.error=[];}

    onKey(event: any){
        console.log(event);
    }
    login() {
        this.authenticationService.login(this.model.username,this.model.password)
            .subscribe(result => {
                    if(result===true){
                        this.error=[];
                        this.error.push({severity:'success', summary:'Success: ', detail:'Welcome to Analytics!'});
                        this.router.navigate(['/charts']);
                    }
                    else
                    { 
                        this.error=[];
                        this.error.push({severity:'error', summary:'Error: ', detail:'Validation failed!'});
                    }
                },
                 (err) => {
                     this.error=[];
                        this.error.push({severity:'error', summary:'Error: ', detail:'Validation failed!'});                     
                 });
    }

}
