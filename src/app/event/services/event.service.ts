import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Location } from '../models/location.model';
import { Marker } from '../models/marker.model';

@Injectable({ providedIn: 'root' })
export class EventsService {
  marker: Marker;
  private events: Marker[] = [];
  private newEvent = new Subject<Marker[]>();
  location = new Subject<Location>();

 constructor(private http: HttpClient, private router: Router) {}

getEvent(id: string) {
return this.http.get<{_id: string; lat: number; lng: number; title: string; description: string; creator: string}>(
  'http://localhost:3000/api/event/' + id
);
}

  addEvent(title: string, description: string, location: Location) {

     const event: Marker = {id: null, location: location , title: title,
      description: description, creator: null};
     this.http
       .post<{ message: string; event: Marker }>('http://localhost:3000/api/event/createevent', event)
       .subscribe(responseData => {
 this.router.navigate(['./map']);
       });
      }

getEvents() {
  this.http
    .get<{ message: string; events: any }>('http://localhost:3000/api/event')
    .pipe(
      map(eventData => {
        return eventData.events.map(event => {
          return {
            location: {lat: event.lat, lng: event.lng},
            title: event.title,
            description: event.description,
            id: event._id,
            creator: event.creator
          };
        });
      })
    )
    .subscribe(transformedEvents => {
      this.events = transformedEvents;
      this.newEvent.next([...this.events]);
    });
}

getEventUpdateListener() {
  return this.newEvent.asObservable();
}

deleteEvent(eventId: string) {
  return this.http.delete('http://localhost:3000/api/event/' + eventId).subscribe(() => {
    const updatedEvents = this.events.filter(e => e.id !== eventId);
    this.events = updatedEvents;
    this.newEvent.next([...this.events]);
  });
}
}
