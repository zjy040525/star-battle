const $app = $('#app')
const $header = {
  fuel: {
    icon: $('#fuelIcon'),
    value: $('#fuelValue'),
    fill: $('#fuelFill'),
  },
  score: {
    icon: $('#scoreIcon'),
    value: $('#scoreValue'),
  },
  time: {
    icon: $('#timeIcon'),
    value: $('#timeValue'),
  },
  pauseBtn: $('#pause'),
  muteBtn: $('#mute'),
  fontIncBtn: $('#fontInc'),
  fontDecBtn: $('#fontDec'),
}
const $start = {
  startBtn: $('#startBtn'),
  previewImage: $('#previewImage'),
}
const $play = {
  player: $('#player'),
  box: $('#box'),
  toUp: $('#toUp'),
  toLeft: $('#toLeft'),
  toRight: $('#toRight'),
  toDown: $('#toDown'),
}
const $over = {
  playerName: $('#playerName'),
  continueBtn: $('#continueBtn'),
}
const $rank = {
  rankList: $('#rankList'),
  replayBtn: $('#replayBtn'),
}

export { $app, $header, $over, $play, $rank, $start }
