import React from 'react';
import { CellStatus } from '../Domain/Cell';

type CellProps = {
    cellIndex: number;
    adjacentMinesCount: number;
    status: CellStatus;
    onclick: Function;
};

const emojis = {
    untouched: '',
    dug: '',
    flagged: '🚩',
    detonated: '💥',
};

const isCellLighter = (index: number) => {
    const rowIndex = (index / 10) >> 0;
    const cellIndex = index % 10;

    return cellIndex % 2 ? !!(rowIndex % 2) : !!!(rowIndex % 2);
};

const cellStyle = (status: CellStatus, index: number): React.CSSProperties => ({
    width: '40px',
    height: '40px',
    textAlign: 'center',
    lineHeight: '40px',
    border: '1px solid black',
    boxSizing: 'border-box',
    cursor: 'pointer',
    opacity: isCellLighter(index) ? 0.5 : 1,
    backgroundColor:
        status === 'untouched' || status === 'flagged' ? '#8cd53d' : '#e7b598',
});

export const Cell: React.FunctionComponent<CellProps> = props => {
    return (
        <div
            onClick={ev => {
                ev.preventDefault();
                props.onclick(ev);
            }}
            onContextMenu={ev => {
                ev.preventDefault();
                props.onclick(ev);
            }}
            style={cellStyle(props.status, props.cellIndex)}
        >
            {emojis[props.status]}
            {props.status === 'dug' && props.adjacentMinesCount > 0
                ? props.adjacentMinesCount
                : undefined}
        </div>
    );
};
