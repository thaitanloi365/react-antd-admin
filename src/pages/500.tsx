import React from 'react';
import { Page } from 'components';
import { Result } from 'antd';

const Error = () => (
  <Page inner>
    <Result status="500" title="500" subTitle="Sorry, the server is wrong." />
  </Page>
);

export default Error;
