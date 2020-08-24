import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
interface Dva1Props {
  [paramsName: string]: any;
}
interface Dva1State {
  [paramsName: string]: any;
}

@connect(({ dvaTest }) => {
  return dvaTest;
})
class Dva1 extends Component<Dva1Props, Dva1State> {
  constructor(props: Dva1Props) {
    super(props);
    this.state = { list: [] };
  }
  componentDidMount() {
    this.api();
  }
  render() {
    return (
      <>
        <div>{this.state.list}</div>
      </>
    );
  }
  api = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dvaTest/list',
      payload: {
        id: 3,
      },
      callback: res => {
        this.setState({ list: res });
      },
    });
  };
}
export default Dva1;
