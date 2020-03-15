import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SharedLibModule } from 'shared-lib';
import 'hammerjs';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { PopoverComponent } from '../app/components/popover/popover/popover.component';

@NgModule({
  declarations: [
    AppComponent,
    PopoverComponent,
  ],
  imports: [
    BrowserModule,
    SharedLibModule.forRoot(environment),
    SlickCarouselModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
