class AppEntryPoint {
  private container: Element = null;
  private map = null;
  private yandexLayer = null;
  private trafficEnabled:boolean = false;

  constructor() {
    this.container = document.querySelector('.layout');
    this.map = window.L.map(this.container);
    this.map.setView([55.45, 37.37], 13);

    window.L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg').addTo(this.map);

    var button: HTMLButtonElement = document.createElement('button');
    button.innerHTML = 'Yandex.Traffic';
    this.container.appendChild(button);

    button.addEventListener('click', this.onClick_.bind(this));
  }

  public setTrafficLayerEnabled(enabled: boolean) {
    if (this.trafficEnabled === enabled) {
      return;
    }

    this.trafficEnabled = enabled;

    if (enabled) {
      var timestamp: number = (new Date()).getTime();
      this.yandexLayer = window.L.tileLayer('https://jgo.maps.yandex.net/1.1/tiles?l=trf&lang=ru_RU&x={x}&y={y}&z={z}&tm=' + timestamp).addTo(this.map);
    } else {
      this.map.removeLayer(this.yandexLayer);
    }
  }

  private onClick_(evt: MouseEvent) {
    evt.preventDefault();
    this.setTrafficLayerEnabled(!this.trafficEnabled);
  }

  public static init() {
    return new AppEntryPoint();
  }
}
