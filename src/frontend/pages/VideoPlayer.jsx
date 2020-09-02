import React from 'react';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';

import toggleFullScreen from '../utils/funcs/fullScreen.js';

import VideoControls from '../components/VideoControls';

import '../assets/style/pages/VideoPlayer.scss';

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    const { movieId } = this.props.match.params;
    this.movie = this.props.movies.filter((movie) => movie._id == movieId)[0];
    this.state = {
      playing: false,
      played: 0,
      volume: 1,
      isFullScreen: false,
    };
    this.container = React.createRef();
    this.video = React.createRef();
    this.intervalID = 0;
  }

  handleSeek = (e) => {
    this.video.current.seekTo(e.target.value, 'fraction');
    this.setState({
      ...this.state,
      played: e.target.value,
    });
  };

  handleVolume = (e) => {
    this.setState({
      ...this.state,
      volume: parseFloat(e.target.value),
    });
  };

  handleMute = () => {
    if (!this.state.volume) {
      this.setState({
        ...this.state,
        volume: 1,
      });
    } else {
      this.setState({
        ...this.state,
        volume: 0,
      });
    }
  };

  handleTogglePlay = () => {
    if (!this.state.playing) {
      this.setState({
        ...this.state,
        playing: true,
        duration: this.video.current.getDuration(),
      });
      this.intervalID = setInterval(() => {
        this.setState({
          ...this.state,
          played: this.video.current.getCurrentTime() / this.state.duration,
        });
      }, 200);
    } else {
      clearInterval(this.intervalID);
      this.setState({
        ...this.state,
        playing: false,
      });
    }
  };

  handleFullScreen = (e) => {
    toggleFullScreen(this.container.current);
    this.setState({
      ...this.state,
      isFullScreen: !this.state.isFullScreen,
    });
  };

  handleEnd = () => {
    this.setState({
      ...this.state,
      playing: false,
    });
  };

  render() {
    const { playing, played, volume, duration, isFullScreen } = this.state;
    return (
      <div className="videoPlayer" ref={this.container}>
        <h1>{this.movie.title}</h1>
        <VideoControls
          {...this.state}
          handler={{
            play: this.handleTogglePlay,
            fullScreen: this.handleFullScreen,
            volume: this.handleVolume,
            mute: this.handleMute,
            seek: this.handleSeek,
          }}
        />
        <ReactPlayer
          ref={this.video}
          className="videoPlayer_player"
          url="http://clips.vorwaerts-gmbh.de/VfE_html5.mp4"
          playing={playing}
          pip={false}
          volume={volume}
          onEnded={this.handleEnd}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    movies: state.media.movies,
  };
};

export default connect(mapStateToProps, null)(VideoPlayer);