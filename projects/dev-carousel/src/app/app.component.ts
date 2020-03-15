import { Component, OnInit, Input } from '@angular/core';
import { SharepointIntegrationService } from 'shared-lib';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { map, first } from 'rxjs/operators';

@Component({
  selector: 'dc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  news: any;
  data = [];
  cards = [];
  aux = [];
  Pages = 0;
  itemsperPage = 8;
  bandBack = true;
  bandFwd = false;
  actualPage = 1;
  // @Input() id: number;

  slideConfig = { autoplay: false, slidesToShow: 2, slidesToScroll: 1, infinite: false, responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }
  ], };

  constructor(
    private sis: SharepointIntegrationService
  ) { }

  ngOnInit() {
    this.loadNews();
    // this.loadNews();
    const data = {
      select: ['Imagen', 'Id', 'Title', 'Created', 'fechaActualizacion', 'mesN', 'anio'],
      orderBy: 'anio,mesN',
      reverse: true,
      top: 5000
    };

    this.sis.read('IndiceNoticias', data).subscribe((response: any) => {
      console.log(response);
      this.data = response.value;
      console.log(this.data);
      this.getPages();
    });
  }

  private loadNews() {
    const data = {
      select: ['Id', 'Title', 'Created', 'Descripcion'],
      orderBy: 'Created',
      reverse: true,
      top: 20
    };

    this.sis.read('Noticias', data)
      .pipe(
        map((response: any) =>
          response.value.map(r => {
            return {
              created: new Date(r.Created),
              id: r.Id,
              image: null,
              title: r.Title,
              description: r.Descripcion,
            };
          })
        )
      )
      .subscribe(response => {
        this.news = response;

        this.loadImages();
      });
  }

  private loadImages() {
    const data = {
      select: ['Imagen']
    };
    const requests = [];

    this.news.forEach(n => {
      requests.push(
        this.sis.read('Noticias', data, n.id)
      );
    });

    forkJoin(requests)
      .pipe(
        first()
      )
      .subscribe((response: any) => {
        response.forEach((r, index) => {
          this.news[index].image = r.Imagen;
        });
      });
  }

  getPages() {
    if (this.data.length % this.itemsperPage > 0) {
      this.Pages = Math.floor(this.data.length / this.itemsperPage) + 1;
    } else {
       this.Pages = this.data.length / this.itemsperPage;
    }
    console.log('Pages: ' + this.Pages)
    this.fillArr();
  }

  fillArr() {
    const datePipe = new DatePipe('en-US');
    let cont = 0;
    for (let i = 0; i < this.data.length; i++) {
      this.data[i].fechaActualizacion = datePipe.transform(this.data[i].fechaActualizacion, "dd-MM-yyyy");
      this.aux.push(this.data[i]);
      cont = cont + 1;
      if(cont == this.itemsperPage) {
        cont = 0;
        this.cards.push(this.aux);

        this.aux = [];
      }
    }
    if(this.aux) {
      this.cards.push(this.aux);
    }
    console.log('cards');
    console.log(this.cards);
  }

  changeForward() {
    this.actualPage = this.actualPage + 1;
    this.bandBack = false;
    if (this.actualPage === this.Pages) {
      this.bandFwd = true;
    }
  }

  changeBack() {
    this.actualPage = this.actualPage - 1;
    this.bandFwd = false;
    if (this.actualPage === 1) {
      this.bandBack = true;
    }
  }
}
