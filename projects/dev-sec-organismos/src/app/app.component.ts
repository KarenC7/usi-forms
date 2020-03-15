import { Component, ɵɵclassMapInterpolate2 } from '@angular/core';
import { SharepointIntegrationService } from 'shared-lib';
import { forkJoin } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'dso-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  htmlData: any;
  myObject={
    loc1: null
  };

  selectedData: any;

  title = 'dev-sec-organismos';
  banner: any;
  cutCadena: String= "";
  url= "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3695.3752999144594!2d-101.00049158521603!3d22.149781785401974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842a98b4a4a3f9e7%3A0xc148093122c246d6!2sAv%20Venustiano%20Carranza%2C%20San%20Luis%2C%20S.L.P.!5e0!3m2!1ses-419!2smx!4v1584232624852!5m2!1ses-419!2smx";
  data: any;



  constructor(
    private sanitizer: DomSanitizer,
    private sis: SharepointIntegrationService
  ) { }

  ngOnInit() {
    this.loadSecretariate();
    this.htmlData = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3695.3752999144594!2d-101.00049158521603!3d22.149781785401974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842a98b4a4a3f9e7%3A0xc148093122c246d6!2sAv%20Venustiano%20Carranza%2C%20San%20Luis%2C%20S.L.P.!5e0!3m2!1ses-419!2smx!4v1584232624852!5m2!1ses-419!2smx";

  }


  convert(map){
    return map.slice(3, -2);
  }

  private loadSecretariate() {
    const data2 = {
      select: [
      'Descripcion','Enlace','Id','Oficina','Orden','PalabrasClave',
      'Siglas','Telefono','Telefonos','Title','Website',

      'Facebook','Instagram','Whatsapp','Twitter','Youtube',

      'Calle1','CodigoPostal1','Colonia1','Direccion1','Estado1',
      'Municipio1','Numero1','Ubicacion1',
      'Calle2','CodigoPostal2','Colonia2','Direccion2','Estado2',
      'Municipio2','Numero2','Ubicacion2',

    ],
      orderBy: 'Orden',
      top: 20
    };



    this.sis.read('Secretaria', data2)
      .pipe(
        map((response: any) =>
          response.value.map(r => {

            this.htmlData=r.Ubicacion1;
            return {
              created: new Date(r.Created),
              description: r.Descripcion,
              id: r.Id,
              keywords: r.PalabrasClave,
              letters: r.Siglas,
              link: r.Enlace,
              office: r.Oficina,
              order: r.Orden,
              phones: r.Telefonos,
              telephone: r.Telefono,
              title: r.Title,
              website: r.Website,

              fb: r.Facebook,
              in: r.Instagram,
              tw: r.Twitter,
              yt: r.Youtube,
              wa: r.Whatsapp,

              address1: r.Direccion1,
              address2: r.Direccion2,
              colony1: r.Colonia1,
              colony2: r.Colonia2,
              location1: r.Ubicacion1,
              location2: r.Ubicacion2,
              number1: r.Numero1,
              number2: r.Numero2,
              state1: r.Estado1,
              state2: r.Estado2,
              street1: r.Calle1,
              street2: r.Calle2,
              town1: r.Municipio1,
              town2: r.Municipio2,
              zc1: r.CodigoPostal1,
              zc2: r.CodigoPostal2,
            };
          })
        )
      ).subscribe(response => {
        this.data = response;

      });

  }


  OnClick(item){
    alert("woro");
    this.selectedData=item;
  }

  cut(cadena){
    this.cutCadena=cadena+'hola';
  }



}

