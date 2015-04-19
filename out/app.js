var AppEntryPoint = (function () {
    function AppEntryPoint() {
        this.container = null;
        this.map = null;
        this.yandexLayer = null;
        this.trafficEnabled = false;
        this.container = document.querySelector('.layout');
        this.map = window.L.map(this.container);
        this.map.setView([55.45, 37.37], 13);
        window.L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg').addTo(this.map);
        var button = document.createElement('button');
        button.innerHTML = 'Yandex.Traffic';
        this.container.appendChild(button);
        button.addEventListener('click', this.onClick_.bind(this));
    }
    AppEntryPoint.prototype.setTrafficLayerEnabled = function (enabled) {
        if (this.trafficEnabled === enabled) {
            return;
        }
        this.trafficEnabled = enabled;
        if (enabled) {
            var timestamp = (new Date()).getTime();
            this.yandexLayer = window.L.tileLayer('https://jgo.maps.yandex.net/1.1/tiles?l=trf&lang=ru_RU&x={x}&y={y}&z={z}&tm=' + timestamp).addTo(this.map);
        }
        else {
            this.map.removeLayer(this.yandexLayer);
        }
    };
    AppEntryPoint.prototype.onClick_ = function (evt) {
        evt.preventDefault();
        this.setTrafficLayerEnabled(!this.trafficEnabled);
    };
    AppEntryPoint.init = function () {
        return new AppEntryPoint();
    };
    return AppEntryPoint;
})();
//# sourceMappingURL=app.js.map