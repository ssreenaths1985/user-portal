import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { PipeNameTransformModule } from '@sunbird-cb/utils'
import { FormsModule } from '@angular/forms'
import { TooltipDirective } from '../../_directives/tooltip.directive'
import { AvatarPhotoModule } from '../avatar-photo/avatar-photo.module'
import { MatIconModule } from '@angular/material/icon'
import { MatCardModule } from '@angular/material/card'
import { ConnectionHoverCardComponent } from './connection-hover-card.component'

@NgModule({
  declarations: [ConnectionHoverCardComponent, TooltipDirective],
  imports: [
    CommonModule,
    PipeNameTransformModule,
    FormsModule,
    AvatarPhotoModule,
    MatIconModule,
    MatCardModule,
  ],
  exports: [ConnectionHoverCardComponent, TooltipDirective],
  entryComponents: [ConnectionHoverCardComponent],
  providers: [],
})
export class ConnectionHoverModule {

}
