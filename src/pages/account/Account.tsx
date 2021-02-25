import './account.css';

import React, { FC, useEffect, useState } from 'react';
import b_ from 'b_';
import { useAsyncAction, useAuth } from '../../hooks';
import { AccountForm } from './Components/Form/AccountForm';
import { Box, Button, FormExtendedEvent, Main } from 'grommet';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '../../store/selectors';
import { asyncAccountActions } from './asyncActions';
import { AccountFormFields, AvatarFormFields, PasswordFormFields } from './types';
import { UserObject } from '../../api/schema';
import { AvatarForm } from './Components/Form/AvatarForm';
import { LoadingOverlay } from '../../components/LoadingOverlay/LoadingOverlay';
import { getText } from '../../common/langUtils';
import { ChangePassword } from './Components/Form/ChangePassword';

const block = b_.lock('account');

const initPasswordFormFields = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const prepareProfileForm = (user: UserObject): AccountFormFields => {
  const formFields = Object.assign({}, user) as AccountFormFields;
  // убираем из телефона все кроме цифр
  let digits = formFields.phone.replace( /\D/g, '');
  // форматируем для MaskedInput
  formFields.phone = digits.replace(/^(\d)(\d{3})(\d{3})/, '$1 ($2) $3-');

  if (!formFields.display_name) {
    formFields.display_name = '';
  }
  return formFields;
};

export const Account: FC = () => {
  useAuth();

  const updateProfile = useAsyncAction(asyncAccountActions.updateProfile);
  const updateAvatar = useAsyncAction(asyncAccountActions.updateAvatar);
  const updatePassword = useAsyncAction(asyncAccountActions.updatePassword);

  const currentUser = useSelector(getCurrentUser);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);
  const [profileFormFields, setProfileFormFields] = useState<AccountFormFields>(prepareProfileForm(currentUser));
  const [passwordFormFields, setPasswordFormFields] = useState<PasswordFormFields>(initPasswordFormFields);

  const onPasswordFieldsChange = (value: PasswordFormFields) => { setPasswordFormFields(value); };

  const onFieldsChange = (value: AccountFormFields) => setProfileFormFields(value);

  const onProfileReset = () => setProfileFormFields(prepareProfileForm(currentUser));

  const onProfileSubmit = ({ value }: FormExtendedEvent<AccountFormFields>) =>{
    // TODO добавить уведомления
    setIsLoading(true);
    updateProfile(value)
      .then(() => {
        setIsLoading(false);
        console.log('SAVED');
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMessage(error.message);
      });
  };

  const onSaveAvatar = (value: AvatarFormFields) =>{
    // TODO добавить уведомления
    setIsLoading(true);
    const formData = new FormData();
    formData.append('avatar', value.avatarFileInput);
    updateAvatar(formData)
      .then(() => {
        setIsLoading(false);
        console.log( getText('avatar_form_success_notification'));
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMessage(error.message);
      });
  };

  const onPasswordSubmit = ({ value }: FormExtendedEvent<PasswordFormFields>) =>{
    // TODO добавить уведомления
    setIsLoading(true);
    setShowPasswordModal(false);
    updatePassword(value)
      .then(() => {
        setIsLoading(false);
        console.log( getText('password_form_success_notification'));
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMessage(error.message);
      });
  };

  useEffect(() => {
    if (currentUser) {
      setIsLoading(false);
    }
  }, [currentUser]);

  return (
    <div className={block()}>
      <LoadingOverlay isLoading={isLoading}>
        <Main justify="center" align="center" pad={{ top: 'large' }}>
          <AvatarForm
            onSaveAvatar={onSaveAvatar}
            avatarUrl={currentUser.avatar || ''}
          />
          <AccountForm
            fields={profileFormFields}
            onChange={onFieldsChange}
            onSubmit={onProfileSubmit}
            onReset={onProfileReset}
            errorMessage={errorMessage}
          />
          <Box className={block('form')}>
            <Button
              margin={{ vertical: 'small' }}
              label={getText('change_password_button')}
              onClick={() => setShowPasswordModal(true)}
            />
          </Box>
        </Main>
        {showPasswordModal &&
          <ChangePassword
            fields={passwordFormFields}
            onSubmit={onPasswordSubmit}
            onChange={onPasswordFieldsChange}
            onClose={setShowPasswordModal}
          />}
      </LoadingOverlay>
    </div>
  );
};
