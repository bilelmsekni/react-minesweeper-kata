import { Cell } from '../src/Domain/Cell';

describe(Cell, () => {
    describe('without a bomb', () => {
        const cell = Cell.withoutBomb();

        test('does not explodes if untouched', () => {
            expect(cell.detonated).toBe(false);
        });

        test("can't be flagged if it doesn't have a bomb", () => {
            expect(() => cell.flag()).toThrowError(`Can't run around flaggin cells !`);
        });

        test('does not explode even when you dig it (there is no bomb)', () => {
            cell.dig();
            expect(cell.detonated).toBe(false);
        });

        test("can't be flagged if it has been dug", () => {
            const dugCell = cell.dig();
            expect(() => dugCell.flag()).toThrowError('This cell has already been dug');
        });
    });

    describe('with a bomb', () => {
        const trappedCell = Cell.withBomb();

        test('does not explodes if untouched', () => {
            expect(trappedCell.detonated).toBe(false);
        });

        test('can be flagged and still not explose', () => {
            const flaggedTrappedCell = trappedCell.flag();
            expect(flaggedTrappedCell.detonated).toBe(false);
            expect(flaggedTrappedCell.flagged).toBe(true);
        });

        test('blows player face when he dig this cell', () => {
            const dugTrappedCell = trappedCell.dig();
            expect(dugTrappedCell.detonated).toBe(true);
        });
    });
});
