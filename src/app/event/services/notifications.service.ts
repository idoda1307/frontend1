import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
import { Observable } from 'rxjs';

@Injectable()
export class NotificationsService {


  readonly VAPID_PUBLIC_KEY = 'BFsjeYO7F2jfDBJYF8fhGGWK1knggiFN8uxEpslVLgBw5i5VNQlPan7s-jNw-NAR4L-DQo0_YWZfov1EkCxbyHI';
    constructor(private http: HttpClient, private swPush: SwPush) {}

     addPushSubscriber(sub: any) {
       console.log(sub);
         return this.http.post('http://localhost:3000/api/notification', sub);
     }
    //  send() {
    //      return this.http.post('http://localhost:3000/api/notification/notifications', null);
    //  }
     subscribeToNotifications() {
      console.log(this.swPush);
       this.swPush.requestSubscription({
           serverPublicKey: this.VAPID_PUBLIC_KEY
       })
       .then(sub => this.addPushSubscriber(sub).subscribe())
       .catch(err => console.error('Could not subscribe to notifications', err));
   }
  // subscribeToPush() {
  //   console.log('[Push Service] Requesting subscription');
  //   this.swPush.requestSubscription({
  //     serverPublicKey: this.VAPID_PUBLIC_KEY
  //   })
  //     .then(pushSubscription => {
  //       this.addSubscriber(pushSubscription)
  //         .subscribe(
  //           res => {
  //             console.log(res);
  //           },
  //           err => {
  //             console.log(err);
  //           }
  //         );
  //     })
  //     .catch(err => {
  //       console.error(err);
  //     });
  // }

  // addSubscriber(subscription) {
  //   const url = `http://localhost:3000/api/notification/notifications`;
  //   console.log('[Push Service] Adding subscriber');

  //   const body = {
  //     action: 'subscribe',
  //     subscription: subscription
  //   };

  //   return this.http
  //     .post(url, body);
  // }
}

