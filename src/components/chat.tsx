import React, { useState, useRef, useEffect } from "react";

export default function Chat() {
    const [messages, setMessages] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    function handleCommand(command: string): string {
        switch (command) {
            case "ls":
                return "about.txt  projects.txt  contact.txt";
            case "cat about.txt":
                return "Cesar Dominguez - Full Stack Developer";
            case "cat projects.txt":
                return "CesarFolio - A portfolio website made with React and TailwindCSS";
            case "cat contact.txt":
                return "Email: cesardarizaleta@gmail.com";
            case "help":
                return "ls - List files, cat [file] - Show file content, help - Show available commands";
            case "clear":
                setMessages([]);
                return "";
            default:
                return "Command not found";
        }
    }

    function handleInput(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            const input = event.currentTarget.value.trim();
            if (input === "") return;

            const response = handleCommand(input);
            setMessages([...messages, `> ${input}`, response]);

            event.currentTarget.value = "";
        }
    }

    return (
        <div className="p-4 bg-black text-white font-mono">
            <p>{'>'} Welcome to CesarFolio - Made by Cesar Dominguez</p>
            <p>{'>'} Type 'help' to see the available commands</p>
            {messages.map((message, index) => (
                <p key={index}>{message}</p>
            ))}
            <span className="flex items-center gap-2">
                {'>'} 
                <input
                    onKeyDown={handleInput}
                    type="text"
                    ref={inputRef}
                    className="bg-black text-white border-none outline-none w-full"
                />
            </span>
        </div>
    );
}