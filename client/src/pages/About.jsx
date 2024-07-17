import React from "react";

export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-3 text-center">
        <div >
          <h1 className="text-3xl font-semibold text-center my-7">About Chirag's Blog</h1>
          <div className="text-md text-gray-500 flex flex-col gap-6">
            <p >
              Welcome to Chirag's Blog! This platform is your go-to destination
              for insightful articles, tech tutorials, and personal stories
              shared by Chirag, a passionate web developer with a knack for the
              MERN stack. With years of experience in creating dynamic and
              responsive web applications, Chirag brings a unique perspective on
              the latest trends and best practices in the world of technology.
              Whether you're a fellow developer looking for coding tips, a tech
              enthusiast eager to stay updated, or simply someone who loves a
              good read, Chirag's Blog has something for everyone. Join us on
              this exciting journey as we explore the ever-evolving landscape of
              technology and beyond. Happy reading!
            </p>
            
          </div>
        </div>
      </div>
    </div>
  );
}
