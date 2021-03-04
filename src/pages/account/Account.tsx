import './account.css';
import b_ from 'b_';
import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { UserObject } from '@api/schema';
import { useSelector } from 'react-redux';
import { getText } from '@common/langUtils';
import { appActions } from '@store/reducer';
import { getCurrentUser } from '@store/selectors';
import { asyncAccountActions } from './asyncActions';
import { AvatarForm } from './Components/AvatarForm';
import { AccountForm } from './Components/AccountForm';
import { ChangePassword } from './Components/ChangePassword';
import { Box, Button, FormExtendedEvent, Main } from 'grommet';
import { useAction, useAsyncAction, useAuth } from '@common/hooks';
import { LoadingOverlay } from '@components/LoadingOverlay/LoadingOverlay';
import { NotificationStatus } from '@components/Notification/Notification';
import { AccountFormFields, AvatarFormFields, PasswordFormFields } from './types';

const block = b_.lock('account');

const initPasswordFormFields = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const prepareProfileFormFields = (user: UserObject): AccountFormFields => {
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

  const setNotification = useAction(appActions.setNotification);

  const updateProfile = useAsyncAction(asyncAccountActions.updateProfile);
  const updateAvatar = useAsyncAction(asyncAccountActions.updateAvatar);
  const updatePassword = useAsyncAction(asyncAccountActions.updatePassword);

  const currentUser = useSelector(getCurrentUser);

  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = React.useState(false);
  const [profileFormFields, setProfileFormFields] = useState<AccountFormFields>(prepareProfileFormFields(currentUser));
  const [passwordFormFields, setPasswordFormFields] = useState<PasswordFormFields>(initPasswordFormFields);

  const onPasswordFieldsChange = (value: PasswordFormFields) => { setPasswordFormFields(value); };

  const onProfileFieldsChange = (value: AccountFormFields) => setProfileFormFields(value);

  const onProfileReset = () => setProfileFormFields(prepareProfileFormFields(currentUser));

  const onProfileSubmit = ({ value }: FormExtendedEvent<AccountFormFields>) =>{
    setIsLoading(true);
    updateProfile(value)
      .then(() => {
        setIsLoading(false);
        setNotification({
          status: NotificationStatus.SUCCESS,
          message: getText('profile_form_success_notification'),
        });
      })
      .catch((error) => {
        setIsLoading(false);
        setNotification({
          status: NotificationStatus.ERROR,
          message: getText('profile_form_fail_notification'),
        });
        console.error(error);
      });
  };

  const saveAvatar = (value: AvatarFormFields) =>{
    if (!value.avatarFileInput) { return; }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('avatar', value.avatarFileInput);
    updateAvatar(formData)
      .then(() => {
        setIsLoading(false);
        setNotification({
          status: NotificationStatus.SUCCESS,
          message: getText('avatar_form_success_notification'),
        });
      })
      .catch((error) => {
        setIsLoading(false);
        setNotification({
          status: NotificationStatus.ERROR,
          message: getText('avatar_form_fail_notification'),
        });
        console.error(error);
      });
  };

  const onPasswordSubmit = ({ value }: FormExtendedEvent<PasswordFormFields>) =>{
    setIsLoading(true);
    updatePassword(value)
      .then(() => {
        setIsLoading(false);
        setShowPasswordModal(false);
        setNotification({
          status: NotificationStatus.SUCCESS,
          message: getText('password_form_success_notification'),
        });
      })
      .catch((error) => {
        setIsLoading(false);
        setNotification({
          status: NotificationStatus.ERROR,
          message: getText('password_form_fail_notification'),
        });
        console.error(error);
      });
    setPasswordFormFields(initPasswordFormFields);
  };

  const onAvatarChange = (value: ChangeEvent<HTMLInputElement>) => {
    if (!value.currentTarget.files || !(value.currentTarget.files[0] instanceof File)) {
      throw new Error('Cant find file input');
    }
    // проверяем что это действительно изображение
    const testImage = new Image();
    const file = value.currentTarget.files[0];

    testImage.onload = () => {
      saveAvatar({ avatarFileInput: file } );
    };

    testImage.onerror = () => {
      setNotification({
        status: NotificationStatus.ERROR,
        message: getText('avatar_form_image_error_notification'),
      });
    };

    testImage.src = URL.createObjectURL(file);
  };

  const openPasswordModal = () => {
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    setPasswordFormFields(initPasswordFormFields);
    setShowPasswordModal(false);
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
            onChange={onAvatarChange}
            avatarUrl={currentUser.avatar || ''}
          />
          <AccountForm
            fields={profileFormFields}
            onChange={onProfileFieldsChange}
            onSubmit={onProfileSubmit}
            onReset={onProfileReset}
          />
          <Box className={block('form')}>
            <Button
              margin={{ vertical: 'small' }}
              label={getText('change_password_button')}
              onClick={openPasswordModal}
            />
          </Box>
        </Main>
        {showPasswordModal &&
          <ChangePassword
            fields={passwordFormFields}
            onSubmit={onPasswordSubmit}
            onChange={onPasswordFieldsChange}
            closeModal={closePasswordModal}
          />}
      </LoadingOverlay>
    </div>
  );
};
