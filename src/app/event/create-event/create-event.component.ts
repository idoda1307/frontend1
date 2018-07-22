import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, Inject } from '@angular/core';
import {Location} from '../models/location.model';
import { FormGroup, FormControl, Validators, NgForm, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../services/event.service';
import { Marker } from '../models/marker.model';
import { Subscription } from 'rxjs';
import { MyAuthService } from '../../auth/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SwPush } from '@angular/service-worker';
import { NotificationsService } from '../services/notifications.service';

@ Component ({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})

export class CreateEventComponent implements OnInit, OnDestroy {

 @Input() location: Location;
  marker: Marker;
  isLoading = false;
  form: FormGroup;
  private eventId: string;
  private authStatusSub: Subscription;
  readonly VAPID_PUBLIC_KEY = 'BFsjeYO7F2jfDBJYF8fhGGWK1knggiFN8uxEpslVLgBw5i5VNQlPan7s-jNw-NAR4L-DQo0_YWZfov1EkCxbyHI';
  constructor(
    public eventssService: EventsService,
    public route: ActivatedRoute,
    private authService: MyAuthService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private swPush: SwPush,
    public dialogRef: MatDialogRef<CreateEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Location) {
    }

ngOnInit() {
  this.authStatusSub = this.authService
  .getAuthStatusListener()
  .subscribe(authStatus => {
    this.isLoading = false;
  });
this.eventId = null;
this.form = this.fb.group({
  title: new FormControl(null, {
    validators: [Validators.required, Validators.minLength(3)]
  }),
  description: new FormControl(null, { validators: [Validators.required] })
  });
}

  onAddEvent() {
    if (this.form.invalid) {
      return;
    }
     this.isLoading = true;
       this.eventssService.addEvent(this.form.value.title, this.form.value.description, this.data);
       this.marker = {id: null, title: this.form.value.title, description: this.form.value.description, location: this.data,
         creator: this.authService.getUserId() };
      // this.form.reset();
       this.dialogRef.close(this.marker);
     }

    ngOnDestroy() {
      this.authStatusSub.unsubscribe();
    }
}
