import React from 'react';
import Doge from 'assets/image/doge.png';
import LoginContent from 'components/organisms/LoginContent';
import * as S from './style';

export default function LoginTemplate(): JSX.Element {
  return (
    <S.Container>
      <S.Img src={Doge} alt="Doge" />
      <LoginContent />
    </S.Container>
  );
}