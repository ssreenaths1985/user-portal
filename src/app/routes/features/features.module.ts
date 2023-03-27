import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FeaturesComponent } from './features.component'
import {
  MatToolbarModule,
  MatIconModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatButtonModule,
  MatInputModule,
  MatCardModule,
} from '@angular/material'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { BtnFeatureModule, BtnPageBackModule } from '@sunbird-cb/collection'
import { WidgetResolverModule } from '@sunbird-cb/resolver'
import { LogoutModule } from '@sunbird-cb/utils'
import { AccessControlService } from '../../../../project/ws/author/src/public-api'

@NgModule({
  declarations: [FeaturesComponent],
  imports: [
    CommonModule,
    FormsModule,
    BtnFeatureModule,
    BtnPageBackModule,
    LogoutModule,
    WidgetResolverModule,
    ReactiveFormsModule,
    RouterModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    MatCardModule,
  ],
  exports: [FeaturesComponent],
  providers: [AccessControlService],
})
export class FeaturesModule { }
