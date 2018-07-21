import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { LetterBoldPipe } from './shared/letter-bold.pipe';
import { SearchFilterPipe } from './shared/filter-pipe';
import { ClickOutsideDirective } from './shared/dropdown.directive';
import { ApiService } from './shared';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ConnectionpageComponent } from './connectionpage/connectionpage.component';
import { FeedbackPageComponent } from './feedback-page/feedback-page.component';


const appRoutes : Routes = [
  {
    path : '',
    component : HomeComponent
  },
  {
    path : 'connection',
    component : ConnectionpageComponent
  },
  {
    path : 'feedback',
    component : FeedbackPageComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ClickOutsideDirective,
    SearchFilterPipe,
    LetterBoldPipe,
    ConnectionpageComponent,
    FeedbackPageComponent
    ],
    imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
