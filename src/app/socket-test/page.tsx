"use client";
import { connectToSocket } from "../lib/socket";
import React, { useEffect } from "react";

function SockeTest() {
  useEffect(() => {
    let socketInstance: any;
    const initSocket = async () => {
      socketInstance = await connectToSocket();
    };
    socketInstance.on("connect", () => {
      console.log(`Socket is connected on ID : ${socketInstance.id}`);
      socketInstance.emit("hello", {
        name: "Vishal Tiwari",
      });
      socketInstance.emit("student", {
        name: "Vishal Tiwari",
        skill: "Next.js",
      });
    });
    initSocket();
    return () => {
      socketInstance?.off("connect", () => {
        console.log(`Socket discoonected`);
      });
    };
  }, []);
  return (
    <>
      <section className="flex w-screen h-screen justify-center items-center">
        <p className="text-3xl">Socket Test</p>
      </section>
    </>
  );
}

export default SockeTest;
