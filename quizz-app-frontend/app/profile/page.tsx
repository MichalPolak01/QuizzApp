"use client"

import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Tab, Tabs } from "@nextui-org/tabs";
import React, { useState } from "react";

import AccountSettings from "@/components/account-settings";

export default function Page() {
    const [selected, setSelected] = useState("account-settings");
  
    return (
    <div className="flex flex-col justify-center ">
        <Card className="w-full p-8">
        <CardHeader className="p-2 flex-col items-start border-b-2 border-default-200 mb-4">
                    <h1 className="text-primary text-4xl font-semibold mb-2">Profil</h1>
                    <h2 className="text-default-500 text-lg">W tym miejscu możesz zarządzać swoim kontem.</h2>
        </CardHeader>
          <CardBody className="overflow-hidden flex flex-col">
            <Tabs
              aria-label="Tabs form"
              isVertical={false}
              selectedKey={selected}
              size="md"
              onSelectionChange={setSelected}
            >
              <Tab key="account-settings" title="Zaktualizuj dane">
                <AccountSettings />
              </Tab>
              <Tab key="change-password" title="Zmień hasło">

              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    );
  }