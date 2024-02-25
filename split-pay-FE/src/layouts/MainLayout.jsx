import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";


export default function MainLayout({children}) {
    return (
      <div className="app">
        <Header /> 
        <main>
            {children}
        </main>
        <Footer />
      </div>
    );
}