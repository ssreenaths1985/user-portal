import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { CuratedHomeComponent } from './routes/curated-home/curated-home.component'
import { PageResolve } from '@sunbird-cb/utils'
import { CuratedexplorerComponent } from './routes/curatedexplorer/curatedexplorer.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: CuratedHomeComponent,
    data: {
      pageType: 'feature',
      pageKey: 'curated-home',
      pageId: 'home',
      module: 'explore',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: ':collectionId',
    component: CuratedexplorerComponent,
    data: {
      pageType: 'feature',
      pageKey: 'curated-explorer',
      pageId: ':topic',
      module: 'explore',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CuratedCoursesRoutingModule { }
