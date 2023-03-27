import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  MatIconModule,
  MatFormFieldModule,
  MatMenuModule,
  MatButtonModule,
  MatSliderModule,
  MatToolbarModule,
  MatInputModule,
} from '@angular/material'
import { ReactiveFormsModule } from '@angular/forms'
import { BtnFullscreenModule } from '../btn-fullscreen/btn-fullscreen.module'
import { PlayerSurveyComponent } from './player-survey.component'
import { MicroSurveyModule } from '@sunbird-cb/micro-surveys'
@NgModule({
  declarations: [PlayerSurveyComponent],
  imports: [
    CommonModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatMenuModule,
    MatButtonModule,
    MatSliderModule,
    MatToolbarModule,
    ReactiveFormsModule,
    BtnFullscreenModule,
    MatInputModule,
    MicroSurveyModule,
  ],
  exports: [PlayerSurveyComponent],
  entryComponents: [PlayerSurveyComponent],
})
export class PlayerSurveyModule { }
