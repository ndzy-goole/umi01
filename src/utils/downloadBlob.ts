type FileType = 'xlsx' | 'csv';

export function downloadBlob(
  blobData: any,
  fileType: FileType,
  fileName: string
) {
  const url = window.URL.createObjectURL(blobData);
  if (window.navigator.msSaveBlob) {
    try {
      window.navigator.msSaveBlob(blobData, `${fileName}.${fileType}`);
    } catch (e) {
      console.log(e);
    }
  } else {
    // 谷歌浏览器 创建a标签 添加download属性下载
    const downloadElement = document.createElement('a');
    downloadElement.href = url;
    downloadElement.target = '_blank';
    downloadElement.download = `${fileName}.${fileType}`; //下载后文件名
    document.body.appendChild(downloadElement);
    downloadElement.click(); //点击下载
    document.body.removeChild(downloadElement); //下载完成移除元素
    window.URL.revokeObjectURL(url); //释放掉blob对象
  }
}
