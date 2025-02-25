import { Folder, House, Webhook } from "lucide-react"
import {Tooltip, Button} from "@heroui/react";

export default function Header(){
    return (
        <header className="fixed top-5 z-40 flex p-4 gap-4 bg-[#f3f3f310] rounded-xl backdrop-blur-md">
            <Tooltip closeDelay={0} content="Proyectos" className="bg-[#00000080] rounded-md">
                <Folder className="cursor-pointer" color="#ffffff" size="32" />
            </Tooltip>
            <Tooltip closeDelay={0} content="Inicio" className="bg-[#00000080] rounded-md">
                <House className="cursor-pointer" color="#ffffff" size="32" />
            </Tooltip>
            <Tooltip closeDelay={0} content="Tecnologias" className="bg-[#00000080] rounded-md">
                <Webhook className="cursor-pointer" color="#ffffff" size="32" />
            </Tooltip>
        </header>
    )
}