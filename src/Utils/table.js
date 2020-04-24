export function getCell(className, children, colSpan,classNameRow,onClickRow) {
    return {
        className: className,
        children: children,
        colSpan: colSpan,
        classNameRow: classNameRow,
        onClickRow: onClickRow,
    }
}
