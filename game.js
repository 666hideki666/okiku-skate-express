(() => {
  "use strict";

  const W = 1280;
  const H = 720;
  const SPEED = 190;
  const END_DISTANCE = 10000;
  const GROUND_Y = 648;
  const PLAYER_X = 300;
  const CHARACTER_X = 92;
  const CHARACTER_Y = 317;
  const CHARACTER_W = 365;
  const CHARACTER_H = 333;
  const PANEL_STEP = 1100;
  const BLEND = 64;
  const BACKGROUND_Y = -90;
  const ROAD_SOURCE_Y = 820;
  const JUMP_TIME = 0.95;
  const JUMP_HEIGHT = 112;
  const JUMP_FORWARD = 125;
  const CRASH_RESULT_TIME = 1.65;
  const COOKIE_GRAVITY = 1500;
  const COOKIE_CROP = [356, 334, 600, 538];
  const CONTROLS_HINT_DURATION = 3;
  const CONTROLS_HINT_FADE = .4;
  const COOKIE_LAUNCHES = [
    [.40, -280, -190, 26, -28, -5.3],
    [.45, -200, -270, 29, -3, 5.8],
    [.50, -145, -160, 25, -18, -4.4],
    [.54, 270, -235, 30, -39, 6.2],
    [.58, 330, -205, 27, -8, -5.6],
    [.63, 390, -280, 31, -25, 4.8],
    [.68, 520, -175, 25, -1, -6.5]
  ];
  const invulnerability = 1.2;
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const gameShell = document.getElementById("game-shell");
  const loading = document.getElementById("loading");
  const overlay = document.getElementById("overlay");
  const titleScreen = document.getElementById("title-screen");
  const storyScreen = document.getElementById("story-screen");
  const storySpeaker = document.getElementById("story-speaker");
  const storyDialogue = document.getElementById("story-dialogue");
  const storyCount = document.getElementById("story-count");
  const storyNext = document.getElementById("story-next");
  const storySkip = document.getElementById("story-skip");
  const goalUi = document.getElementById("goal-ui");
  const goalCaption = document.getElementById("goal-caption");
  const goalSuccess = document.getElementById("goal-success");
  const goalSpeaker = document.getElementById("goal-speaker");
  const goalDialogue = document.getElementById("goal-dialogue");
  const goalCount = document.getElementById("goal-count");
  const goalNext = document.getElementById("goal-next");
  const goalRetry = document.getElementById("goal-retry");
  const result = document.getElementById("result");
  const startButton = document.getElementById("start");
  const retryButton = document.getElementById("retry");
  const bgm = document.getElementById("bgm");
  const bgmToggle = document.getElementById("bgm-toggle");
  const fullscreenToggle = document.getElementById("fullscreen-toggle");
  const BGM_VOLUME = .22;
  const BGM_FADE_SECONDS = .9;
  const BGM_LOOP_TAIL_SECONDS = 1;
  const BGM_QUIET_STATES = new Set(["crashing", "gameover", "endingTransition", "ending", "success"]);
  bgm.volume = BGM_VOLUME;

  const art = {
    title: "Concept Art/タイトル画面,緑の街を滑るオキク案.png",
    story1: "Concept Art/オープニング01,モイモイのお願い_緑とボード修正案.png",
    story2: "Concept Art/オープニング02,オキクの返事_ボード位置統一案.png",
    story3: "Concept Art/オープニング03,クッキー受け取り_背景統一案.png",
    start: "Concept Art/新背景6景_改訂/00_モイモイのクッキー屋さん.png",
    residential: "Concept Art/新背景6景_改訂/01_住宅街_電柱修正版.png",
    parkEntrance: "Concept Art/新背景6景_改訂/02_公園入口.png",
    park: "Concept Art/新背景6景_改訂/03_公園沿い.png",
    parkExit: "Concept Art/新背景6景_改訂/04_公園出口.png",
    shopping: "Concept Art/新背景6景_改訂/05_商店街.png",
    nearGoal: "Concept Art/新背景6景_改訂/06_メイちゃんのお店手前.png",
    goal: "Concept Art/新背景6景_改訂/07_メイちゃんのお店全景.png",
    ending1: "Concept Art/ゴール01,到着してメイちゃんと向き合う案.png",
    ending2: "Concept Art/ゴール02,閉じた箱を手渡す案.png",
    ending3: "Concept Art/エンディング02,オキクとメイちゃんが箱を一緒に持つ案.png",
    ending4: "Concept Art/ゴール03,メイちゃんが箱を受け取る案.png",
    ride: "Concept Art/オキク,配達バッグ付き滑走案.png",
    flutter: "Concept Art/オキク,滑走はためき差分_バッグ付き案.png",
    jump1: "Concept Art/オキク,オーリー01踏み込み案.png",
    jump2: "Concept Art/オキク,オーリー02浮き上がり案.png",
    jump3: "Concept Art/オキク,オーリー03頂点案.png",
    jump4: "Concept Art/オキク,オーリー03b降下案.png",
    jump5: "Concept Art/オキク,オーリー04着地案.png",
    duck1: "Concept Art/オキク,しゃがみ01沈み込み案.png",
    duck2: "Concept Art/オキク,しゃがみ02低姿勢案.png",
    duck3: "Concept Art/オキク,しゃがみ03低姿勢はためき案.png",
    duck4: "Concept Art/オキク,しゃがみ04立ち上がり案.png",
    stumble: "Concept Art/オキク,よろめき案.png",
    fall: "Concept Art/オキク,転倒途中クッキー飛散案.png",
    seated: "Concept Art/オキク,転倒後座り込み案.png",
    cookie: "Concept Art/クッキー,飛散と着地用単体.png",
    looseBoard: "Concept Art/スケボー,転倒後単体案.png",
    rock: "Concept Art/障害物,小石.png",
    box: "Concept Art/障害物,段ボール箱.png",
    pigeonUp: "Concept Art/障害物,ハト羽上げ案.png",
    pigeonDown: "Concept Art/障害物,ハト羽下げ案.png"
  };
  const images = {};
  const route = ["residential", "parkEntrance", "park", "parkExit", "shopping", "nearGoal"];
  const backgrounds = ["start", ...route, ...route, "goal"];
  const backgroundSpeed = PANEL_STEP * (backgrounds.length - 1) / END_DISTANCE;
  const obstaclePlan = [
    [1500, "rock"], [2400, "pigeon"], [3300, "box"],
    [4200, "rock"], [5100, "pigeon"], [6000, "box"],
    [6900, "pigeon"], [7800, "rock"], [8700, "box"]
  ];
  const story = [
    { image: "story1", speaker: "モイモイ", dialogue: "オキク、メイちゃんのお店までクッキーを届けてくれる？" },
    { image: "story2", speaker: "オキク", dialogue: "もちろん！ まかせて！" },
    { image: "story3", speaker: "モイモイ", dialogue: "ありがとう。気をつけて行ってきてね！" }
  ];
  const ending = [
    { image: "ending1", speaker: "メイ", dialogue: "オキク！ 待ってたよ！" },
    { image: "ending2", speaker: "オキク", dialogue: "モイモイから、クッキーのお届けだよ！" },
    { image: "ending3", speaker: "メイ", dialogue: "ありがとう！" },
    { image: "ending4", speaker: "オキク", dialogue: "どういたしまして！" }
  ];

  let state = "title";
  let storyIndex = 0;
  let distance = 0;
  let controlsHintAge = 0;
  let bgmEnabled = true;
  let bgmFailed = false;
  let bgmPlayRequest = 0;
  let resumeBgmWhenVisible = false;
  let bgmVolume = BGM_VOLUME;
  let bgmQuietAge = 0;
  let bgmWasQuiet = false;
  let collisions = 0;
  let elapsed = 0;
  let jumpElapsed = -1;
  let jumpOffset = 0;
  let jumpStartOffset = 0;
  let duckHeld = false;
  let duckAge = 0;
  let riseAge = 1;
  let hitAge = 99;
  let immuneAge = 99;
  let crashAge = 0;
  let crashX = CHARACTER_X;
  let crashCookies = [];
  let endingIndex = 0;
  let endingAge = 0;
  let endingPanelAge = 0;
  let lastFrame = performance.now();
  let keyboardDuck = false;
  const pointerZones = new Map();
  let obstacles = [];

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  function renderBgmToggle() {
    const playing = bgmEnabled && (!bgm.paused || resumeBgmWhenVisible || BGM_QUIET_STATES.has(state));
    bgmToggle.setAttribute("aria-pressed", String(bgmEnabled));
    if (!bgmEnabled) {
      bgmToggle.textContent = "♪ BGM オフ";
      bgmToggle.setAttribute("aria-label", "BGMをオンにする");
    } else if (playing) {
      bgmToggle.textContent = "♪ BGM オン";
      bgmToggle.setAttribute("aria-label", "BGMをオフにする");
    } else if (bgmFailed) {
      bgmToggle.textContent = "♪ タップして再生";
      bgmToggle.setAttribute("aria-label", "タップしてBGMを再生する");
    } else {
      bgmToggle.textContent = "♪ BGMを再生";
      bgmToggle.setAttribute("aria-label", "BGMを再生する");
    }
  }

  function tryPlayBgm() {
    if (!bgmEnabled || !bgm.paused) return;
    const request = ++bgmPlayRequest;
    let playback;
    try {
      playback = bgm.play();
    } catch {
      bgmFailed = true;
      renderBgmToggle();
      return;
    }
    if (playback && typeof playback.then === "function") {
      playback.then(() => {
        if (request !== bgmPlayRequest || !bgmEnabled) {
          bgm.pause();
          return;
        }
        bgmFailed = false;
        renderBgmToggle();
      }).catch(() => {
        if (request !== bgmPlayRequest) return;
        bgmFailed = true;
        renderBgmToggle();
      });
    }
  }

  function updateBgm(dt) {
    const quiet = BGM_QUIET_STATES.has(state);
    const targetVolume = bgmEnabled && !quiet ? BGM_VOLUME : 0;
    const step = BGM_VOLUME * dt / BGM_FADE_SECONDS;
    if (bgmVolume < targetVolume) bgmVolume = Math.min(targetVolume, bgmVolume + step);
    else if (bgmVolume > targetVolume) bgmVolume = Math.max(targetVolume, bgmVolume - step);
    try { bgm.volume = bgmVolume; } catch { /* Some mobile browsers use hardware volume only. */ }
    if (quiet) {
      if (!bgmWasQuiet) bgmQuietAge = 0;
      bgmQuietAge += dt;
      bgmWasQuiet = true;
      if (bgmEnabled && !bgm.paused && bgmQuietAge >= BGM_FADE_SECONDS) bgm.pause();
    } else {
      bgmQuietAge = 0;
      bgmWasQuiet = false;
    }
  }

  const isJumping = () => jumpElapsed >= 0 && jumpElapsed < JUMP_TIME;
  function jumpLift() {
    if (!isJumping()) return 0;
    return JUMP_HEIGHT * Math.sqrt(Math.sin(Math.PI * jumpElapsed / JUMP_TIME));
  }

  function distanceToScreenPixels(worldDistance) {
    return worldDistance * backgroundSpeed;
  }

  function obstacleScreenX(obstacle) {
    return PLAYER_X + distanceToScreenPixels(obstacle.worldX - distance);
  }

  function updateFullscreenToggle() {
    const isFullscreen = document.fullscreenElement === gameShell || document.webkitFullscreenElement === gameShell;
    fullscreenToggle.textContent = isFullscreen ? "⛶ 元の表示" : "⛶ 全画面";
    fullscreenToggle.setAttribute("aria-label", isFullscreen ? "全画面表示を終了する" : "ゲームを全画面表示にする");
    fullscreenToggle.setAttribute("aria-pressed", String(isFullscreen));
  }

  const requestFullscreen = gameShell.requestFullscreen || gameShell.webkitRequestFullscreen;
  const exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen;
  if (!requestFullscreen || !exitFullscreen) fullscreenToggle.classList.add("hidden");
  fullscreenToggle.addEventListener("click", async () => {
    try {
      const isFullscreen = document.fullscreenElement === gameShell || document.webkitFullscreenElement === gameShell;
      if (isFullscreen) await exitFullscreen.call(document);
      else await requestFullscreen.call(gameShell);
    } catch {
      fullscreenToggle.textContent = "全画面を開始できません";
      fullscreenToggle.setAttribute("aria-label", "全画面表示を開始できませんでした");
      return;
    }
    updateFullscreenToggle();
  });
  document.addEventListener("fullscreenchange", updateFullscreenToggle);
  document.addEventListener("webkitfullscreenchange", updateFullscreenToggle);
  updateFullscreenToggle();

  function updateDuck() {
    const next = keyboardDuck || [...pointerZones.values()].includes("left");
    if (next !== duckHeld) {
      duckHeld = next;
      if (next) duckAge = 0;
      else riseAge = 0;
    }
  }

  function jump() {
    if (state !== "playing" || isJumping() || duckHeld) return;
    jumpStartOffset = jumpOffset;
    jumpElapsed = 0;
  }

  function reset() {
    distance = 0;
    controlsHintAge = 0;
    collisions = 0;
    elapsed = 0;
    jumpElapsed = -1;
    jumpOffset = 0;
    jumpStartOffset = 0;
    duckHeld = false;
    duckAge = 0;
    riseAge = 1;
    hitAge = 99;
    immuneAge = 99;
    crashAge = 0;
    crashX = CHARACTER_X;
    crashCookies = [];
    endingIndex = 0;
    endingAge = 0;
    endingPanelAge = 0;
    keyboardDuck = false;
    pointerZones.clear();
    obstacles = obstaclePlan.map(([worldX, type]) => ({ worldX, type, resolved: false }));
    state = "playing";
    bgmQuietAge = 0;
    bgmWasQuiet = false;
    tryPlayBgm();
    titleScreen.classList.add("hidden");
    storyScreen.classList.add("hidden");
    goalUi.classList.add("hidden");
    goalCaption.classList.add("hidden");
    goalSuccess.classList.add("hidden");
    goalNext.classList.add("hidden");
    goalRetry.classList.add("hidden");
    overlay.classList.add("hidden");
    lastFrame = performance.now();
    startButton.blur();
    retryButton.blur();
    goalRetry.blur();
    goalNext.blur();
  }

  function showStory(index) {
    storyIndex = index;
    state = "story";
    const panel = story[storyIndex];
    storySpeaker.textContent = panel.speaker;
    storyDialogue.textContent = panel.dialogue;
    storyCount.textContent = `${storyIndex + 1} / ${story.length}　画面をタップして次へ`;
    storyNext.textContent = storyIndex === story.length - 1 ? "配達へ →" : "次へ →";
    titleScreen.classList.add("hidden");
    storyScreen.classList.remove("hidden");
    startButton.blur();
    storyNext.blur();
  }

  function advanceStory() {
    if (state !== "story") return;
    if (storyIndex < story.length - 1) showStory(storyIndex + 1);
    else reset();
  }

  function finishFailure() {
    state = "gameover";
    document.getElementById("result-eyebrow").textContent = "DELIVERY INTERRUPTED";
    document.getElementById("result-title").textContent = "クッキーが…！";
    document.getElementById("result-message").textContent = "クッキーがこぼれてしまいました。もう一度挑戦しよう。";
    result.classList.add("failure");
    result.classList.remove("hidden");
    overlay.classList.remove("hidden");
  }

  function startEnding() {
    state = "endingTransition";
    endingAge = 0;
    pointerZones.clear();
    keyboardDuck = false;
    updateDuck();
  }

  function showEndingPanel(index) {
    endingIndex = index;
    endingPanelAge = 0;
    state = "ending";
    goalSpeaker.textContent = ending[index].speaker;
    goalDialogue.textContent = ending[index].dialogue;
    goalCount.textContent = index === ending.length - 1
      ? `${index + 1} / ${ending.length}`
      : `${index + 1} / ${ending.length}　画面をタップして次へ`;
    goalUi.classList.remove("hidden");
    goalCaption.classList.remove("hidden");
    goalSuccess.classList.add("hidden");
    goalNext.classList.add("hidden");
    goalRetry.classList.add("hidden");
    goalCount.classList.remove("hidden");
    goalNext.blur();
  }

  function advanceEnding() {
    if (state !== "ending" || endingPanelAge < .75 || endingIndex >= ending.length - 1) return;
    showEndingPanel(endingIndex + 1);
  }

  function startCrash() {
    crashAge = 0;
    crashX = CHARACTER_X + jumpOffset;
    crashCookies = COOKIE_LAUNCHES.map(([delay, vx, vy, size, groundOffset, spin], index) => ({
      age: -delay,
      x: crashX + 174 + (index % 3) * 6,
      y: 451 + (index % 2) * 8,
      vx, vy, size, spin,
      angle: index * .43,
      groundY: GROUND_Y - size * .45 + groundOffset,
      bounces: 0,
      landed: false
    }));
    state = "crashing";
  }

  function updateCrashCookies(dt) {
    for (const cookie of crashCookies) {
      const previousAge = cookie.age;
      cookie.age += dt;
      if (cookie.age < 0) continue;
      const activeDt = previousAge < 0 ? cookie.age : dt;
      if (cookie.landed) {
        cookie.x += cookie.vx * activeDt;
        cookie.angle += cookie.spin * activeDt;
        cookie.vx *= Math.exp(-14 * activeDt);
        cookie.spin *= Math.exp(-15 * activeDt);
        if (Math.abs(cookie.vx) < 4) cookie.vx = 0;
        if (Math.abs(cookie.spin) < .1) cookie.spin = 0;
        continue;
      }
      cookie.x += cookie.vx * activeDt;
      cookie.vy += COOKIE_GRAVITY * activeDt;
      cookie.y += cookie.vy * activeDt;
      cookie.angle += cookie.spin * activeDt;
      if (cookie.y >= cookie.groundY) {
        cookie.y = cookie.groundY;
        if (cookie.bounces === 0) {
          cookie.bounces = 1;
          cookie.vy *= -.18;
          cookie.vx *= .72;
          cookie.spin *= .6;
        } else {
          cookie.landed = true;
          cookie.vy = 0;
          cookie.vx *= .45;
          cookie.spin *= .25;
        }
      }
    }
  }

  function update(dt) {
    if (state === "crashing" || state === "gameover") {
      crashAge += dt;
      updateCrashCookies(dt);
      if (state === "crashing" && crashAge >= CRASH_RESULT_TIME) finishFailure();
      return;
    }
    if (state === "endingTransition") {
      endingAge += dt;
      if (endingAge >= .36) showEndingPanel(0);
      return;
    }
    if (state === "ending") {
      endingPanelAge += dt;
      if (endingIndex < ending.length - 1 && endingPanelAge >= .75) goalNext.classList.remove("hidden");
      if (endingIndex === ending.length - 1 && endingPanelAge >= 1.4) {
        state = "success";
        goalSuccess.classList.remove("hidden");
        goalCount.classList.add("hidden");
        goalRetry.classList.remove("hidden");
      }
      return;
    }
    if (state !== "playing") return;
    elapsed += dt;
    controlsHintAge += dt;
    distance = Math.min(END_DISTANCE, distance + SPEED * dt);
    hitAge += dt;
    immuneAge += dt;
    if (duckHeld) duckAge += dt;
    else riseAge += dt;
    if (isJumping()) {
      jumpElapsed += dt;
      if (jumpElapsed >= JUMP_TIME) {
        jumpElapsed = -1;
        jumpOffset = JUMP_FORWARD;
      } else {
        jumpOffset = jumpStartOffset + (JUMP_FORWARD - jumpStartOffset) * jumpElapsed / JUMP_TIME;
      }
    } else {
      jumpOffset = Math.max(0, jumpOffset - JUMP_FORWARD * dt);
    }

    for (const obstacle of obstacles) {
      if (obstacle.resolved) continue;
      const x = obstacleScreenX(obstacle);
      const halfWidth = obstacle.type === "pigeon" ? 62 : obstacle.type === "box" ? 37 : 43;
      const left = (obstacle.type === "pigeon" ? 250 : 285) + jumpOffset;
      const right = (obstacle.type === "pigeon" ? 430 : 375) + jumpOffset;
      if (x + halfWidth < left) {
        obstacle.resolved = true;
        continue;
      }
      if (x - halfWidth > right) continue;
      const avoided = obstacle.type === "pigeon"
        ? duckHeld && !isJumping()
        : jumpLift() >= (obstacle.type === "box" ? 70 : 38);
      if (avoided) continue;
      obstacle.resolved = true;
      if (immuneAge < invulnerability) continue;
      collisions++;
      immuneAge = 0;
      hitAge = 0;
      if (collisions >= 3) {
        startCrash();
        return;
      }
    }
    if (distance >= END_DISTANCE) startEnding();
  }

  function drawImage(key, sx, sy, sw, sh, dx, dy, dw, dh) {
    const im = images[key];
    if (im) ctx.drawImage(im, sx, sy, sw, sh, dx, dy, dw, dh);
  }

  function drawBackground() {
    const sceneryDistance = distanceToScreenPixels(distance);
    ctx.fillStyle = "#8ec5ef";
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, W, 512);
    ctx.clip();
    for (let i = 0; i < backgrounds.length; i++) {
      const x = i * PANEL_STEP - sceneryDistance;
      if (x > W || x + 1280 < 0) continue;
      const key = backgrounds[i];
      const im = images[key];
      if (i === 0) {
        ctx.drawImage(im, x, BACKGROUND_Y, 1280, 720);
      } else {
        const fadeEnd = x + BLEND;
        if (fadeEnd > 0 && x < W) {
          for (let strip = 0; strip < BLEND; strip += 12) {
            const stripWidth = Math.min(12, BLEND - strip);
            const sourceX = strip / 1280 * im.width;
            ctx.globalAlpha = clamp((strip + 6) / BLEND, 0, 1);
            ctx.drawImage(im, sourceX, 0, stripWidth / 1280 * im.width, im.height,
              x + strip, BACKGROUND_Y, stripWidth, 720);
          }
          ctx.globalAlpha = 1;
        }
        ctx.drawImage(im, BLEND / 1280 * im.width, 0,
          im.width * (1 - BLEND / 1280), im.height,
          fadeEnd, BACKGROUND_Y, 1280 - BLEND, 720);
      }
    }
    ctx.restore();

    // The road is a continuous foreground layer, moving faster than the scenery.
    ctx.fillStyle = "#666779";
    ctx.fillRect(0, 510, W, 210);
    const roadStep = 1160;
    const roadBlend = 120;
    const roadOffset = distance * 1.75 % roadStep;
    const roadImage = images.residential;
    const roadSourceHeight = roadImage.height - ROAD_SOURCE_Y;
    for (let i = -1; i <= 2; i++) {
      const x = i * roadStep - roadOffset;
      if (i === -1) {
        drawImage("residential", 0, ROAD_SOURCE_Y, roadImage.width, roadSourceHeight, x, 510, 1280, 210);
        continue;
      }
      for (let strip = 0; strip < roadBlend; strip += 12) {
        ctx.globalAlpha = (strip + 6) / roadBlend;
        drawImage("residential", strip / 1280 * roadImage.width, ROAD_SOURCE_Y,
          12 / 1280 * roadImage.width, roadSourceHeight,
          x + strip, 510, 12, 210);
      }
      ctx.globalAlpha = 1;
      drawImage("residential", roadBlend / 1280 * roadImage.width, ROAD_SOURCE_Y,
        (1280 - roadBlend) / 1280 * roadImage.width, roadSourceHeight,
        x + roadBlend, 510, 1280 - roadBlend, 210);
    }
    const curb = ctx.createLinearGradient(0, 507, 0, 532);
    curb.addColorStop(0, "#f7e8d0");
    curb.addColorStop(.25, "#b8a58f");
    curb.addColorStop(.6, "#706b68");
    curb.addColorStop(1, "#495461");
    ctx.fillStyle = curb;
    ctx.fillRect(0, 507, W, 25);
    ctx.fillStyle = "#e5ebef";
    ctx.fillRect(0, 532, W, 3);
    ctx.fillStyle = "#dedbd1";
    ctx.globalAlpha = .85;
    for (let i = -1; i < 6; i++) {
      const x = i * 310 - (distance * 2.1 % 310);
      ctx.beginPath();
      ctx.roundRect(x, 690, 145, 4, 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawObstacle(o) {
    const x = obstacleScreenX(o);
    if (x < -160 || x > W + 160) return;
    if (o.type === "rock") {
      drawImage("rock", 326, 325, 1245, 385, x - 43, GROUND_Y - 33, 86, 33);
    } else if (o.type === "box") {
      drawImage("box", 330, 185, 920, 680, x - 37, GROUND_Y - 66, 74, 66);
    } else {
      const up = Math.floor(elapsed * 7) % 2 === 0;
      if (up) drawImage("pigeonUp", 325, 5, 1025, 955, x - 62, 298, 124, 97);
      else drawImage("pigeonDown", 115, 150, 1340, 810, x - 62, 300, 124, 94);
    }
  }

  function characterFrame() {
    if (hitAge < .48) return "stumble";
    if (isJumping()) {
      const t = jumpElapsed / JUMP_TIME;
      if (t < .12) return "jump1";
      if (t < .28) return "jump2";
      if (t < .66) return "jump3";
      if (t < .93) return "jump4";
      return "jump5";
    }
    if (duckHeld) {
      if (duckAge < .09) return "duck1";
      return Math.floor((duckAge - .09) * 5) % 2 ? "duck3" : "duck2";
    }
    if (riseAge < .12) return "duck4";
    return Math.floor(elapsed * 3.3) % 2 ? "flutter" : "ride";
  }

  function drawCharacter() {
    const lift = jumpLift();
    const im = images[characterFrame()];
    if (!im) return;
    const entrance = 470 * Math.max(0, 1 - elapsed / 2.4);
    const drawX = CHARACTER_X + entrance + jumpOffset;
    ctx.save();
    if (immuneAge < invulnerability && Math.floor(immuneAge * 10) % 2) ctx.globalAlpha = .55;
    if (hitAge < .48) {
      ctx.translate(drawX + CHARACTER_W / 2, CHARACTER_Y + CHARACTER_H - lift);
      ctx.rotate(Math.sin(hitAge * 40) * .045);
      ctx.drawImage(im, -CHARACTER_W / 2, -CHARACTER_H, CHARACTER_W, CHARACTER_H);
    } else {
      ctx.drawImage(im, drawX, CHARACTER_Y - lift, CHARACTER_W, CHARACTER_H);
    }
    ctx.restore();
  }

  function drawCrashPose(key, x, y, width, height, angle, opacity) {
    const im = images[key];
    if (!im || opacity <= 0) return;
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(x + width / 2, y + height);
    ctx.rotate(angle);
    ctx.drawImage(im, -width / 2, -height, width, height);
    ctx.restore();
  }

  function drawCrashBoard() {
    if (crashAge < .56) return;
    const im = images.looseBoard;
    if (!im) return;
    const progress = clamp((crashAge - .56) / .65, 0, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    ctx.save();
    ctx.globalAlpha = clamp((crashAge - .56) / .17, 0, 1);
    ctx.drawImage(im, crashX + 95 + 300 * ease, GROUND_Y - 57, 218, 69);
    ctx.restore();
  }

  function drawCrashCharacter() {
    const t = crashAge;
    const fallProgress = clamp((t - .17) / .55, 0, 1);
    const fallX = crashX + 16 + 20 * fallProgress;
    const fallY = CHARACTER_Y - 12 * Math.sin(Math.PI * fallProgress);
    const fallAngle = -.035 + .075 * fallProgress;
    const sitProgress = clamp((t - .58) / .30, 0, 1);
    const sitEase = 1 - Math.pow(1 - sitProgress, 3);
    const sitY = GROUND_Y - 300 - 18 * (1 - sitEase);
    const drawStumble = opacity => drawCrashPose("stumble", crashX, CHARACTER_Y, CHARACTER_W, CHARACTER_H, Math.sin(t * 27) * .04, opacity);
    const drawFall = opacity => drawCrashPose("fall", fallX, fallY, CHARACTER_W, CHARACTER_H, fallAngle, opacity);
    const drawSeated = opacity => drawCrashPose("seated", crashX + 28, sitY, 360, 326, -.045 * (1 - sitEase), opacity);
    if (t < .17) drawStumble(1);
    else if (t < .29) {
      const mix = (t - .17) / .12;
      drawStumble(1 - mix);
      drawFall(mix);
    } else if (t < .58) drawFall(1);
    else if (t < .76) {
      const mix = (t - .58) / .18;
      drawFall(1 - mix);
      drawSeated(mix);
    } else drawSeated(1);
  }

  function drawCrashCookies(landed) {
    const im = images.cookie;
    if (!im) return;
    for (const cookie of crashCookies) {
      if (cookie.age < 0 || cookie.landed !== landed) continue;
      const height = cookie.size * COOKIE_CROP[3] / COOKIE_CROP[2];
      ctx.save();
      ctx.globalAlpha = clamp(cookie.age / .10, 0, 1);
      ctx.translate(cookie.x, cookie.y);
      ctx.rotate(cookie.angle);
      ctx.drawImage(im, ...COOKIE_CROP, -cookie.size / 2, -height / 2, cookie.size, height);
      ctx.restore();
    }
  }

  function roundBox(x, y, w, h, radius, fill) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
    ctx.fill();
  }

  function drawHud() {
    const remaining = Math.ceil((END_DISTANCE - distance) / 100);
    roundBox(28, 22, 278, 78, 18, "#17343cd9");
    ctx.fillStyle = "#ffe9c7";
    ctx.font = "700 20px system-ui";
    ctx.fillText("メイちゃんのお店まで", 47, 51);
    ctx.font = "900 38px system-ui";
    ctx.fillText(`${remaining} m`, 47, 88);
    roundBox(984, 22, 268, 78, 18, "#17343cd9");
    ctx.fillStyle = "#ffe9c7";
    ctx.font = "700 20px system-ui";
    ctx.fillText("ぶつかった回数", 1004, 51);
    ctx.font = "900 38px system-ui";
    ctx.fillText(`${collisions} / 3`, 1004, 87);
    roundBox(395, 56, 490, 8, 4, "#17343c99");
    roundBox(395, 56, Math.max(6, 490 * distance / END_DISTANCE), 8, 4, "#f0bb60");
    if (state === "playing" && controlsHintAge < CONTROLS_HINT_DURATION) {
      const opacity = clamp((CONTROLS_HINT_DURATION - controlsHintAge) / CONTROLS_HINT_FADE, 0, 1);
      ctx.save();
      ctx.globalAlpha = opacity;
      roundBox(330, 112, 620, 62, 24, "#fff8e9ed");
      ctx.fillStyle = "#8d3d2c";
      ctx.textAlign = "center";
      ctx.font = "800 20px system-ui";
      ctx.fillText("左側を長押し：しゃがむ", 485, 151);
      ctx.fillStyle = "#b8a58f";
      ctx.fillRect(640, 128, 2, 30);
      ctx.fillStyle = "#31535b";
      ctx.fillText("右側をタップ：ジャンプ", 795, 151);
      ctx.restore();
      ctx.textAlign = "left";
    }
  }

  function drawEnding() {
    ctx.drawImage(images[ending[endingIndex].image], 0, 0, W, H);
    const fade = clamp(1 - endingPanelAge / .18, 0, 1);
    if (fade > 0) {
      ctx.fillStyle = `rgba(23, 45, 53, ${fade})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  function draw() {
    canvas.dataset.distance = String(Math.floor(distance));
    canvas.dataset.collisions = String(collisions);
    canvas.dataset.state = state;
    canvas.dataset.storyIndex = state === "story" ? String(storyIndex) : "";
    canvas.dataset.endingIndex = state === "ending" || state === "success" ? String(endingIndex) : "";
    canvas.dataset.cookiesActive = String(crashCookies.filter(cookie => cookie.age >= 0).length);
    canvas.dataset.cookiesLanded = String(crashCookies.filter(cookie => cookie.landed).length);
    if (state === "title" || state === "story") {
      const key = state === "title" ? "title" : story[storyIndex].image;
      const im = images[key];
      if (im) ctx.drawImage(im, 0, 0, W, H);
      return;
    }
    if (state === "ending" || state === "success") {
      drawEnding();
      return;
    }
    if (state === "endingTransition") {
      drawBackground();
      drawCharacter();
      ctx.fillStyle = `rgba(23, 45, 53, ${clamp(endingAge / .36, 0, 1)})`;
      ctx.fillRect(0, 0, W, H);
      return;
    }
    drawBackground();
    for (const obstacle of obstacles) if (obstacle.type !== "pigeon") drawObstacle(obstacle);
    if (state === "crashing" || state === "gameover") {
      drawCrashCookies(true);
      drawCrashBoard();
      drawCrashCharacter();
      drawCrashCookies(false);
    } else drawCharacter();
    for (const obstacle of obstacles) if (obstacle.type === "pigeon") drawObstacle(obstacle);
    drawHud();
  }

  function frame(now) {
    const dt = Math.min(.05, (now - lastFrame) / 1000);
    lastFrame = now;
    update(dt);
    updateBgm(dt);
    draw();
    requestAnimationFrame(frame);
  }

  function pointerZone(event) {
    const rect = canvas.getBoundingClientRect();
    return (event.clientX - rect.left) < rect.width / 2 ? "left" : "right";
  }

  canvas.addEventListener("pointerdown", event => {
    if (state === "story" || state === "ending") {
      event.preventDefault();
      if (state === "story") advanceStory();
      else advanceEnding();
      return;
    }
    if (state !== "playing") return;
    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);
    const zone = pointerZone(event);
    pointerZones.set(event.pointerId, zone);
    updateDuck();
    if (zone === "right") jump();
  });
  canvas.addEventListener("pointermove", event => {
    if (!pointerZones.has(event.pointerId)) return;
    const zone = pointerZone(event);
    if (zone !== pointerZones.get(event.pointerId)) {
      pointerZones.set(event.pointerId, zone);
      updateDuck();
    }
  });
  function endPointer(event) {
    pointerZones.delete(event.pointerId);
    updateDuck();
  }
  canvas.addEventListener("pointerup", endPointer);
  canvas.addEventListener("pointercancel", endPointer);
  canvas.addEventListener("lostpointercapture", endPointer);
  window.addEventListener("blur", () => {
    pointerZones.clear();
    keyboardDuck = false;
    updateDuck();
  });
  document.addEventListener("keydown", event => {
    if ((state === "story" || state === "ending") && ["Space", "Enter", "ArrowRight"].includes(event.code)) {
      if (event.target?.closest?.("button")) return;
      event.preventDefault();
      if (!event.repeat) {
        if (state === "story") advanceStory();
        else advanceEnding();
      }
      return;
    }
    if ((state === "success" || state === "gameover") && event.target?.closest?.("button")) return;
    if (["Space", "ArrowUp", "ArrowDown"].includes(event.code)) event.preventDefault();
    if (event.code === "ArrowDown") {
      keyboardDuck = true;
      updateDuck();
    } else if ((event.code === "Space" || event.code === "ArrowUp") && !event.repeat) jump();
  });
  document.addEventListener("keyup", event => {
    if (event.code === "ArrowDown") {
      keyboardDuck = false;
      updateDuck();
    }
  });
  document.addEventListener("visibilitychange", () => {
    lastFrame = performance.now();
    if (document.visibilityState === "hidden") {
      resumeBgmWhenVisible = bgmEnabled && !bgm.paused;
      bgm.pause();
    } else if (resumeBgmWhenVisible && bgmEnabled) {
      resumeBgmWhenVisible = false;
      tryPlayBgm();
    }
  });
  bgmToggle.addEventListener("click", () => {
    if (bgmEnabled && !(bgm.paused && bgmFailed)) {
      bgmEnabled = false;
      bgmPlayRequest++;
      resumeBgmWhenVisible = false;
      bgm.pause();
    } else {
      bgmEnabled = true;
      bgmFailed = false;
      tryPlayBgm();
    }
    renderBgmToggle();
  });
  bgm.addEventListener("play", renderBgmToggle);
  bgm.addEventListener("pause", renderBgmToggle);
  bgm.addEventListener("timeupdate", () => {
    if (Number.isFinite(bgm.duration) && bgm.duration - bgm.currentTime <= BGM_LOOP_TAIL_SECONDS) {
      bgm.currentTime = 0;
    }
  });
  bgm.addEventListener("error", () => {
    bgmFailed = true;
    renderBgmToggle();
  });
  tryPlayBgm();
  startButton.addEventListener("click", () => {
    tryPlayBgm();
    showStory(0);
  });
  storyNext.addEventListener("click", advanceStory);
  storySkip.addEventListener("click", reset);
  goalNext.addEventListener("click", advanceEnding);
  retryButton.addEventListener("click", reset);
  goalRetry.addEventListener("click", reset);

  Promise.all(Object.entries(art).map(([key, path]) => new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => { images[key] = im; resolve(); };
    im.onerror = () => reject(new Error(`画像を読み込めません: ${path}`));
    im.src = encodeURI(path);
  }))).then(() => {
    loading.classList.add("hidden");
    bgmToggle.classList.remove("hidden");
    lastFrame = performance.now();
    renderBgmToggle();
    requestAnimationFrame(frame);
  }).catch(error => { loading.textContent = error.message; });
})();
