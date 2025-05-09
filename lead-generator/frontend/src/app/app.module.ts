import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LeadFormComponent } from './components/lead-form/lead-form.component';
import { LeadListComponent } from './components/lead-list/lead-list.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LeadDetailComponent } from './components/lead-detail/lead-detail.component';
import { SettingsComponent } from './components/settings/settings.component';
import { QualificationScoreComponent } from './components/qualification-score/qualification-score.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'leads', component: LeadListComponent },
  { path: 'leads/:id', component: LeadDetailComponent },
  { path: 'add-lead', component: LeadFormComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LeadFormComponent,
    LeadListComponent,
    DashboardComponent,
    LeadDetailComponent,
    SettingsComponent,
    QualificationScoreComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
