function BufferPool() {
    var buffers;
    this.push = function(buffer)  {
	buffers.push(buffer);
    }
}
