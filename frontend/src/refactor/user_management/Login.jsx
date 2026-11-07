import * as React from 'react';
import { SignInPage } from '@toolpad/core/SignInPage';
import {UserContext} from '../../context/userContext.jsx';
import {useNavigate} from "react-router-dom";
import {useContext, useEffect} from "react";
import http from "../../../http.js";

const providers = [{ id: 'credentials', name: undefined }];

export default function NotificationsSignInPageError() {
    const navigate= useNavigate();
    const {getData} = useContext(UserContext);

    useEffect(() => {
        /**
         * Checks the user's login status with the backend and updates state accordingly.
         *
         * @pre http must be configured correctly.
         * @post Updates isLoggedIn state based on response from backend.
         */
        const checkLoginStatus = async () => {
                http.get("/verify")
                    .then((resp) => {
                        if(resp.status === 200) {
                            navigate("/catalogue");
                        }
                    })
        };

        checkLoginStatus();
    }, []);

    const signIn = async (_provider,formData) => {
        try{
            const credentials = { username:formData.get('email'),
                password:formData.get('password')};

            const response = await http.post("/login", credentials);

            if (response.status === 202) {
                await getData()
                localStorage.setItem("token",response.data.token);
                navigate("/catalogue",{replace:true});
            }
        } catch (error) {
            if (error.response) {
                // Request made and server responded with a status code that falls out of the range of 2xx
                if (error.response.status === 401) {
                    // Unauthorized: Invalid username or password
                    alert("Invalid username or password");
                } else {
                    // Other server errors
                    alert("An error occurred. Please try again later.");
                }
            } else if (error.request) {
                // The request was made but no response was received
                alert("Network error. Please check your internet connection.");
            } else {
                // Something happened in setting up the request that triggered an error
                console.error("Error:", error.message);
            }
        }
        return {};
    };


    return (
        <SignInPage
            providers={providers}
            signIn={signIn}
            // slots={{
            //     forgotPasswordLink: Link,
            //     signUpLink: Link,
            // }}
            slotProps={{
                emailField: {
                    label: 'Username',
                    placeholder: 'Enter username',
                    autoComplete: 'username',
                },
                passwordField: {
                    label: 'Password',
                    autoComplete: 'current-password',
                },
                // signUpLink: {
                //     href: '/signup',
                //     children:"sign up"
                // },
                // forgotPasswordLink: {
                //     href: '/forgot-password',
                //     children:"forgot password?"
                // },
                submitButton: {
                    children: 'Sign In',
                },
                form:{
                    noValidate:true
                }
            }}
        />
    );
}
