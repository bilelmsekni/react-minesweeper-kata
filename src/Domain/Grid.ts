import { Cell, CellAction } from './Cell';

export type Cells = Array<Cell>;

export class Grid {
    [key: number]: number;
    private _column: number;
    private _cells: Cells;

    static generate(row: number, column: number, minesCount: number): Grid {
        const length = row * column;
        let cells = Grid.fillGrid(length, minesCount);
        cells = Grid.randomizeGrid(length, cells);
        Grid.updateAdjacentMinesCount(cells, row, column);

        return new Grid(column, cells);
    }

    constructor(column: number, cells: Cells) {
        if (!Number.isInteger(column)) {
            throw new TypeError('column count must be an integer');
        }

        if (cells.length % column !== 0 || cells.length === 0) {
            throw new RangeError(
                'cell count must be dividable by column count'
            );
        }

        this._column = column;
        this._cells = cells;
    }

    [Symbol.iterator]() {
        return this._cells[Symbol.iterator]();
    }

    map(
        callbackfn: (value: Cell, index: number, array: Cell[]) => {},
        thisArg?: any
    ) {
        return this._cells.map(callbackfn);
    }

    cellByIndex(index: number): Cell | undefined {
        return this._cells[index];
    }

    cellByCoodinates(x: number, y: number): Cell | undefined {
        return this._cells[this._column * y + x];
    }

    sendActionToCell(cellIndex: number, action: CellAction): Grid {
        const cells = [...this._cells];
        const cell = cells[cellIndex];

        cells[cellIndex] = cell[action]();
        return new Grid(this._column, cells);
    }

    tryRevealAdjacentCells(cellIndex: number, action: CellAction): Grid {
        if (action === 'dig') {
            const cells = [...this._cells];
            // use FloodLine Algorithm to detect candidates to clear, see link https://en.wikipedia.org/wiki/Flood_fill
            // const candidates = this.poorFloodLineAlgorithm(cellIndex)
            // Object.keys(candidates).every(key => cells[+key] = candidates[+key]['dig']())

            return new Grid(this._column, cells);
        }
        return this;
    }

    // private poorFloodLineAlgorithm(cellIndex: number): { [key: number]: Cell } {
    //     const result: { [key: number]: Cell } = {};
    //     let cell = this._cells[cellIndex];
    //     while (cellIndex < this._column || cell.canBeRevealed) {
    //         result[cellIndex] = cell;
    //         cellIndex++
    //         cell = this._cells[cellIndex]
    //     }
    //     return result;
    // }

    get column() {
        return this._column;
    }

    static updateAdjacentMinesCount(cells: Cell[], row: number, column: number): Cell[] {
        return cells.map((cell, i, arr) => {
            const x = Grid.calculateX(i, column);
            const y = Grid.calculateY(i, row);

            const isValidCoordinates = (ix: number, iy: number) => ix >= 0
                && ix < column
                && iy >= 0
                && iy < row
                && (ix !== x || iy !== y);
            let adjacentCells = [];
            for (let index = x - 1; index < x + 2; index++) {
                for (let indey = y - 1; indey < y + 2; indey++) {
                    if (isValidCoordinates(index, indey)) {
                        adjacentCells.push(arr[Grid.coordinatesToIndex(index, indey, column)])
                    }
                }

            }
            cell.adjacentMinesCount = adjacentCells
                .filter(cell => cell && cell.hasBomb)
                .length;
            return cell;
        });
    }

    private static calculateX(index: number, column: number): number {
        return index % column
    }

    private static calculateY(index: number, row: number): number {
        return (index / row) >> 0
    }

    private static randomizeGrid(length: number, cells: Cell[]) {
        let index = -1;
        while (++index < length) {
            const rand = index + Math.floor(Math.random() * (length - index));
            const cell = cells[rand];
            cells[rand] = cells[index];
            cells[index] = cell;
        }
        return cells;
    }

    private static fillGrid(length: number, minesCount: number) {
        let cells: Cells = [];
        for (let i = 0; i < length; i++) {
            const cell = minesCount > i ? Cell.withBomb() : Cell.withoutBomb();
            cells.push(cell);
        }
        return cells;
    }

    private static coordinatesToIndex(x: number, y: number, column: number): number {
        return (column * y) + x;
    }
}
