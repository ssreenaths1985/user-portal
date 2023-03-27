import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { UserProfileComponent } from './components/user-profile/user-profile.component'
import { ProfileResolverService } from './resolvers/profile-resolver.service'
import { PageResolve } from '@sunbird-cb/utils/src/public-api'

const routes: Routes = [
{
    path: 'details',
    component: UserProfileComponent,
    data: {
        pageType: 'feature',
        pageKey: 'edit-profile',
        pageId: 'details',
        module: 'Profile',
      },
    resolve: {
        profileData: ProfileResolverService,
        pageData: PageResolve,
    },
},
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [ProfileResolverService],
})
export class UserProfileRoutingModule { }
