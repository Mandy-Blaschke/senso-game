import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  fields: Field[] = [
    {name: 'yellow', color: '#c0c01a', sound: 'soundYellow', active: false},
    {name: 'blue', color: '#2525a8', sound: 'soundBlue', active: false},
    {name: 'green', color: '#2c932c', sound: 'soundGreen', active: false},
    {name: 'red', color: '#9e2626', sound: 'soundRed', active: false},
  ];
  simonsTurns: Field[] = [];
  playersTurns: Field[] = [];

  playerCanClick = false;
  activeGame = false;

  highscore = 0;
  level = 0;
  everPlayed = false;

  getSleeptime(): number {
    const ms = -40 * this.level + 1000;
    return Math.max(ms, 200);
  }

  ngOnInit(): void {
    this.loadHighscore();
    this.preloadAudios();
  }

  startGame(): void {
    this.activeGame = true;
    this.simonsTurn();
  }

  preloadAudios(): void {
    const audioYellow = new Audio();
    audioYellow.src = 'assets/beep-01.mp3';
    audioYellow.load();

    const audioBlue = new Audio();
    audioBlue.src = 'assets/beep-02.mp3';
    audioBlue.load();

    const audioGreen = new Audio();
    audioGreen.src = 'assets/beep-03.mp3';
    audioGreen.load();

    const audioRed = new Audio();
    audioRed.src = 'assets/beep-04.mp3';
    audioRed.load();
  }

  playAudioYellow(): void {
    const audio = new Audio();
    audio.src = 'assets/beep-01.mp3';
    audio.load();
    audio.play();
  }

  playAudioBlue(): void {
    const audio = new Audio();
    audio.src = 'assets/beep-02.mp3';
    audio.load();
    audio.play();
  }

  playAudioGreen(): void {
    const audio = new Audio();
    audio.src = 'assets/beep-03.mp3';
    audio.load();
    audio.play();
  }

  playAudioRed(): void {
    const audio = new Audio();
    audio.src = 'assets/beep-04.mp3';
    audio.load();
    audio.play();
  }

  playSound(field: Field): void {
    if (field.sound === 'soundYellow') {
      this.playAudioYellow();
    }
    if (field.sound === 'soundBlue') {
      this.playAudioBlue();
    }
    if (field.sound === 'soundGreen') {
      this.playAudioGreen();
    }
    if (field.sound === 'soundRed') {
      this.playAudioRed();
    }
    field.active = true;

    setTimeout(() => {
      field.active = false;
    }, 400);
  }

  repeatSimonsMoves(): Promise<void> {
    return new Promise((resolve) => {
      let offset = 0;

      this.simonsTurns.forEach((field) => {
        setTimeout(() => {
          this.playSound(field);
        }, offset += this.getSleeptime());
      });

      setTimeout(() => {
        resolve();
      }, offset += this.getSleeptime());

    });

  }

  simonsTurn(): void {
    this.playerCanClick = false;
    if (this.activeGame) {
      this.simonsMove();

      this.repeatSimonsMoves().then(() => {
        this.playerCanClick = true;
        this.playersTurns = [];
      });
    }
  }

  simonsMove(): void {
    const simonsChoice = this.fields[Math.floor(Math.random() * this.fields.length)];
    this.simonsTurns.push(simonsChoice);
  }

  playersMove(field: Field): void {
    if (this.playerCanClick) {
      this.playSound(field);
      this.playersTurns.push(field);
      const index = this.playersTurns.length - 1;

      if (this.playersTurns[index].name === this.simonsTurns[index].name) {

        if (this.playersTurns.length === this.simonsTurns.length) {
          this.level++;
          this.playerCanClick = false;
          setTimeout(() => {
            this.simonsTurn();
          }, 1200);
        }
      } else {
        this.gameFinished();
      }
    }
  }

  gameFinished(): void {
    this.everPlayed = true;
    this.saveHighscore();
    this.simonsTurns = [];
    this.playersTurns = [];
    this.activeGame = false;
    this.level = 0;
  }

  saveHighscore(): void {
    if (this.level > this.highscore) {
      this.highscore = this.level;
      localStorage.setItem('highscore', JSON.stringify(this.highscore));
    }
  }

  loadHighscore(): void {
    const score = localStorage.getItem('highscore');

    if (score) {
      this.highscore = JSON.parse(score);
      this.everPlayed = true;
    }
  }

}

export interface Field {
  color: string;
  sound: string;
  active: boolean;
  name: string;
}
