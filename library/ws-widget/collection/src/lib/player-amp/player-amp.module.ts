import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PlayerAmpComponent } from './player-amp.component'
import { PipePublicURLModule } from '@sunbird-cb/utils/src/public-api'

@NgModule({
  declarations: [PlayerAmpComponent],
  imports: [
    CommonModule,
    PipePublicURLModule,
  ],
  entryComponents: [PlayerAmpComponent],
})
export class PlayerAmpModule { }
