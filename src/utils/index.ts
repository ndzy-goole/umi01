import { getFileList } from '../service/common';
import { message } from 'antd';
export function viewTag(txt: string | number) {
  let _txt = txt;
  const num = Number(txt);
  if (num >= 10000) {
    _txt = '1w+';
  } else if (num >= 10000) {
    _txt = '999+';
  }
  return _txt;
}
export function renderText(text: string | number) {
  return !text && (text !== 0) ? '--' : text;
}
// caseFileType (integer, optional): 附件类型（0:工单附件；1:回复附件; 2:交接班附件）
export function downloadApi(caseFileType: number, data: { [key: string]: any }) {
  const params = {
    caseFileType,
    caseId: data.id
  };
  getFileList(params).then((res: any) => {
    if (res && res.length === 0) {
      message.info('无附件');
      return;
    }
    res.map((item: any) => {
      download(item);
      return null;
    });
  });
}
export function download(file: any) {
  const { filePath, fileName } = file;
  var a = document.createElement('a');
  const url = filePath.indexOf('http') !== -1 ? filePath : window.customConfig.uploadURL + 'cfs/' + filePath;
  a.href = url + '?dn=' + fileName;
  a.download = fileName;
  var userAgent = navigator.userAgent;
  if (userAgent.indexOf('Chrome') > -1) {
    a.click();
  } else {
    window.location.href = url;
  }
}

declare var window: {
  customConfig: {
    uploadURL: string
  },
  location: { [key: string]: any }
};