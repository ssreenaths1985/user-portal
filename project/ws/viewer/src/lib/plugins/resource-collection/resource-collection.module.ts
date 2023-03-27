import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatTableModule,
  MatIconModule,
  MatPaginatorModule,
  MatTabsModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule,
  MatProgressSpinnerModule,
} from '@angular/material'
import { ResourceCollectionComponent } from './resource-collection.component'
import { ViewSubmissionComponent } from './components/view-submission/view-submission.component'
import { PlayerPdfModule, PlayerVideoModule, PlayerSurveyModule } from '@sunbird-cb/collection'

@NgModule({
  declarations: [ResourceCollectionComponent, ViewSubmissionComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatCardModule,
    MatPaginatorModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    PlayerPdfModule,
    PlayerVideoModule,
    PlayerSurveyModule,
  ],
  entryComponents: [
    ViewSubmissionComponent,
  ],
  exports: [
    ResourceCollectionComponent,
  ],
})
export class ResourceCollectionModule { }
