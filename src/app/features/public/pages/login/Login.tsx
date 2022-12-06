import { Primary, Secondary } from '@churchofjesuschrist/eden-buttons';

export function Login() {
    function loginHandler() {
        window.location.href = '/api/users/login';
    }

    return (
        <div className="Login">
            <p className="explanation-text">
                You are currently not logged in. Press the Login button below to continue.
            </p>

            <Primary onClick={loginHandler}>Login</Primary>
        </div>
    );
}
