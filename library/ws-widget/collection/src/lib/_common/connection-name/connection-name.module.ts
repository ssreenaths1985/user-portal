import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { PipeNameTransformModule } from '@sunbird-cb/utils'
import { FormsModule } from '@angular/forms'
import { ConnectionNameComponent } from './connection-name.component'
import { AvatarPhotoModule } from '../avatar-photo/avatar-photo.module'
import { MatIconModule } from '@angular/material/icon'
import { MatCardModule } from '@angular/material/card'
import { ConnectionHoverModule } from '../connection-hover-card/connection-hover.module'

@NgModule({
  declarations: [ConnectionNameComponent],
  imports: [
    CommonModule,
    PipeNameTransformModule,
    FormsModule,
    AvatarPhotoModule,
    MatIconModule,
    MatCardModule,
    ConnectionHoverModule,
  ],
  exports: [ConnectionNameComponent],
  entryComponents: [ConnectionNameComponent],
  providers: [],
})
export class ConnectionNameModule {

}
