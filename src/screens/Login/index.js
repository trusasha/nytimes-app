import React, { useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { View } from 'react-native';
import useStyles from './useStyles';
import LabeledInput from 'components/LabeledInput';
import Button from 'components/Button';
import useNavigate from 'hooks/useNavigate';
import { configStore } from 'stores';

const Login = () => {
  const R = configStore.routeNameLocalization;
  const S = useStyles();
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [pass, setPass] = useState('');

  const disabled = false;

  const onSubmit = useCallback(() => {
    navigate(R.Home);
  }, [R.Home, navigate]);

  return (
    <View style={S.container}>
      <LabeledInput containerStyle={S.input} label="Login" value={login} onChangeText={setLogin} />
      <LabeledInput containerStyle={S.input} label="Password" value={pass} onChangeText={setPass} />
      <Button disabled={disabled} title="Submit" onPress={onSubmit} />
    </View>
  );
};

export default observer(Login);
