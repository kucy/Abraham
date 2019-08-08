import Taro from "@tarojs/taro";
import { getBaiDuToken } from "@/client";
import { baseUrl } from "./consts";

export default class TaroSdk {
  static chooseImage() {
    return new Promise(resolve => {
      Taro.chooseImage({
        count: 1, // 默认9
        sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"] // 可以指定
      }).then(res => {
        const tempFilePaths = res.tempFilePaths;
        resolve(tempFilePaths[0]);
      });
    });
  }

  static uploadFile(token, path) {
    return new Promise(resolve => {

      Taro.uploadFile({
        url: `${baseUrl}/image/upload`,
        name: "file",
        fileName: 'file',
        filePath: path,
        fileType: 'image',
        formData: {
          token: token
        },
      }).then(result => {
        resolve(result);
      }).catch(err => {
        console.log('上传图片失败：', err)
        resolve({
          result: []
        })
      });
    });
  }
  static aiPhoto(params) {
    return new Promise(resolve => {
      this.uploadFile(params.token, params.file).then(res => {
        const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
        resolve(data);
      });
    });
  }

  static getBaiduToken() {
    getBaiDuToken().then(res => {
      Taro.setStorageSync("access_token", res.access_token);
      Taro.setStorageSync("time", new Date().getTime());
    });
  }
}
