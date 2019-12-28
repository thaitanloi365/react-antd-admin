import React from 'react';
import { Page } from 'components';
import { Result } from 'antd';

const Error = () => (
  <Page inner>
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
    />
  </Page>
);

export default Error;
