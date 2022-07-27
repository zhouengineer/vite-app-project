import { Toast } from 'antd-mobile';

const qqMap = {
  /*
   * 获取当前位置信息：经纬度、地址描述
   * @return { lat, lng, visitAddr }
   */
  getLocation: () => {
    const location: { [propsName: string]: any } = {};

    return new Promise((resolve, reject) => {
      if (process.env.NODE_ENV !== 'development' || process.env.WX_JS_SDK_ENABLED) {
        try {
          window.$log('定位中...', window.wx.getLocation);
          window.wx.getLocation &&
            window.wx.getLocation({
              type: 'wgs84', // 默认为wgs84的gps坐标
              success: (res: { latitude: number; longitude: number }) => {
                const tarLat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                const tarLng = res.longitude; // 经度，浮点数，范围为180 ~ -180
                window.$log('当前位置', tarLat, tarLng);

                const latlng = new qq.maps.LatLng(tarLat, tarLng);
                // 调用地图命名空间中的转换接口   type的可选值为 1:GPS经纬度，2:搜狗经纬度，3:百度经纬度，4:mapbar经纬度，5:google经纬度，6:搜狗墨卡托
                qq.maps.convertor.translate(latlng, 1, (res: any) => {
                  // 获取腾讯经纬度并且赋值
                  window.$log('转换腾讯经纬度', res);
                  const { lat, lng } = res[0];
                  location.lat = lat;
                  location.lng = lng;

                  // 根据经纬度逆解析地址描述
                  const geocoder = new qq.maps.Geocoder();
                  geocoder.getAddress(new qq.maps.LatLng(lat, lng));
                  // 转换成功
                  geocoder.setComplete((result: { [propsName: string]: any }) => {
                    window.$log('根据经纬度逆解析地址描述', result);
                    const { address, addressComponents } = result.detail;
                    location.visitAddr = address;
                    location.addressComponents = addressComponents;
                    resolve(location);
                  });
                  // 转换失败
                  geocoder.setError((err: {}) => {
                    window.$log('转换地址失败', err);
                    reject(err);
                  });
                });
              },
              cancel: (res: {}) => {
                Toast.info('该功能需要您授权位置信息');
                window.$log(`用户取消：${JSON.stringify(res)}`);
                reject(new Error(res ? `${JSON.stringify(res)}` : '未知错误 [from window.wx.getLocation]'));
              },
              fail: (err: {}) => {
                window.$log(`定位失败：${JSON.stringify(err)}`);
                reject(err);
              },
            });
        } catch (err) {
          reject(new Error('定位api调用失败'));
        }
      } else {
        reject(new Error('本地开发不支持定位'));
      }
    });
  },
};
// 获取当前地理位置
const getCurrentLocation = async () => {
  window.$log('定位初始化');
  try {
    const location = (await qqMap.getLocation()) || {};
    Toast.hide();
    window.$log('%c  获取定位信息location:', 'color: #0e93e0;background: #aaefe5;', location);
    return [location, null];
  } catch (err) {
    Toast.hide();
    return [null, err];
  }
};

export default qqMap;
export { getCurrentLocation };
