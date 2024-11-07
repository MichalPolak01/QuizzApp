"use client"

import React, { FormEvent, useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import {  Mail, UserRound } from "lucide-react";

import { validateEmail } from "@/lib/formValidators";
import { useAuth } from "@/providers/authProvider";


const ACCOUNT_SETTINGS_URL = "api/account-settings";

export default function AccountSettings() {
    const [registerMessage, setRegisterMessage] = useState("Aby zaktualizować profil wprowadź wszystkie potrzebne dane i zapisz zminy.");
    const [registerError, setRegisterError] = useState(0);
    const [isUsernameInvalid, setIsUsernameInvalid] = useState(false);
    const [isEmailInvalid, setIsEmailInvalid] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        role: ""
    });

    const auth = useAuth();

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await fetch(ACCOUNT_SETTINGS_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            
            if (response.status == 401) {
                auth.loginRequired();
            } else {
                if (response.ok) {
                    const data = await response.json();

                    setFormData({
                        username: data.username || "",
                        email: data.email || "",
                        role: data.role || ""
                    })
                } else {
                    console.error("Error featching data");
                }
            }
        }

        
        fetchUserData();
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsUsernameInvalid(false);
        setIsEmailInvalid(false);

        if (formData.username == "" || isInvalidEmail) {
            setRegisterError(1);
            setRegisterMessage("Aby zaktualizować profil musisz wprowadzić poprawnie wszystkie dane!");
        } else {
            const requestOptions = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            };
    
            const response = await fetch(ACCOUNT_SETTINGS_URL, requestOptions);
    
            interface AccountUpdateResponse {
                message?: string;
            }
            let data: AccountUpdateResponse = {};
    
            try {
                data = await response.json();
            } catch (error) { }
    
            if (response.status == 200) {
                setRegisterError(2);
                // TODO Add toast
                setRegisterMessage("Dane użytkownika zostały pomyślnie zaktualizowane.");
                console.log("Account update success");
                // router.push(LOGIN_URL);
            } else if (response.status == 400) {
                setRegisterError(1);
                const errorResponse = data?.message;

                if (errorResponse == "Username is already taken.") {
                    setIsUsernameInvalid(true);
                    setRegisterMessage("Podana nazwa użytkownika jest już używana.");
                } else if (errorResponse == "Email is already taken.") {
                    setIsEmailInvalid(true);
                    setRegisterMessage("Podany adres email jest już używany.");
                } else {
                    setRegisterMessage("Podczas aktualizacji danych użytkownika wystąpił nieoczekiwany błąd. Spróbuj ponownie później.");
                }
                
                // TODO Add toast
                console.log("Account update failed");
            } else if (response.status == 401) {
                auth.loginRequired();
            } else {
                setRegisterError(1);
                setRegisterMessage("Podczas aktualizacji danych użytkownika wystąpił nieoczekiwany błąd servera. Spróbuj ponownie później.");
                console.log("Account update failed");
            }
        }
    }

    const isInvalidEmail = React.useMemo(() => {
      if (formData.email === "") return false;
  
      return validateEmail(formData.email) ? false : true;
    }, [formData.email]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsUsernameInvalid(false);
        setIsEmailInvalid(false);
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }
    
  return (
    <div className="py-4">
        <h1 className="text-primary text-2xl font-semibold mb-2">Edytuj dane użytkownika</h1>
        <p className={`${registerError == 1 ? "text-danger-500": registerError == 2 ? "text-success-500" : "text-default-600"}`}>{registerMessage}</p>
        <form className="overflow-visible flex flex-col gap-3 mt-6" onSubmit={handleSubmit}>
            <Input
                color="default"
                errorMessage="Nazwa użytkownika musi być unikalna!"
                isInvalid={isUsernameInvalid}
                isRequired={true}
                label="Nazwa"
                labelPlacement="outside"
                name="username"
                placeholder="Nazwa"
                size="md"
                startContent={
                    <UserRound className={`text-2xl  pointer-events-none flex-shrink-0 ${isUsernameInvalid? "text-danger-400" :"text-default-400"}`}/>
                }
                type="text"
                value={formData.username}
                onChange={handleChange}
            />
            <Input
                color="default"
                errorMessage="Podany adres email jest niepoprawny!"
                isInvalid={isInvalidEmail || isEmailInvalid}
                isRequired={true}
                label="Email"
                labelPlacement="outside"
                name="email"
                placeholder="Email"
                size="md"
                startContent={
                    <Mail className={`text-2xl  pointer-events-none flex-shrink-0 ${isInvalidEmail || isEmailInvalid? "text-danger-400" :"text-default-400"}`}/>
                }
                type="email"
                value={formData.email}
                onChange={handleChange}
            />
            <Button className="w-full mt-4" color="primary" size="sm" type="submit" variant="shadow">
                Zapisz zmiany
            </Button> 
        </form>
    </div>
  );
}