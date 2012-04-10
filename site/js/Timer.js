function Timer() {
    var startTime = 0.0;
    var pauseTime = 0.0;

    var started = false;
    var paused = false;

    this.start = function() {
	started = true;
	paused = false;
	startTime = (new Date).getTime();
    }

    this.stop = function() {
	started = false;
	paused = false;
    }

    this.pause = function() {
	if( ( started == true ) && ( paused == false ) )
	{
	    paused = true;
	    pauseTime = (new Date).getTime() - startTime;
	}
    }

    this.unPause = function() {
	paused = false;

	startTime = (new Date).getTime() - pauseTime;
    }

    this.getTicks = function() {
	if (started) {
	    if (paused) {
		return pauseTime;
	    } else {
		return (new Date).getTime() - startTime;
	    }
	}
    }
}
