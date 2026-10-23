// 減肥大賽計分（雙軌權重制：體重 40%＋體脂 60%）。瀏覽器與 Node 共用。
(function (root) {
  const WEIGHT_RATIO = 0.4, FAT_RATIO = 0.6;

  // 四捨五入到小數點後兩位（半數進位），先修正二進位浮點誤差，例如 1.005 -> 1.01
  const round2 = x => {
    const v = Math.round(Math.abs(x) * 100 + 1e-9) / 100;
    return x < 0 ? -v : v;
  };
  const fmt = x => round2(x).toFixed(2);

  function check(name, v, raw, max) {
    if (raw !== undefined && raw === '') throw new Error(`請輸入${name}`);
    if (!Number.isFinite(v)) throw new Error(`${name}不是有效的數字`);
    if (v <= 0) throw new Error(`${name}必須大於 0`);
    if (max && v > max) throw new Error(`${name}不能超過 ${max}`);
  }

  function comment(total, weightPct, fatPct) {
    if (total <= 0) return '這一輪數字沒有往下走，但比賽還沒結束，調整節奏，下一次一定看得到成果！';
    if (fatPct > weightPct) return '體脂降幅比體重更亮眼，減掉的是實實在在的脂肪，照這個節奏繼續衝！';
    if (total >= 10) return '雙軌同步大幅下降，這是冠軍等級的表現，保持住！';
    return '體重和體脂都在往下走，每一分都是汗水換來的，繼續加油！';
  }

  // raw: 選填，四個欄位的原始字串，用來分辨「沒填」與「填了 0」
  function score(w0, f0, w1, f1, raw = []) {
    check('初始體重', w0, raw[0]); check('初始體脂率', f0, raw[1], 100);
    check('結算體重', w1, raw[2]); check('結算體脂率', f1, raw[3], 100);
    const weightLost = w0 - w1, fatLost = f0 - f1;
    const weightPct = weightLost / w0 * 100, fatPct = fatLost / f0 * 100;
    const weightScore = weightPct * WEIGHT_RATIO, fatScore = fatPct * FAT_RATIO;
    const total = weightScore + fatScore;   // 用未四捨五入的兩項相加，最後才四捨五入
    return { weightLost, fatLost, weightPct, fatPct, weightScore, fatScore, total,
             comment: comment(round2(total), weightPct, fatPct) };
  }

  function report(r) {
    return [
      '1. 減重數據摘要',
      `   - 體重共減少：${fmt(r.weightLost)} kg（降幅：${fmt(r.weightPct)}%）`,
      `   - 體脂共減少：${fmt(r.fatLost)} 個百分點（降幅：${fmt(r.fatPct)}%）`,
      '',
      '2. 得分試算',
      `   - 體重得分（佔 40%）：${fmt(r.weightScore)} 分`,
      `   - 體脂得分（佔 60%）：${fmt(r.fatScore)} 分`,
      '',
      `3. 本次比賽最終總得分：${fmt(r.total)} 分`,
      '',
      `4. ${r.comment}`,
    ].join('\n');
  }

  const api = { score, report, fmt, round2 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.WeightLossScore = api;
})(this);
