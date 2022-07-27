declare namespace qq.maps {
  class Size {
    constructor(width: number, height: number);
    width: number;
    height: number;

    equals(other: Size): boolean;
    /**
     *
     */
    getWidth(): number;
    getHeight(): number;
    toString(): string;
    clone(): Point;
  }

  class Point {
    constructor(x: number, y: number);

    width: number;
    height: number;

    equals(other: Point): boolean;
    getX(): number;
    getY(): number;
    toString(): string;
    clone(): Point;
  }

  class Color {
    constructor(r: number, g: number, b: number, alpha?: number);

    toRGB(): string;

    toRGBA(): string;

    toHex(): string;

    static fromHex(hex: string, alpha?: number): qq.maps.Color;
  }

  class LatLng {
    constructor(lat: number, lon: number);
    /**
     * 返回纬度值。
     * */
    getLat(): number;
    /**
     * 返回经度值
     * */
    getLng(): number;
    toString(): string;
    clone(): LatLng;
    /**
     * 比较两个经纬度坐标是否相等。
     * */
    equals(other: LatLng): boolean;
  }

  interface MouseEvent {
    latLng: qq.maps.LatLng;
    pixel: qq.maps.Point;
  }

  class LatLngBounds {
    constructor(sw: qq.maps.LatLng, ne: qq.maps.LatLng);
    /**
     * 获取该范围的中心点坐标。
     * */
    getCenter(): LatLng;
    /**
     * 获取该范围的东北角坐标。
     * */
    getNorthEast(): LatLng;
    /**
     * 获取该范围的西南角坐标。
     * */
    getSouthWest(): LatLng;
    /**
     * 扩展该范围边界，以包含指定的坐标点。
     * */
    extend(lonlat: LatLng): LatLngBounds;
    /**
     * 扩展该范围边界，以包含指定的一个矩形范围
     * */
    union(): LatLngBounds;
    union(): boolean;
    /**
     * 比较两个矩形范围是否完全相等。
     * */
    equals(other: LatLngBounds): boolean;
    /**
     * 判断该范围是否为空。
     * */
    isEmpty(): boolean;
    /**
     * 判断指定的坐标是否在这个范围内。
     * */
    contains(lonlat: LatLng): boolean;
    /**
     * 转换为字符串表示。
     * */
    toString(): string;
  }

  class convertor {
    /**
     * 将其他地图服务商的坐标批量转换成腾讯地图经纬度坐标
     * @param {qq.maps.LatLng|qq.maps.Point|Array<qq.maps.LatLng>|Array<qq.maps.Point>} points
     * @param {qq.maps.convertType} type
     * @param {(e} callback
     */
    static translate(
      points: qq.maps.LatLng | qq.maps.Point | Array<qq.maps.LatLng> | Array<qq.maps.Point>,
      type: qq.maps.convertType,
      callback: (e: Array<qq.maps.LatLng>) => void
    ): void;
  }

  const enum convertType {
    /** gps经纬度 */
    gps = 1,
    /** 搜狗经纬度 */
    sogou = 2,
    /** 百度经纬度 */
    baidu = 3,
    /** mapbar经纬度 */
    mapbar = 4,
    /** google */
    google = 5,
    /** 搜狗墨卡托 */
    sogoMercator = 6,
  }

  class Geocoder {
    constructor(options?: GeocoderOptions);
    /**
     * 根据指定的坐标进行解析
     * @param {qq.maps.LatLng} v
     */
    getAddress(v: qq.maps.LatLng): void;
    /**
     * 根据指定的地址进行解析
     * @param {string} v
     */
    getLocation(v: string): void;
    /**
     * 设置检索成功后的回调函数
     * @param {(result} callback
     */
    setComplete(callback: (result: {}) => void): void;
    /**
     * 设置检索失败后的回调函数
     * @param {function} callback
     */
    setError(callback: (err: {}) => void): void;
  }

  interface GeocoderOptions {
    // complete?: (result: baseServiceResult<GeoInfo>) => void;
    error?: () => void;
  }

  interface GeoInfo {
    /** 地址详细描述文字 */
    address: string;
    /** 描述地址的层次结构的对象 */
    addressComponents: addressComponents;
    /** 地理坐标点 */
    location: qq.maps.LatLng;
    /** 附近的poi点 */
    // nearPois: qq.maps.Poi[];
    /** 查询字符串与查询结果的相似度。数值值越接近1，查询结果越准确。 */
    similarity: number;
    /** 结果与查询的行政区划冲突。
     * 返回值：
     * 0：全部一致；
     * 1：区不一致；
     * 2：市不一致；
     * 3：省不一致；
     * 4：查询中无行政区划信息。 */
    pcd_conflict_flag: number;
    /** 数据类型。
     * 返回值：
     * 1：行政区划中心点；
     * 2：道路中心点；
     * 3：道路交叉口；
     * 4：估算的门址数据；
     * 5：POI（如银科大厦、第三极书局这种类型的）；
     * 6：门址。 */
    gps_type: number;
  }

  interface addressComponents {
    /** 门牌号码 */
    streetnumber: string;
    /** 街道名称 */
    street: string;
    /** 区县名称 */
    district: string;
    /** 城市名称 */
    city: string;
    /** 省份名称 */
    province: string;
    /** 国家 */
    country: string;
  }

  class Map {
    constructor(container: HTMLDivElement | string, options?: MapOptions);
    fitBounds(bounds: LatLngBounds): void;
    getBounds(): LatLngBounds;
    getCenter(): LatLng;
    getZoom(): number;
    getContainer(): HTMLDivElement;
    getMapTypeId(): MapTypeId;
    getProjection(): any;
    panBy(x: number, y: number): void;
    zoomBy(zoom: number): void;
    panTo(lonlat: LatLng): void;
    zoomTo(zoom: number): void;
    setCenter(point: LatLng): void;
    setZoom(zoom: number): void;
    setMapTypeId(v: MapTypeId): void;
    setOptions(options: MapOptions): void;
  }

  enum MapTypeId {
    /**
     * 该地图类型显示普通的街道地图。
     */
    ROADMAP,
    /**
     * 该地图类型显示卫星图像。
     */
    SATELLITE,
    /**
     * 该地图类型显示卫星图像上的主要街道透明层。
     */
    HYBRID,
  }

  enum ControlPosition {
    TOP_LEFT,
    TOP_CENTER,
    TOP_RIGHT,
    BOTTOM_LEFT,
    BOTTOM_CENTER,
    BOTTOM_RIGHT,
    LEFT_TOP,
    LEFT_CENTER,
    LEFT_BOTTOM,
    RIGHT_TOP,
    RIGHT_CENTER,
    RIGHT_BOTTOM,
    CENTER,
  }

  interface MapOptions {
    minZoom?: number;
    maxZoom?: number;
    center?: qq.maps.LatLng;
    zoom?: number;
    noClear?: boolean;
    backgroundColor?: string;
    boundary?: qq.maps.LatLngBounds;
    draggableCursor?: string;
    draggingCursor?: string;
    mapTypeId?: MapTypeId;
    draggable?: boolean;
    scrollwheel?: boolean;
    disableDoubleClickZoom?: boolean;
    keyboardShortcuts?: boolean;
    mapTypeControl?: boolean;
    mapTypeControlOptions?: MapTypeControlOptions;
    panControl?: boolean;
    panControlOptions?: PanControlOptions;
    zoomControl?: boolean;
    zoomControlOptions?: ZoomControlOptions;
    scaleControl?: boolean;
    scaleControlOptions?: ScaleControlOptions;
  }

  interface MapTypeControlOptions {
    mapTypeIds: Array<qq.maps.MapTypeId> | Array<string>;
    position: ControlPosition;
  }

  interface PanControlOptions {
    position: ControlPosition;
  }

  interface ZoomControlOptions {
    position?: ControlPosition;
    style?: ZoomControlStyle;
  }

  interface ScaleControlOptions {
    position: ControlPosition;
  }

  enum ZoomControlStyle {
    DEFAULT,
    LARGE,
    SMALL,
  }
}
