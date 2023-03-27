import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { NetworkComponent } from './routes/network/network.component'
import { NetworkHomeComponent } from './routes/network-home/network-home.component'
import { NetworkMyConnectionComponent } from './routes/network-my-connection/network-my-connection.component'
import { RecommendedResolveService } from './resolvers/recommended-resolve.service'
import { MyConnectionResolveService } from './resolvers/my-connection-resolve.service'
import { NetworkConnectionRequestsComponent } from './routes/network-connection-requests/network-connection-requests.component'
import { NetworkMyMdoComponent } from './routes/network-my-mdo/network-my-mdo.component'
import { NetworkRecommendedComponent } from './routes/network-recommended/network-recommended.component'
import { MyMdoResolveService } from './resolvers/my-mdo-resolve.service'
import { ConnectionRequestResolveService } from './resolvers/connection-request-resolve.service'
import { MyProfileResolve } from './resolvers/my-profile.resolve'
// import { ConfigurationsService } from './resolvers/config-resolver.service'
// import { ProfileResolverService } from './resolvers/profile-resolver.service'

const routes: Routes = [
  {
    path: '',
    component: NetworkComponent,
    data: {
      pageId: '',
      module: 'network',
    },
    resolve: {
      me: MyProfileResolve,
      // profileData: ProfileResolverService,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        component: NetworkHomeComponent,
        data: {
          pageId: 'home',
          module: 'network',
        },
        resolve: {
          recommendedUsers: MyMdoResolveService,
          connectionRequests: ConnectionRequestResolveService,
          myConnectionList: MyConnectionResolveService,
          // profileData: ProfileResolverService,
        },
      },
      {
        path: 'my-connection',
        component: NetworkMyConnectionComponent,
        data: {
          pageId: 'my-connection',
          module: 'network',
        },
        resolve: {
          myConnectionList: MyConnectionResolveService,
          // profileData: ProfileResolverService,
        },
      },
      {
        path: 'connection-requests',
        component: NetworkConnectionRequestsComponent,
        data: {
          pageId: 'connection-requests',
          module: 'network',
        },
        resolve: {
          connectionRequests: ConnectionRequestResolveService,
          // profileData: ProfileResolverService,
        },
      },
      {
        path: 'my-mdo',
        component: NetworkMyMdoComponent,
        data: {
          pageId: 'my-mdo',
          module: 'network',
        },
        resolve: {
          myMdoList: MyMdoResolveService,
          // profileData: ProfileResolverService,
        },
      },
      {
        path: 'recommended',
        component: NetworkRecommendedComponent,
        data: {
          pageId: 'recommended',
          module: 'network',
        },
        resolve: {
          recommendedList: RecommendedResolveService,
          // profileData: ProfileResolverService,
        },
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [MyProfileResolve],
})
export class NetworkV2RoutingModule { }
