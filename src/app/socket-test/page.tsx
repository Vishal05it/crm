"use client";
import { socket } from "../lib/socket";
import React, { useEffect } from "react";

function SockeTest() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log(`Socket is connected on ID : ${socket.id}`);
      socket.emit("hello", {
        name: "Vishal Tiwari",
      });
      socket.emit("student", {
        name: "Vishal Tiwari",
        skill: "Next.js",
      });
    });
    return () => {
      socket.off("connect", () => {
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
