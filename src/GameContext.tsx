import React from 'react';
import { CellAction } from './Domain/Cell';
import { Grid } from './Domain/Grid';

type GameContextProps = {
    previousGrid: Grid | undefined;
    grid: Grid;
    updateGridCellStatus: (index: number, status: CellAction) => void;
    revertLastAction: (grid: Grid) => void;
};

type GridCustomHook = [
    Grid,
    Grid,
    (index: number, action: CellAction) => void,
    (grid: Grid) => void
];

const initialContext: GameContextProps = {
    previousGrid: undefined,
    grid: Grid.generate(10, 10, 10),
    updateGridCellStatus: () => {},
    revertLastAction: () => {},
};

const useStateGridCells = (initialValue: Grid): GridCustomHook => {
    const [grid, setGrid] = React.useState(initialValue);
    const [previousGrid, setPreviousGrid] = React.useState();

    return [
        grid,
        previousGrid,
        (index: number, action: CellAction) => {
            setPreviousGrid(grid);
            const newGrid = grid
                .sendActionToCell(index, action)
                .tryRevealAdjacentCells(index, action);
            setGrid(newGrid);
        },
        () => {
            setPreviousGrid(undefined);
            setGrid(previousGrid);
        },
    ];
};

export const GameContext = React.createContext<GameContextProps>(
    initialContext
);

export const GameContextProvider: React.FunctionComponent<
    React.ReactNode
> = props => {
    const [
        grid,
        previousGrid,
        updateGridCellStatus,
        revertLastAction,
    ] = useStateGridCells(initialContext.grid);

    return (
        <GameContext.Provider
            value={{
                grid,
                previousGrid,
                updateGridCellStatus,
                revertLastAction,
            }}
        >
            {props.children}
        </GameContext.Provider>
    );
};
