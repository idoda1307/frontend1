import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import {MyAuthService} from '../auth.service';
import { Subscription } from 'rxjs';


@Component ({
selector: 'app-login',
templateUrl: './login.component.html',
styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;

constructor(public authService: MyAuthService) {}

ngOnInit() {
 this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
   authStatus => {
this.isLoading = false;
   }
 );
}

ngOnDestroy() {
  this.authStatusSub.unsubscribe();
}
// public signinWithGoogle () {
//   const socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;

//   this.socialAuthService.signIn(socialPlatformProvider).then(
//     (userData) => {
//       // on success this will return user data from google. What you need is a user token which you will send it to the server
//        this.authService.sendToRestApiMethod(userData.idToken);
//     }
//   );
// }

  onLogin(form: NgForm) {
if (form.invalid) {
return;
}
this.isLoading = true;
this.authService.login(form.value.email, form.value.password);

  }
}
