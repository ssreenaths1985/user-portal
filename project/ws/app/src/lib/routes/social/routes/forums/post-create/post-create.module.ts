import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PostCreateComponent } from './post-create.component'
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatToolbarModule,
  MatChipsModule,
  MatAutocompleteModule,
  MatDividerModule,
  MatSlideToggleModule,
  MatTooltipModule,
  MatTabsModule,
  MatMenuModule,
  MatSnackBarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
} from '@angular/material'
import { EditorQuillModule, BtnPageBackModule } from '@sunbird-cb/collection'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
@NgModule({
  declarations: [PostCreateComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatTabsModule,
    MatMenuModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,

    EditorQuillModule,
    BtnPageBackModule,
  ],
})
export class PostCreateModule { }
