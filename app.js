var dash_button = require('node-dash-button');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var dash = dash_button('XX:XX:XX:XX:XX:XX', null, null, 'all');
var fs = require('fs');

function isPlaying () {
  try {
    fs.statSync('playing.txt');
    return false
  } catch(err) {
    if(err.code === 'ENOENT') return true
  }
}

dash.on('detected', function () {
  if (isPlaying()) {
    console.log('キャストを開始します。');
    fs.writeFile('playing.txt');
    exec('youtube-dl -o - https://www.youtube.com/watch?v=EHMXXOB6qPA | castnow --quiet - &');
  } else {
    console.log('キャストを停止します。');
    fs.unlink('playing.txt')
    var pid = execSync("ps -e -o pid,cmd | grep castnow | grep -v grep | awk '{ print $1 }'").toString();
    execSync('kill -9 ' + pid);
  }
});
