import React from 'react';
import { GameContext } from '../GameContext';
import { Cell } from './Cell';
import { Game } from './Game';
import { isDefeated, isVictorious } from '../Domain/Rules';

export const Grid: React.FunctionComponent = () => {
    const {
        grid,
        previousGrid,
        updateGridCellStatus,
        revertLastAction,
    } = React.useContext(GameContext);

    const handleClick = (index: number, button: number) => {
        updateGridCellStatus(index, button === 0 ? 'dig' : 'flag');
    };

    const revert = () => {
        if (previousGrid) {
            revertLastAction(previousGrid);
        }
    };

    const gameOver =
        (isDefeated(grid) && 'defeat') ||
        (isVictorious(grid) && 'victory') ||
        false;

    const handleKeyDown = (event: React.KeyboardEvent) => {
        let charCode = String.fromCharCode(event.which).toLowerCase();
        if (event.ctrlKey && charCode === 'z') {
            if (previousGrid) {
                revertLastAction(previousGrid);
            }
        }
    };

    return (
        <div
            onKeyDown={(event: React.KeyboardEvent) => handleKeyDown(event)}
            tabIndex={0}
            style={{
                display: 'flex',
                flexFlow: 'column wrap',
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
            }}
        >
            <Game gameOver={gameOver} />
            <div
                style={{
                    display: 'flex',
                    border: '1px solid black',
                    boxSizing: 'content-box',
                    flexWrap: 'wrap',
                    width: `calc(40px * ${grid.column})`,
                }}
            >
                {grid.map((cell, index) => (
                    <Cell
                        key={index}
                        cellIndex={index}
                        status={cell.status}
                        adjacentMinesCount={cell.adjacentMinesCount}
                        onclick={(ev: MouseEvent) =>
                            handleClick(index, ev.button)
                        }
                    />
                ))}
            </div>
            <button onClick={() => revert()}>Revert</button>
        </div>
    );
};
