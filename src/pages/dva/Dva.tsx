import React, { useState } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';

// mapStateToProps
export default connect(({ dvaTest }) => {
  return dvaTest;
})(({ list, dispatch }: any) => {
  const [list_, setList] = useState([]);
  const api = () => {
    dispatch({
      type: 'dvaTest/list',
      payload: {
        id: 3,
      },
      callback: res => {
        setList(res);
        console.log(res);
        console.log('callback:', res);
      },
    });
  };
  return (
    <div>
      <Button onClick={api}>dva</Button>

      {'list'}
      {list}
      <br />
      {'list_'}
      {list_}
    </div>
  );
});
