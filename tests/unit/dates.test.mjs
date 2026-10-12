import { test } from 'node:test';
import assert from 'node:assert/strict';
import { status, pickupProblem, firstPickupDate, weekdayOf } from '../../src/lib/dates.ts';
import { estimate, shapesFor } from '../../src/data/cakes.ts';

// 2026-10-14 is a Wednesday. Brussels is UTC+2 until 25 Oct 2026, then UTC+1.
const at = (iso) => new Date(iso);

test('weekday mapping', () => {
  assert.equal(weekdayOf('2026-10-14'), 'wed');
  assert.equal(weekdayOf('2026-10-19'), 'mon');
});

test('open on Wednesday morning, closes at 17:00', () => {
  assert.deepEqual(status(at('2026-10-14T08:30:00Z')), { open: true, closes: '17:00' }); // 10:30 local
});

test('before opening on an open day points to today', () => {
  const s = status(at('2026-10-14T05:00:00Z')); // 07:00 local
  assert.equal(s.open, false);
  assert.equal(s.next.today, true);
  assert.equal(s.next.opens, '09:00');
});

test('closing time is exclusive and rolls to Friday', () => {
  const s = status(at('2026-10-14T15:00:00Z')); // 17:00 local
  assert.equal(s.open, false);
  assert.equal(s.next.day, 'fri');
});

test('Monday points to Wednesday', () => {
  const s = status(at('2026-10-19T10:00:00Z'));
  assert.equal(s.next.day, 'wed');
  assert.equal(s.next.ymd, '2026-10-21');
});

test('DST change: Sunday 25 Oct 2026 15:30 local is open (UTC+1 after the switch)', () => {
  assert.equal(status(at('2026-10-25T14:30:00Z')).open, true); // 15:30 CET
  assert.equal(status(at('2026-10-25T15:30:00Z')).open, false); // 16:30 CET
});

test('pickup dates: closed days, lead time, past, format', () => {
  const now = at('2026-10-14T08:00:00Z'); // Wed
  assert.equal(pickupProblem('2026-10-13', now), 'past');
  assert.equal(pickupProblem('2026-10-15', now), 'soon');
  assert.equal(pickupProblem('2026-10-16', now), null); // Fri
  assert.equal(pickupProblem('2026-10-19', now), 'closed'); // Mon
  assert.equal(pickupProblem('2026-10-20', now), 'closed'); // Tue
  assert.equal(pickupProblem('2026-10-22', now), 'closed'); // Thu
  assert.equal(pickupProblem('16/10/2026', now), 'format');
  assert.equal(firstPickupDate(now), '2026-10-16');
});

test('cake estimate and shapes', () => {
  assert.equal(estimate({ size: 'medium', style: 'basic' }), 75);
  assert.equal(estimate({ size: 'xl', style: 'covered', ribbons: 2, cherries: 3 }), 335);
  assert.equal(estimate({ size: 'large' }), null);
  assert.deepEqual(shapesFor('xl'), ['rectangle']);
  assert.deepEqual(shapesFor('medium'), ['round', 'heart']);
});
