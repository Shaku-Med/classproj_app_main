import React from 'react'
import getDev from './getDev'
// import * as dotenv from 'dotenv'

let myK = () => {
  try {
    let d = getDev()
    if (d) {
      let m = process.env.NODE_ENV
      let k5
      if (m === 'production') {
        k5 = process.env.OBMY
        console.log(k5)
      }
      function _0x4881(_0x17c47b,_0x523974){const _0x409f99=_0x409f();return _0x4881=function(_0x4881d8,_0x2d9c66){_0x4881d8=_0x4881d8-0xc0;let _0x550cd7=_0x409f99[_0x4881d8];return _0x550cd7;},_0x4881(_0x17c47b,_0x523974);}const _0x45af49=_0x4881;(function(_0x49ef33,_0x26ec0d){const _0x173adc=_0x4881,_0x381901=_0x49ef33();while(!![]){try{const _0x387b0c=parseInt(_0x173adc(0xce))/0x1*(-parseInt(_0x173adc(0xc1))/0x2)+parseInt(_0x173adc(0xcf))/0x3+parseInt(_0x173adc(0xc8))/0x4+-parseInt(_0x173adc(0xc3))/0x5+-parseInt(_0x173adc(0xca))/0x6+-parseInt(_0x173adc(0xc4))/0x7*(parseInt(_0x173adc(0xc7))/0x8)+parseInt(_0x173adc(0xc0))/0x9;if(_0x387b0c===_0x26ec0d)break;else _0x381901['push'](_0x381901['shift']());}catch(_0x392a9f){_0x381901['push'](_0x381901['shift']());}}}(_0x409f,0x72e97));let k1=_0x45af49(0xcc),k2=[_0x45af49(0xcd),_0x45af49(0xc6)],k3=[_0x45af49(0xc9)],k4=_0x45af49(0xcb);return''+k1+k2[_0x45af49(0xc2)]()[_0x45af49(0xc5)]('')+k3[_0x45af49(0xc5)]('')+k4+k5+'+'+d;function _0x409f(){const _0x3c03cc=['1540530mRCDKy','72962uwXLBP','reverse','686655HcxeUR','3032337PpYvEx','join','EBMlayQ','8XwvJJL','2376580MmnXdo','TemfuA','3070476OttOxv','kRI','cySMpRY','CTbdUDL','4vxbWPX','2800668vBslJh'];_0x409f=function(){return _0x3c03cc;};return _0x409f();}
    }
    else {
      return null
    }
  }
  catch (e) {
    return null
  }
};

export default myK
