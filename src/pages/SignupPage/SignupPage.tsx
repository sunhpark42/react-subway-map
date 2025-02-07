import {
  FormEventHandler,
  ChangeEventHandler,
  useState,
  useContext,
  KeyboardEventHandler,
} from 'react';
import { MdEmail, MdLock, MdPerson } from 'react-icons/md';
import { Redirect, useHistory } from 'react-router-dom';

import { Box, Button, Input, Icon, InputContainer, Heading1 } from '../../components/shared';

import { UserContext } from '../../contexts/UserContextProvider';
import { ThemeContext } from '../../contexts/ThemeContextProvider';
import { SnackBarContext } from '../../components/shared/SnackBar/SnackBarProvider';

import REGEX from '../../constants/regex';
import { SIGNUP_VALUE } from '../../constants/values';
import PATH from '../../constants/path';
import PALETTE from '../../constants/palette';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '../../constants/messages';

import useDebounce from '../../hooks/useDebounce';
import useInput from '../../hooks/useInput';
import { PageProps } from '../types';
import { Form } from './SignupPage.style';
import { isValidRange } from '../../utils/validator';
import API from '../../apis/user';

const DEBOUNCE_DELAY = 500;

const SignupPage = ({ setIsLoading }: PageProps) => {
  const history = useHistory();
  const themeColor = useContext(ThemeContext)?.themeColor ?? PALETTE.WHITE_100;
  const addSnackBar = useContext(SnackBarContext)?.pushMessage;
  const isLoggedIn = useContext(UserContext)?.isLoggedIn;

  const [email, setEmail] = useState<string>('');
  const [isEmailDuplicated, setIsEmailDuplicated] = useState<boolean>(false);
  const [age, onAgeChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [passwordConfirm, onPasswordConfirmChange] = useInput('');

  const isEmailFormatValid = !email || REGEX.EMAIL.test(email);
  const isAgeValid =
    !age || isValidRange(Number(age), SIGNUP_VALUE.AGE_MIN_VALUE, SIGNUP_VALUE.AGE_MAX_VALUE);
  const isPasswordValid = !password || REGEX.PASSWORD.test(password);
  const isPasswordMatched = !passwordConfirm || password === passwordConfirm;

  const getEmailMessage = () => {
    if (!email) {
      return '';
    }

    if (!isEmailFormatValid) {
      return ERROR_MESSAGE.INVALID_EMAIL;
    }

    if (isEmailDuplicated) {
      return ERROR_MESSAGE.DUPLICATED_EMAIL;
    }

    return SUCCESS_MESSAGE.AVAILABLE_EMAIL;
  };

  const emailMessage = getEmailMessage();
  const ageErrorMessage = isAgeValid ? '' : ERROR_MESSAGE.INVALID_AGE;
  const passwordErrorMessage = isPasswordValid ? '' : ERROR_MESSAGE.INVALID_PASSWORD;
  const passwordMatchedErrorMessage = isPasswordMatched
    ? ''
    : ERROR_MESSAGE.INVALID_PASSWORD_CONFIRM;

  const isFormCompleted =
    email &&
    age &&
    password &&
    passwordConfirm &&
    isEmailFormatValid &&
    !isEmailDuplicated &&
    isAgeValid &&
    isPasswordValid &&
    isPasswordMatched;

  const checkEmailDuplicated = useDebounce(async (value: string) => {
    const response = await API.checkEmailDuplicated(value);

    if (response.ok) {
      setIsEmailDuplicated(response.data ? true : false);
      return;
    }

    if (response.error) {
      console.error(response.error);
      addSnackBar?.(response.error.message);
    }
  }, DEBOUNCE_DELAY);

  if (isLoggedIn) {
    return <Redirect to={PATH.ROOT} />;
  }

  const onEmailChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setEmail(event.target.value);
    checkEmailDuplicated(event.target.value);
  };

  const onPasswordKeydown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    const el = event.target as HTMLInputElement;

    if (event.getModifierState('CapsLock')) {
      el.setCustomValidity('CapsLock이 켜져 있습니다.');
      el.reportValidity();
    } else {
      el.setCustomValidity('');
    }
  };

  const onSignup: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    if (!isFormCompleted) {
      return;
    }

    const timer = setTimeout(() => setIsLoading(true), 500);

    const response = await API.signup({ email, password, age: Number(age) });
    if (response.ok) {
      addSnackBar?.(SUCCESS_MESSAGE.SIGNUP);
      history.push(PATH.LOGIN);
    } else {
      console.error(response.error);
      addSnackBar?.(response.error?.message ?? ERROR_MESSAGE.DEFAULT);
    }

    clearTimeout(timer);
    setIsLoading(false);
  };

  return (
    <Box hatColor={themeColor} backgroundColor={PALETTE.WHITE_100}>
      <Heading1 marginBottom="2rem">회원가입</Heading1>
      <Form onSubmit={onSignup}>
        <InputContainer
          validation={{
            text: emailMessage,
            isValid: isEmailFormatValid && !isEmailDuplicated,
          }}
        >
          <Icon>
            <MdEmail />
          </Icon>
          <Input
            type="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={onEmailChange}
            autoComplete="off"
            aria-label="이메일 입력"
          />
        </InputContainer>
        <InputContainer validation={{ text: ageErrorMessage, isValid: isAgeValid }}>
          <Icon>
            <MdPerson />
          </Icon>
          <Input
            type="text"
            placeholder="나이를 입력하세요"
            maxLength={SIGNUP_VALUE.AGE_MAX_LENGTH}
            value={age}
            onChange={onAgeChange}
            autoComplete="off"
            aria-label="나이 입력"
          />
        </InputContainer>
        <InputContainer validation={{ text: passwordErrorMessage, isValid: isPasswordValid }}>
          <Icon>
            <MdLock />
          </Icon>
          <Input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={onPasswordChange}
            onKeyDown={onPasswordKeydown}
            autoComplete="off"
            aria-label="비밀번호 입력"
          />
        </InputContainer>
        <InputContainer
          validation={{ text: passwordMatchedErrorMessage, isValid: isPasswordMatched }}
        >
          <Icon>
            <MdLock />
          </Icon>
          <Input
            type="password"
            placeholder="비밀번호를 한번 더 입력하세요"
            value={passwordConfirm}
            onChange={onPasswordConfirmChange}
            onKeyDown={onPasswordKeydown}
            autoComplete="off"
            aria-label="비밀번호 확인 입력"
          />
        </InputContainer>
        <Button
          size="m"
          width="100%"
          backgroundColor={themeColor}
          color={PALETTE.WHITE_100}
          disabled={!isFormCompleted}
        >
          회원가입
        </Button>
      </Form>
    </Box>
  );
};

export default SignupPage;
