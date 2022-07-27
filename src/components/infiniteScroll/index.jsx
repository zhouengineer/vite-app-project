import BetterScroll from 'better-scroll';
import React, { Component } from 'react';
import './index.less';

export default class extends Component {
  componentDidMount = () => {
    const { pullingUp, pullingDown, onScroll } = this.props;
    const options = { ...this.props };
    if (pullingUp) {
      options.pullUpLoad = {
        threshold: 50,
      };
    }
    if (pullingDown) {
      options.pullDownRefresh = {
        threshold: 20,
      };
    }
    // console.log(options)
    const u = navigator.userAgent;
    const isXiaomi = u.indexOf('XiaoMi') > -1; // 小米手机
    const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios

    const transition = !(isIOS && !isXiaomi);
    // eslint-disable-next-line react/no-string-refs
    this.Bscroll = new BetterScroll(this.refs.scrollDom, {
      click: true,
      probeType: 1,
      useTransition: transition,
      mouseWheel: true,
      observeDOM: true,
      scrollbar: false,
      ...options,
    });

    if (pullingUp) {
      this.Bscroll.on('pullingUp', this.pullingUp);
    }
    if (pullingDown) {
      this.Bscroll.on('pullingDown', this.pullingDown);
    }
    if (onScroll) {
      this.Bscroll.on('scrollEnd', (pos) => this.props.onScroll(pos));
    }
  };

  componentDidUpdate() {
    this.Bscroll.refresh();
  }

  scrollTo = (x, y, time, easing, extraTransform) => {
    this.Bscroll.refresh();
    this.Bscroll.scrollTo(x, y, time, easing);
  };

  scrollToElement = (el, time, offsetX, offsetY, easing) => {
    this.Bscroll.stop();
    this.Bscroll.scrollToElement(el, time, offsetX, offsetY, easing);
  };

  pullingDown = () => {
    this.props
      .pullingDown()
      .then(() => {
        clearTimeout(this.refreshTimer);
        this.refreshTimer = setTimeout(() => {
          this.Bscroll.finishPullDown();
          this.Bscroll.refresh();
        }, 100);
      })
      .catch(() => {
        this.Bscroll.off('pullingDown', this.pullingDown);
      });
  };

  pullingUp = () => {
    this.props.pullingUp &&
      this.props
        .pullingUp()
        .then(() => {
          clearTimeout(this.refreshTimer);
          this.refreshTimer = setTimeout(() => {
            this.Bscroll.finishPullUp();
            this.Bscroll.refresh();
          }, 1000);
        })
        .catch(() => {
          this.Bscroll.off('pullingUp', this.pullingUp);
        });
  };

  componentWillUnmount = () => {
    this.Bscroll.off('pullingUp', this.pullingUp);
    this.Bscroll.off('pullingDown', this.pullingDown);
    this.Bscroll.destroy();
  };

  render = () => {
    const { id, showLoadEnd = false, children, className, scrollX, noInLine = false } = this.props;

    return (
      // eslint-disable-next-line react/no-string-refs
      <div className={`infinite-scroll ${className}`} ref="scrollDom" id={id}>
        <div
          style={{
            transitionDuration: '0ms',
            transform: 'translate(0px, 0px) scale(1) translateZ(0px)',
            transitionTimingFunction: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
          }}
          className={`infinite-scroll-inner ${scrollX && !noInLine ? 'inline-block' : ''}`}
          // eslint-disable-next-line react/no-string-refs
          ref="inner"
        >
          {children}
          {showLoadEnd ? <p className="show-load-end">已经到底啦</p> : null}
        </div>
      </div>
    );
  };
}
