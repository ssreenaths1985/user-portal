import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { DiscussComponent } from './routes/discuss-home/discuss.component'
// import { DiscussAllComponent } from './routes/discuss-all/discuss-all.component'
// import { DiscussCategoriesComponent } from './routes/discuss-categories/discuss-categories.component'
// import { DiscussGroupsComponent } from './routes/discuss-groups/discuss-groups.component'
// import { DiscussTagsComponent } from './routes/discuss-tags/discuss-tags.component'
// import { DiscussLeaderboardComponent } from './routes/discuss-leaderboard/discuss-leaderboard.component'
// import { DiscussMyDiscussionsComponent } from './routes/discuss-my-discussions/discuss-my-discussions.component'
// import { DiscussionComponent } from './routes/discussion/discussion.component'
// import { InitResolver } from './resolvers/init-resolve.service'
import { DiscussTagsResolve } from './resolvers/discuss-tags-resolve'
import { DiscussCategoriesResolve } from './resolvers/discuss-category-resolve'
import { DiscussRecentResolve } from './resolvers/discuss-recent-resolve'
// import { DiscussCategoriesResolve } from './resolvers/discuss-category-resolve'
import { DiscussTopicResolve } from './resolvers/discuss-topic-resolve'
import { DiscussUnreadResolve } from './resolvers/discuss-unread-resolve'
import { DiscussProfileResolve } from './resolvers/discuss-profile-resolve'
import { DiscussConfigResolve } from './resolvers/discuss-config-resolve'
// import { ConfigurationsService } from './resolvers/config-resolver.service'
// import { ProfileResolverService } from './resolvers/profile-resolver.service'

const routes: Routes = [
  {
    path: '',
    // loadChildren: () => import('./wrapper/wrapper.module').then(u => u.WrapperModule),
    component: DiscussComponent,
    data: {
      pageId: 'discussion',
      module: 'Discuss',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'discussion-forum',
      },
      {
        path: 'discussion-forum',
        loadChildren: () => import('./wrapper/wrapper.module').then(u => u.WrapperModule),
        data: {
          pageId: 'discussion-forum',
          module: 'Discuss',
        },
        resolve: {
          data: DiscussConfigResolve,
        },
      },
    //   {
    //     path: 'home/:topicId',
    //     component: DiscussionComponent,
    //     data: {
    //       load: ['ckeditor'],
    //     },
    //     resolve: {
    //       script: InitResolver,
    //       topic: DiscussTopicResolve,
    //     },
    //   },
    //   {
    //     path: 'categories',
    //     component: DiscussCategoriesComponent,
    //     resolve: {
    //       availCategories: DiscussCategoriesResolve,
    //     },
    //   },
    //   {
    //     path: 'groups',
    //     component: DiscussGroupsComponent,
    //   },
    //   {
    //     path: 'tags',
    //     component: DiscussTagsComponent,
    //     resolve: {
    //       availableTags: DiscussTagsResolve,
    //     },
    //   },
    //   {
    //     path: 'leaderboard',
    //     component: DiscussLeaderboardComponent,
    //   },
    //   {
    //     path: 'my-discussions',
    //     component: DiscussMyDiscussionsComponent,
    //     resolve: {
    //       profile: DiscussProfileResolve,
    //     },
    //   },
    ],
    // resolve: {
    //   data: DiscussConfigResolve,
    //   // configData: ConfigurationsService,
    //   // profileData: ProfileResolverService,
    // },
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    DiscussTagsResolve,
    DiscussCategoriesResolve,
    DiscussRecentResolve,
    DiscussTopicResolve,
    DiscussUnreadResolve,
    DiscussProfileResolve,
    DiscussConfigResolve,
    // ConfigurationsService,
    // ProfileResolverService,
  ],
})
export class DiscussRoutingModule { }
