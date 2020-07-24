import { Component, ViewChild, ElementRef, ViewChildren, AfterViewInit } from '@angular/core';
import {NativeElement} from "./decorators/decorators"
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  title = 'VIDEO-PLAYER';

  @ViewChild('videoContainer')
    videoContainer: ElementRef
  @ViewChild('videoEl') private video: ElementRef;
  @ViewChild('controlsContainer') controlsContainer : ElementRef;
  @ViewChild('progressBar') progressBar : ElementRef;
  @ViewChild('watchedBar') watchedBar : ElementRef;
  @ViewChild('timeLeft') timeLeft : ElementRef;
  @ViewChild('playPauseButton') playPauseButton : ElementRef;
  @ViewChild('playButton') playButton : ElementRef;
  @ViewChild('pauseButton') pauseButton : ElementRef;
  @ViewChild('rewindButton') rewindButton : ElementRef;
  @ViewChild('fastForwardButton') fastForwardButton : ElementRef;
  @ViewChild('fullVolumeButton') fullVolumeButton : ElementRef;
  @ViewChild('mutedButton') mutedButton : ElementRef;
  @ViewChild('volumeButton') volumeButton : ElementRef;
  @ViewChild('fullScreenButton') fullScreenButton : ElementRef;
  @ViewChild('maximizeButton') maximizeButton : ElementRef;
  @ViewChild('minimizeButton') minimizeButton : ElementRef;

  mouseDown : boolean = false;


  controlsTimeout : any;

  ngAfterViewInit() {
    console.log("video - ",this.video)

    this.listenFullScreen();

    this.listenKeyUp();

    this.listePlayPause();

    this.listenTimeUpdate();

    this.listenProgressBarEvents();

    this.listenForwardRewindButtons();

    this.listenVolume();

    this.listenFullScreenClick();

  }

  listePlayPause(){
    this.playPauseButton.nativeElement.addEventListener('click', this.playPause);
  }

  initStyles(){
    this.controlsContainer.nativeElement.style.opacity = '0';
    this.watchedBar.nativeElement.style.width = '0px';
    this.pauseButton.nativeElement.style.display = 'none';
    this.minimizeButton.nativeElement.style.display = 'none';

  }

  listenFullScreen(){
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        this.maximizeButton.nativeElement.style.display = '';
        this.minimizeButton.nativeElement.style.display = 'none';
      } else {
        this.maximizeButton.nativeElement.style.display = 'none';
        this.minimizeButton.nativeElement.style.display = '';
      }
    });
  }

  listenKeyUp(){
    document.addEventListener('keyup', (event) => {
      if (event.code === 'Space') {
        debugger
        this.playPause();
      }

      if (event.code === 'KeyM') {
        this.toggleMute();
      }

      if (event.code === 'KeyF') {
        this.toggleFullScreen();
      }

      this.displayControls();
    });

    this.listenMouseMove();
  }

  listenMouseMove(){
    document.addEventListener('mousemove', () => {
      this.displayControls();
    });
  }

  playPause = () => {

    if (this.video.nativeElement.paused) {
      this.video.nativeElement.play();
      this.playButton.nativeElement.style.display = 'none';
      this.pauseButton.nativeElement.style.display = '';
    } else {
      this.video.nativeElement.pause();
      this.playButton.nativeElement.style.display = '';
      this.pauseButton.nativeElement.style.display = 'none';
    }
  }

  toggleMute(){
    this.video.nativeElement.muted = !(this.video.nativeElement.muted);
    if (this.video.nativeElement.muted) {
      this.fullVolumeButton.nativeElement.style.display = 'none';
      this.mutedButton.nativeElement.style.display = '';
    } else {
      this.fullVolumeButton.nativeElement.style.display = '';
      this.mutedButton.nativeElement.style.display = 'none';
    }
  }

  toggleFullScreen(){
    if (!document.fullscreenElement) {

      this.videoContainer.nativeElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  displayControls(){
    this.controlsContainer.nativeElement.style.opacity = '1';
    document.body.style.cursor = 'initial';
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
    }
    this.controlsTimeout = setTimeout(() => {
      this.controlsContainer.nativeElement.style.opacity = '0';
      document.body.style.cursor = 'none';
    }, 5000);
  }

  listenTimeUpdate(){
    debugger
    this.video.nativeElement.addEventListener('timeupdate', () => {
      this.watchedBar.nativeElement.style.width = ((this.video.nativeElement.currentTime / this.video.nativeElement.duration) * 100) + '%';
      // TODO: calculate hours as well...
      const totalSecondsRemaining = this.video.nativeElement.duration - this.video.nativeElement.currentTime;
      // THANK YOU: BEGANOVICH
      const time = new Date(null);
      time.setSeconds(totalSecondsRemaining);
      let hours = null;

      if(totalSecondsRemaining >= 3600) {
        hours = (time.getHours().toString()).padStart(2, '0');
      }

      let minutes = (time.getMinutes().toString()).padStart(2, '0');
      let seconds = (time.getSeconds().toString()).padStart(2, '0');

      this.timeLeft.nativeElement.textContent = `${hours ? hours : '00'}:${minutes}:${seconds}`;
    });
  }

  changeProgressBarPosition(xPosition:number){
    const pos = (xPosition - (this.progressBar.nativeElement.offsetLeft + this.progressBar.nativeElement.offsetParent.offsetLeft)) / this.progressBar.nativeElement.offsetWidth;
      this.video.nativeElement.currentTime = pos * this.video.nativeElement.duration;
  }

  listenProgressBarEvents(){


    this.progressBar.nativeElement.addEventListener('click', (event) => {
      this.changeProgressBarPosition(event.pageX);
    });

    this.progressBar.nativeElement.addEventListener('mousedown',() => {
      this.mouseDown = true;
    })


    this.progressBar.nativeElement.addEventListener('mouseup', () => {
      this.mouseDown = false;
    })

    this.progressBar.nativeElement.addEventListener('mousemove',(e) => {
      if(this.mouseDown){
        this.changeProgressBarPosition(e.clientX);
      }
      console.log(this.progressBar)
      if(e.clientY < this.progressBar.nativeElement.offsetTop){
        this.mouseDown  = false;
      }
    })


  }



  listenForwardRewindButtons(){
    this.rewindButton.nativeElement.addEventListener('click', () => {
      this.video.nativeElement.currentTime -= 10;
    });

    this.fastForwardButton.nativeElement.addEventListener('click', () => {
      this.video.nativeElement.currentTime += 10;
    });
  }

  listenVolume(){
    this.volumeButton.nativeElement.addEventListener('click', this.toggleMute());
  }

  listenFullScreenClick(){
    this.fullScreenButton.nativeElement.addEventListener('click', this.toggleFullScreen());
  }
}
