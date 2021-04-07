import React from 'react';
import { PopupContainer } from './Container/PopupContainer';
import { Auth } from '@scrapper-gate/shared-frontend/domain/auth';

export const Popup = () => {
  return (
    <PopupContainer height="500px" width="350px">
      <Auth btnSectionWidth="100%" />
    </PopupContainer>
  );
};
