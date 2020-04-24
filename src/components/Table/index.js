import React from 'react';
import './style.scss'
import Spinner from "../Spinners";

function Table({
                   classNameTable,
                   classNameTableHead,
                   header,
                   content,
                   isLoading,
                   classNameBlock,
                   themeName,
               }) {

    let modifiedContent;
    try {
        if (isLoading) {
            modifiedContent = <tr>
                <td colSpan={header.length}>
                    <Spinner className='loader1'/>
                </td>
            </tr>;
        } else {
            if (!content.length) {
                modifiedContent = <tr>
                    <td colSpan={header.length}>
                        <div className='div-no-data'>No data</div>
                    </td>
                </tr>
            } else {
                modifiedContent = content.map((item, i) => (
                    <tr key={'content' + i}>
                        {item.map((itemChild, j) => (
                            <td onClick={itemChild.onClickRow} key={'content' + i + '.' + j} colSpan={itemChild.colSpan}
                                className={(itemChild.classNameRow) ? (itemChild.className + ' ' + itemChild.classNameRow) : (itemChild.className)}>
                                {itemChild.children}
                            </td>
                        ))}

                    </tr>
                ))
            }
        }
    } catch (e) {
        modifiedContent = <tr>
            <td>
                <div>Data display error</div>
            </td>
        </tr>
    }

    return (<div className={classNameBlock}>
        <table className={classNameTable+' '+themeName}>
            <thead className={classNameTableHead}>
            <tr>
                {header.map((item, i) => (
                    <th key={i} className={item.className}>{item.alias}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {modifiedContent}
            </tbody>
        </table>
    </div>);
}

export default Table;
