import React from 'react';
import ReuseBusinessTypes from './ReuseBusinessTypes';

type ID = { id: string };

export default function BusinessHomeComponent({ id }: ID) {
  return (
    <>
      <ReuseBusinessTypes id={id} busType={'restaurants'} />
      <ReuseBusinessTypes id={id} busType={'groceries'} />
      <ReuseBusinessTypes id={id} busType={'pharmacies'} />
      <ReuseBusinessTypes id={id} />
    </>
  );
}
