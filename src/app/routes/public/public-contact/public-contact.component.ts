import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core'
import { ConfigurationsService, NsPage } from '@sunbird-cb/utils'
import { Subscription } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
// tslint:disable-next-line: import-name
import _ from 'lodash'

@Component({
  selector: 'ws-public-contact',
  templateUrl: './public-contact.component.html',
  styleUrls: ['./public-contact.component.scss'],
})
export class PublicContactComponent implements OnInit, AfterViewInit, OnDestroy {
  contactUsMail = ''
  contactPage: any
  platform = 'iGot'
  panelOpenState = false
  currentTab = 'personalInfo'
  searchText!: string
  tabsData!: any
  elementPosition: any
  sticky = false

  showSideMenu: Boolean = true

  @ViewChild('stickyMenu', { static: true }) menuElement!: ElementRef

  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar
  private subscriptionContact: Subscription | null = null
  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset
    if (windowScroll >= this.elementPosition) {
      this.sticky = true
    } else {
      this.sticky = false
    }
  }
  constructor(private configSvc: ConfigurationsService, private activateRoute: ActivatedRoute) { }

  ngOnInit() {
    this.subscriptionContact = this.activateRoute.data.subscribe(data => {
      this.contactPage = data.pageData.data
      const menus = _.map(_.get(this.contactPage, 'help'), (menu: any, idx: number) => {
        return {
          name: menu.title,
          key: menu.fragment,
          isDefaultSelected: (idx === 0),
          render: true,
          fragment: menu.fragment,
          badges: {
            enabled: true,
            uri: '',
          },
          enabled: true,
          routerLink: '/public/faq',
          customRouting: false,
        }
      })
      this.tabsData = {
        menus,
        logo: false,
        logoPath: null,
        name: '',
        userRoles: [],
      }
    })
    if (this.configSvc.instanceConfig) {
      this.contactUsMail = this.configSvc.instanceConfig.mailIds.contactUs
    }
  }
  ngAfterViewInit() {
    this.elementPosition = this.menuElement.nativeElement.parentElement.offsetTop
  }
  ngOnDestroy() {
    if (this.subscriptionContact) {
      this.subscriptionContact.unsubscribe()
    }
  }
  onSideNavTabClick(id: string) {
    this.currentTab = id
    const el = document.getElementById(id)
    if (el != null) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
    }
  }

  get getHelp() {
    const normalize = (str: string) => _.toLower(_.deburr(str))

    const includesValue = (val: string, obj: any) => {
      const search = normalize(val)
      return _.some(obj, v => normalize(v).includes(search))
    }
    if (!this.searchText) {
      return this.contactPage.help
    }
    const contents: any[] = []
    if (this.contactPage.help) {
      _.each(this.contactPage.help, m => {
        const newVal = { ...m }
        newVal.contents = []
        if (this.searchText) {
          _.each(_.get(m, 'contents'), c => {
            if (includesValue(this.searchText || '', c)) {
              newVal.contents.push(c)
              // contents.push(m)
            }
          })
          contents.push(newVal)
        } else {
          contents.push(m)
        }
      })
    }
    return _.compact(contents)
  }

  showMenuButton() {
    this.showSideMenu = this.showSideMenu ? false : true
  }
  closeNav() {
    this.showSideMenu = this.showSideMenu ? false : true
  }
}
