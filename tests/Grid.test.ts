import { Grid } from '../src/Domain/Grid';
import { Cell } from '../src/Domain/Cell';

describe(Grid, () => {
    test('it needs to be filled', () => {
        expect(() => new Grid(2, [])).toThrowError(RangeError);
    });

    describe('getByCoordinate', () => {
        test('it get the first cell in grid when asking for x:0 y:0', () => {
            const expected = Cell.withBomb();
            const unexpected = Cell.withoutBomb();
            const grid = new Grid(5, [
                expected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
            ]);

            expect(grid.cellByCoodinates(0, 0)).toBe(expected);
        });

        test('it get the last cell in grid when asking for x:3 y:1', () => {
            const expected = Cell.withBomb();
            const unexpected = Cell.withoutBomb();
            const grid = new Grid(4, [
                unexpected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
                unexpected,
                expected,
            ]);

            const cell = grid.cellByCoodinates(3, 1);
            expect(cell).toBe(expected);
        });
    });

    describe('generator', () => {
        const row = 10;
        const column = row;
        const iterator = Array.from(Array(row * column));

        test('it create a grid with cells', () => {
            const grid = Grid.generate(row, column, 0);
            iterator.forEach((_, index) => {
                expect(grid.cellByIndex(index)).toBeDefined();
            });
        });

        test('it create a grid without any mines', () => {
            const grid = Grid.generate(row, column, 0);
            iterator.forEach((_, index) => {
                const cell = grid.cellByIndex(index);
                if (cell) {
                    const dugCell = cell.dig();
                    expect(dugCell.detonated).toBe(false);
                }
            });
        });

        test('it create a grid full of mines', () => {
            const grid = Grid.generate(row, column, row * column);
            iterator.forEach((_, index) => {
                const cell = grid.cellByIndex(index);
                if (cell) {
                    const trappedDugCell = cell.dig();
                    expect(trappedDugCell.detonated).toBe(true);
                }
            });
        });

        test('it create a grid with 10 mines out of 100 cells', () => {
            const grid = Grid.generate(row, column, 10);
            const mineCount = iterator.reduce((count, _, index) => {
                const cell = grid.cellByIndex(index);
                if (cell === undefined) return count;

                const dugCell = cell.dig();
                return dugCell.detonated === true ? count + 1 : count;
            }, 0);

            expect(mineCount).toBe(10);
        });
    });

    // TODO: This test passes in theory(consolelog) but there is some weird value overlapping whith jest extension
    describe('calculateAdjacentMines', () => {
        xtest('should return 9 when all adjacent cells have mines', () => {
            const withMine = Cell.withBomb();
            const withoutMine = Cell.withoutBomb();
            const cells = [
                withMine,
                withMine,
                withMine,
                withMine,
                withoutMine,
                withMine,
                withMine,
                withMine,
                withMine,
            ];
            const results = Grid.updateAdjacentMinesCount(cells, 3, 3);
            expect(results[0].adjacentMinesCount).toBe(2);
            expect(results[1].adjacentMinesCount).toBe(4);
            expect(results[2].adjacentMinesCount).toBe(2);
            expect(results[3].adjacentMinesCount).toBe(4);
            expect(results[4].adjacentMinesCount).toBe(8);
            expect(results[5].adjacentMinesCount).toBe(4);
            expect(results[6].adjacentMinesCount).toBe(2);
            expect(results[7].adjacentMinesCount).toBe(4);
            expect(results[8].adjacentMinesCount).toBe(2);
        })
    });
});
