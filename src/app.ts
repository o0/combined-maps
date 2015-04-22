module GeoApp {
  export class App {
    private container: Element = null;
    private map = null;
    private yandexLayer = null;
    private trafficEnabled:boolean = false;

    constructor() {
      this.container = document.querySelector('.layout');
      this.map = window.L.map(this.container);
      this.map.setView([55.75, 37.65], 10);

      window.L.tileLayer('http://otile4.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg', {
        reuseTiles: true
      }).addTo(this.map);

      var button: HTMLButtonElement = document.createElement('button');
      button.innerHTML = 'Yandex.Traffic';
      this.container.appendChild(button);

      button.addEventListener('click', this.onClick_.bind(this));
    }

    private setTrafficLayerEnabled(enabled: boolean) {
      if (this.trafficEnabled === enabled) {
        return;
      }

      this.trafficEnabled = enabled;

      if (enabled) {
        this.yandexLayer = window.L.tileLayer.canvas();
        this.yandexLayer.drawTile = function(canvas, tilePoint, zoom) {
          var ctx = canvas.getContext("2d");
          var image = new Image();
          var latLng = MapUtils.tileToLatLng(tilePoint.x + 0.5, tilePoint.y + 0.5, zoom);

          image.src = [
            // fixme: use this overlay url instead of Static API.
            //'https://jgo.maps.yandex.net/1.1/tiles?l=trf,trfe&s=&lang=ru_RU',
            //'&x=', tilePoint.x,
            //'&y=', tilePoint.y,

            'http://static-maps.yandex.ru/1.x/?l=trf&lang=ru_RU',
            '&ll=', [latLng[1], latLng[0]].join(','),
            '&z=', zoom,
            '&size=256,256',
            '&tm=', (new Date).getTime()
          ].join('');

          image.onload = function(evt) {
            ctx.drawImage(image, 0, 0, 256, 256);
          }
        }.bind(this);

        this.yandexLayer.addTo(this.map);
      } else {
        this.map.removeLayer(this.yandexLayer);
      }
    }

    private onClick_(evt: MouseEvent) {
      evt.preventDefault();
      this.setTrafficLayerEnabled(!this.trafficEnabled);
    }

    public static init(): App {
      return new App;
    }
  }

  class MapUtils {
    static latLngToTile(lat:number, lng: number, zoom:number):Array<number> {
      return [
        (Math.ceil((lng + 180) / 360 * Math.pow(2,zoom))),
        (Math.ceil((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)))
      ];
    }

    static tileToLatLng(x:number, y:number, zoom:number):Array<number> {
      var n = Math.PI - 2 * Math.PI * y / Math.pow(2, zoom);
      return [
        (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))),
        (x / Math.pow(2, zoom) * 360-180)
      ];
    }
  }
}
