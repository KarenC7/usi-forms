import { Component, OnInit } from '@angular/core';
import { SharepointIntegrationService } from 'shared-lib';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { map, first } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  identidad: any;
  // images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/900/500`);

  constructor(
    private sis: SharepointIntegrationService
  ) { }

  ngOnInit() {
    this.loadIdentidad();
  }


  private loadIdentidad() {
    const data = {
      select: ['Id', 'Title', 'Imagen', 'Logo', 'Principal']
    };

    this.sis.read('Encabezado', data)
      .pipe(
        map((response: any) =>
          response.value.map(r => {
            return {
              created: new Date(r.Created),
              id: r.Id,
              image: null,
              title: r.Title,
              logo: null,
              principal: r.Principal
            };
          })
        )
      )
      .subscribe(response => {
        this.identidad = response;

        this.loadImages();
      });
  }

  private loadImages() {
    const data = {
      select: ['Imagen', 'Logo']
    };
    const requests = [];

    this.identidad.forEach(n => {
      requests.push(
        this.sis.read('Encabezado', data, n.id)
      );
    });

    forkJoin(requests)
      .pipe(
        first()
      )
      .subscribe((response: any) => {
        response.forEach((r, index) => {
          this.identidad[index].image = r.Imagen;
          this.identidad[index].logo = r.Logo;
        });
      });
  }

}
