import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { Router } from '@angular/router'
import { jsPDF } from 'jspdf'

@Component({
  selector: 'ws-widget-app-profile-certificate-dialog',
  templateUrl: './profile-certificate-dialog.component.html',
  styleUrls: ['./profile-certificate-dialog.component.scss'],
})
export class ProfileCertificateDialogComponent implements OnInit {

  // @ViewChild('images',{
  // static: false
  // }) images: { nativeElement: Node; } | null | undefined;
  // certLink: any
  url!: string
  courseImg: any
  courseName: any
  courseID: any
  author!: string
  userID: any

  navUrl: any = ''
  shareUrl = 'https://medium.com/@garfunkel61/angular-simplest-solution-for-social-sharing-feature-6f00d5d99c5e'

  constructor(
    private router: Router,
    // private sanitizer: DomSanitizer,
    // private contentSvc: WidgetContentService,
    public dialogRef: MatDialogRef<ProfileCertificateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.url = this.data.cet
    // this.shareUrl = this.url
    // console.log(this.data.value, this.data.value.content.appIcon)
    this.courseImg = this.data.value.content.appIcon
    this.courseID = this.data.value.contentId
    this.userID = this.data.value.userId
    this.createNavigationUrl()

    // this.downloadCertInLocal(this.url)
  }

  private createNavigationUrl() {
    // let searchParams = new URLSearchParams();

    //     const sanit = this.sanitizer.bypassSecurityTrustUrl(`${this.url}`)
    // const url = this.data.cet
    // const url = 'https://igot.blob.core.windows.net/public/content/do_113410093720715264148/artifact
    // /do_113410070261366784147_1636971467537_rupixencompbgycq3zx0unsplash1636971467478.thumb.jpg'
    // searchParams.set('url', url);
    // console.log("url",sanit);
    // const url = `https://igot-dev.in/share/toc/${this.userID}/${this.courseID}`;
    // const a = this.sanitizer.bypassSecurityTrustUrl(
    //   `${this.data.cet}`)
    // searchParams.set('url', a);
    // console.log(a);
    this.navUrl = `https://www.linkedin.com/shareArticle?title=I%20earned%20a%20certficiation&url=${this.data.value.content.appIcon}`
    // this.navUrl =  url
    // console.log("navurl", this.navUrl)
  }

  navigate(data: any) {
    this.router.navigateByUrl(`/app/toc/${data}/overview`)
  }

  downloadCert() {
    const a: any = document.createElement('a')
    a.href = this.data.cet
    a.download = 'Certificate'
    document.body.appendChild(a)
    a.style = 'display: none'
    a.click()
    a.remove()

    // download as jpge

  }
  downloadCertPng() {
    const uriData = this.data.cet
    const img = new Image()
    img.src = uriData
    img.width = 1820
    img.height = 1000
    img.onload = () => {
      const canvas = document.createElement('canvas');
      [canvas.width, canvas.height] = [img.width, img.height]
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // ctx.imageSmoothingEnabled = true
        ctx.drawImage(img, 0, 0, img.width, img.height)
        const a = document.createElement('a')
        const quality = 1.0 // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality
        a.href = canvas.toDataURL('image/png', quality)
        a.download = 'Certificate'
        a.append(canvas)
        a.click()
        a.remove()
      }
    }
  }
  async downloadCertPdf() {
    const uriData = this.data.cet
    const img = new Image()
    img.src = uriData
    img.width = 1820
    img.height = 1000
    img.onload = () => {
      const canvas = document.createElement('canvas');
      [canvas.width, canvas.height] = [img.width, img.height]
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0, img.width, img.height)
        const quality = 1.0 // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality
        const dataImg = canvas.toDataURL('application/pdf', quality)
        const pdf = new jsPDF('landscape', 'px', 'a4')

        // add the image to the PDF
        pdf.addImage(dataImg, 10, 20, 600, 350)

        // download the PDF
        pdf.save('Certificate.pdf')
      }
    }
  }
  shareCert() {
    return window.open(this.navUrl, '_blank')
  }

}
