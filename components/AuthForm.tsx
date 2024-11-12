import React from 'react';
type FormType = 'sign-in' | 'sign-up';

const AuthForm = ({ type }: { type: FormType }) => {
    return <div>AuthForm {type}</div>;
};

export default AuthForm;
