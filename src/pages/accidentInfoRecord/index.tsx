import React, { useEffect, useState } from 'react';
import './index.less';
import logo_login from '@/assets/image/common/logo_login.png';
import erWei_code from '@/assets/image/common/er_wei_code.png';
import ajax from '@/utils/ajax';
import { Toast } from 'antd-mobile';
import { getUrlQueryString } from '@/utils';
const AccidentInfoRecord = () => {
  const [dataInfo, setDataInfo] = useState({
    insureName: 'XXXXXX',
    licensePlate: '1234356',
    driverName: '州州长',
    accidentDatetime: '2022-12-31 12:22:33',
    accidentAddress: '是否是放松放松的发舒服舒服',
    urls: [],
  });
  const getDataInfo = async () => {
    Toast.loading('Loading...');
    const id = getUrlQueryString(window.location.search, 'id');
    const res = await ajax({
      api: 'common.getAccidentDetail',
      params: { id },
      isLoading: true,
    });
    console.log('res', res);

    const { data, code, success } = res.data;
    if (code === 200 && success) {
      Toast.hide();
      setDataInfo(data);
    } else {
      Toast.fail(data.msg, 3);
    }
  };
  useEffect(() => {
    document.title = '事故信息记录';
    getDataInfo();
  }, []);
  const { insureName, licensePlate, driverName, accidentDatetime, accidentAddress, urls } = dataInfo;
  return (
    <div className="accidentInfoRecord">
      <div className="info-style">
        <div className="in">
          <div className="info-item carNum">{licensePlate}</div>
          <div className="info-item company">
            <span className="label">企业：</span>
            {insureName || '无'}
          </div>
          <div className="info-item">
            <span className="label">驾驶员：</span>
            {driverName || '无'}
          </div>
          <div className="info-item">
            <span className="label">事故发生时间：</span>
            {accidentDatetime || '无'}
          </div>
          <div className="info-item bottom">
            <span className="label">事故发生地址：</span>
            {accidentAddress || '无'}
          </div>
          <div className="img-style">
            <img src={erWei_code} />
          </div>
        </div>
      </div>
      <div className="content-style">
        <div className="in">
          {urls.length > 0 &&
            urls.map((item: any) => {
              const { type, url, attType } = item;
              if (type === 'png') {
                return (
                  <div className="item-styles">
                    <img key={attType} src={url} />
                  </div>
                );
              }
              if (type === 'mp4') {
                return (
                  <div className="item-styles">
                    <video key={attType} src={url} controls />
                  </div>
                );
              }
              return null;
            })}
        </div>
      </div>
      <div className="company-cont">
        <img className="logo" src={logo_login} />
        由民太安智能科技提供技术支持
      </div>
    </div>
  );
};

export default AccidentInfoRecord;
