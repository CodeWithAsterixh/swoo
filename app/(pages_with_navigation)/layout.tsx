import React from "react";
import Navigation from "../components/Navigation";

export default function PageWithoutNavigation({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
