import { Component,  OnInit } from '@angular/core';
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
  banner: any;

  constructor(
    private sis: SharepointIntegrationService
  ) { }

  ngOnInit() {
    this.loadBanner();
  }


  private loadBanner() {
    const data = {
      select: ['Id', 'Title', 'Orden', 'Descripcion', 'Enlace', 'Imagen', 'Subtitulo', 'Activarboton', 'Palabrasclave', 'Dependencia',
              'Textodelboton', 'Posiciontexto', 'Enlaceboton', 'Activartitulo'],
      orderBy: 'Orden',
      top: 20
    };

    this.sis.read('Banner', data)
      .pipe(
        map((response: any) =>
          response.value.map(r => {
            return {
              created: new Date(r.Created),
              id: r.Id,
              image: null,
              title: r.Title,
              description: r.Descripcion,
              enlace: r.Enlace,
              subtitulo: r.Subtitulo,
              activarBoton: r.Activarboton,
              dependencia: r.Dependencia,
              textoBoton: r.Textodelboton,
              posicionTexto: r.Posiciontexto,
              enlaceBoton: r.Enlaceboton,
              activarTitulo: r.Activartitulo,
            };
          })
        )
      )
      .subscribe(response => {
        this.banner = response;

        this.loadImages();
      });
  }

  private loadImages() {
    const data = {
      select: ['Imagen']
    };
    const requests = [];

    this.banner.forEach(n => {
      requests.push(
        this.sis.read('Banner', data, n.id)
      );
    });

    forkJoin(requests)
      .pipe(
        first()
      )
      .subscribe((response: any) => {
        response.forEach((r, index) => {
          this.banner[index].image = r.Imagen;
        });
      });
  }
}
