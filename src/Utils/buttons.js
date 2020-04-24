import React from "react";

import imgDelete from "../image/iconDelete1.png";
import imgShow from "../image/iconShow.png";
import imgEdit from "../image/iconEdit1.png";

import Button from "../components/Button";

export const buttons = {
    EDIT: {text: 'edit', img: imgEdit, title: 'Edit'},
    DELETE: {text: 'delete', img: imgDelete, title: 'Delete'},
    SHOW: {text: 'show', img: imgShow, title: 'More detail'},
}

export function getButton(button, onClick, key) {
    return (<Button key={key} children={<img
        src={button.img} alt={button.text} title={button.title}/>} className="button-img"
                    onClick={onClick}/>)
}

export function getButtonForButtonGroup(children, onClick, active,className) {
    return {
        className: 'btn-button-group '+className,
        children: children,
        onClick: onClick,
        active: active,
    }
}
