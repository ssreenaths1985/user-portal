import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatTooltipModule,
  MatListModule,
  MatSidenavModule,
  MatCardModule,
  MatExpansionModule,
  MatRadioModule,
  MatChipsModule,
  MatInputModule,
  MatFormFieldModule,
  MatDialogModule,
  MatSnackBarModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTableModule,
  MatCheckboxModule,
  MatProgressSpinnerModule,
  MatButtonToggleModule,
  MatTabsModule,
  MatAutocompleteModule,
} from '@angular/material'
import { PublicSignupComponent } from './public-signup.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { SignupService } from './signup.service'
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha'
import { SignupSuccessDialogueComponent } from './signup-success-dialogue/signup-success-dialogue/signup-success-dialogue.component'
import { environment } from 'src/environments/environment'
import { PipeOrderByModule } from '@sunbird-cb/utils/src/lib/pipes/pipe-order-by/pipe-order-by.module'

@NgModule({
  declarations: [PublicSignupComponent, SignupSuccessDialogueComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatListModule,
    MatSidenavModule,
    MatCardModule,
    MatExpansionModule,
    MatRadioModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatAutocompleteModule,
    RecaptchaV3Module,
    PipeOrderByModule,
  ],
  exports: [PublicSignupComponent],
  providers: [
    SignupService,
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptchaKey,
    },
  ],
  entryComponents: [SignupSuccessDialogueComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PublicSignupModule { }
