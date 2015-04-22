var GeoApp;
(function (GeoApp) {
    var App = (function () {
        function App() {
            this.container = null;
            this.map = null;
            this.yandexLayer = null;
            this.trafficEnabled = false;
            this.container = document.querySelector('.layout');
            this.map = window.L.map(this.container);
            this.map.setView([55.75, 37.65], 10);
            window.L.tileLayer('http://otile4.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg', {
                reuseTiles: true
            }).addTo(this.map);
            var button = document.createElement('button');
            button.innerHTML = 'Yandex.Traffic';
            this.container.appendChild(button);
            button.addEventListener('click', this.onClick_.bind(this));
        }
        App.prototype.setTrafficLayerEnabled = function (enabled) {
            if (this.trafficEnabled === enabled) {
                return;
            }
            this.trafficEnabled = enabled;
            if (enabled) {
                this.yandexLayer = window.L.tileLayer.canvas();
                this.yandexLayer.drawTile = function (canvas, tilePoint, zoom) {
                    var ctx = canvas.getContext("2d");
                    var image = new Image();
                    var latLng = MapUtils.tileToLatLng(tilePoint.x + 0.5, tilePoint.y + 0.5, zoom);
                    image.src = [
                        'http://static-maps.yandex.ru/1.x/?l=trf&lang=ru_RU',
                        '&ll=',
                        [latLng[1], latLng[0]].join(','),
                        '&z=',
                        zoom,
                        '&size=256,256',
                        '&tm=',
                        (new Date).getTime()
                    ].join('');
                    image.onload = function (evt) {
                        ctx.drawImage(image, 0, 0, 256, 256);
                    };
                }.bind(this);
                this.yandexLayer.addTo(this.map);
            }
            else {
                this.map.removeLayer(this.yandexLayer);
            }
        };
        App.prototype.onClick_ = function (evt) {
            evt.preventDefault();
            this.setTrafficLayerEnabled(!this.trafficEnabled);
        };
        App.init = function () {
            return new App;
        };
        return App;
    })();
    GeoApp.App = App;
    var MapUtils = (function () {
        function MapUtils() {
        }
        MapUtils.latLngToTile = function (lat, lng, zoom) {
            return [
                (Math.ceil((lng + 180) / 360 * Math.pow(2, zoom))),
                (Math.ceil((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)))
            ];
        };
        MapUtils.tileToLatLng = function (x, y, zoom) {
            var n = Math.PI - 2 * Math.PI * y / Math.pow(2, zoom);
            return [
                (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))),
                (x / Math.pow(2, zoom) * 360 - 180)
            ];
        };
        return MapUtils;
    })();
})(GeoApp || (GeoApp = {}));
//# sourceMappingURL=app.js.map