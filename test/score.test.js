// node --test
const test = require('node:test');
const assert = require('node:assert/strict');
const { score, fmt, report } = require('../score.js');

test('範例：80 kg / 30% -> 75 kg / 27%', () => {
  const r = score(80, 30, 75, 27);
  assert.equal(fmt(r.weightLost), '5.00');
  assert.equal(fmt(r.weightPct), '6.25');
  assert.equal(fmt(r.fatLost), '3.00');
  assert.equal(fmt(r.fatPct), '10.00');
  assert.equal(fmt(r.weightScore), '2.50');
  assert.equal(fmt(r.fatScore), '6.00');
  assert.equal(fmt(r.total), '8.50');
});

test('總分＝兩項得分相加', () => {
  // 100 -> 99.4：體重 0.24；20 -> 19.9：體脂 0.3 -> 0.54
  const r = score(100, 20, 99.4, 19.9);
  assert.equal(fmt(r.weightScore), '0.24');
  assert.equal(fmt(r.fatScore), '0.30');
  assert.equal(fmt(r.total), '0.54');
});

test('四捨五入半數進位', () => {
  assert.equal(fmt(1.005), '1.01');
  assert.equal(fmt(2.675), '2.68');
  assert.equal(fmt(-1.005), '-1.01');
});

test('變胖時得分為負', () => {
  const r = score(80, 30, 82, 31);
  assert.ok(r.total < 0);
  assert.equal(fmt(r.weightLost), '-2.00');
});

test('輸入檢查', () => {
  assert.throws(() => score(0, 30, 75, 27), /初始體重必須大於 0/);
  assert.throws(() => score(80, 130, 75, 27), /初始體脂率不能超過 100/);
  assert.throws(() => score(NaN, 30, 75, 27), /不是有效的數字/);
  assert.throws(() => score(80, 30, 75, 27, ['80', '30', '', '27']), /請輸入結算體重/);
});

test('成績單格式', () => {
  const text = report(score(80, 30, 75, 27));
  assert.match(text, /3\. 本次比賽最終總得分：8\.50 分/);
  assert.match(text, /體脂共減少：3\.00 個百分點（降幅：10\.00%）/);
});
