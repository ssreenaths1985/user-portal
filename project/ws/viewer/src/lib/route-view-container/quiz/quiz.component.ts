import { Component, Input, OnInit } from '@angular/core'
import { NsContent } from '@sunbird-cb/collection'
import { NSQuiz } from '../../plugins/quiz/quiz.model'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'viewer-quiz-container',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  @Input() isFetchingDataComplete = false
  @Input() isErrorOccured = false
  @Input() quizData: NsContent.IContent | null = null
  @Input() forPreview = false
  @Input() quizJson: Partial<NSQuiz.IQuiz> = {
    timeLimit: 0,
    questions: [],
    isAssessment: false,
  }
  @Input() isPreviewMode = false
  isTypeOfCollection = false
  collectionId: string | null = null
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.isTypeOfCollection = this.activatedRoute.snapshot.queryParams.collectionType ? true : false
    if (this.isTypeOfCollection) {
      this.collectionId = this.activatedRoute.snapshot.queryParams.collectionId
    }
  }
}
