import { describe, expect, it } from 'vitest';
import { mapHandHistoryList, mapHandHistoryDetails } from './handHistoryData';

describe('hand history data normalization', () => {
  it('normalizes the new list payload shape', () => {
    const source = {
      success: true,
      data: {
        items: [
          {
            session: 'cb11219a-895b-4e73-bc81-a76b9456cd1f',
            handNumber: 1,
            status: 'finished',
            startedAt: '2026-10-01T22:02:48+00:00',
            endedAt: '2026-10-01T22:04:48+00:00',
            cards: [],
            winners: ['test'],
            bank: 3.8,
            myResult: { deltaChips: 1.8, finalStack: 51.8 }
          }
        ],
        pagination: { total: 1, page: 1, limit: 20, pages: 1 },
        isAuthorized: true,
      },
    };

    expect(mapHandHistoryList(source)).toEqual({
      items: [
        {
          session: 'cb11219a-895b-4e73-bc81-a76b9456cd1f',
          handNumber: 1,
          status: 'finished',
          startedAt: '2026-10-01T22:02:48+00:00',
          endedAt: '2026-10-01T22:04:48+00:00',
          cards: [],
          winners: ['test'],
          bank: 3.8,
          myResult: { deltaChips: 1.8, finalStack: 51.8 }
        }
      ],
      pagination: { total: 1, page: 1, limit: 20, pages: 1 },
    });
  });

  it('normalizes the new details payload shape', () => {
    const source = {
      success: true,
      data: {
        session: 'cb11219a-895b-4e73-bc81-a76b9456cd1f',
        handNumber: 1,
        gameType: 'cash',
        status: 'finished',
        players: [
          {
            place: 4,
            login: 'test',
            cards: [],
            stack: 51.8,
            position: 'BB',
            isMyPlayer: true,
          },
        ],
        blinds: {
          smallBlindPlace: 5,
          bigBlindPlace: 4,
          smallBlind: 1,
          bigBlind: 2,
        },
        dealer: 5,
        boardCards: [],
        preflop: [],
        flop: [],
        turn: [],
        river: [],
        pot: { preFlop: 3.8, flop: 3.8, turn: 3.8, river: 3.8 },
        winners: [
          {
            login: 'test',
            seat: 4,
            combination: { name: 'Set', rank: 4, cards: [] },
            handRank: 'Set',
            handCards: [],
            sum: 3.8,
          },
        ],
        results: [
          { player: 'test', seat: 4, deltaChips: 1.8, finalStack: 51.8 },
        ],
        isAuthorized: true,
      },
    };

    expect(mapHandHistoryDetails(source)).toEqual({
      session: 'cb11219a-895b-4e73-bc81-a76b9456cd1f',
      handNumber: 1,
      gameType: 'cash',
      status: 'finished',
      cards: [],
      players: [
        {
          place: 4,
          login: 'test',
          cards: [],
          stack: 51.8,
          position: 'BB',
          isMyPlayer: true,
        },
      ],
      blinds: {
        smallBlindPlace: 5,
        bigBlindPlace: 4,
        smallBlind: 1,
        bigBlind: 2,
      },
      dealer: 5,
      boardCards: [],
      preflop: [],
      flop: [],
      turn: [],
      river: [],
      pot: { preFlop: 3.8, flop: 3.8, turn: 3.8, river: 3.8 },
      winners: [
        {
          login: 'test',
          seat: 4,
          combination: { name: 'Set', rank: 4, cards: [] },
          handRank: 'Set',
          handCards: [],
          sum: 3.8,
        },
      ],
      results: [
        { player: 'test', seat: 4, deltaChips: 1.8, finalStack: 51.8 },
      ],
      isAuthorized: true,
    });
  });
});
